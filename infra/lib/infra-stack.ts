import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import * as path from 'path';

export class InfraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // 1. Create S3 Bucket
    const websiteBucket = new s3.Bucket(this, 'ReactD3Bucket', {
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      encryption: s3.BucketEncryption.S3_MANAGED,
      removalPolicy: cdk.RemovalPolicy.DESTROY, // For demo purposes only
      autoDeleteObjects: true, // For demo purposes only
    });

    // 2. Create CloudFront Distribution
    const distribution = new cloudfront.Distribution(this, 'ReactD3Distribution', {
      defaultBehavior: {
        origin: origins.S3BucketOrigin.withOriginAccessControl(websiteBucket),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      },
      defaultRootObject: 'index.html',
      errorResponses: [
        {
          httpStatus: 404,
          responseHttpStatus: 200,
          responsePagePath: '/index.html',
        },
        {
          httpStatus: 403,
          responseHttpStatus: 200,
          responsePagePath: '/index.html',
        },
      ],
    });

    // 3. Deploy site contents to S3
    new s3deploy.BucketDeployment(this, 'DeployReactApp', {
      sources: [s3deploy.Source.asset(path.join(__dirname, '../../dist'))],
      destinationBucket: websiteBucket,
      distribution,
      distributionPaths: ['/*'],
    });

    // 4. Output the URL
    new cdk.CfnOutput(this, 'DistributionDomainName', {
      value: distribution.distributionDomainName,
    });

    // ========================================================================
    // Backend Infrastructure (VPC + Redis + Lambda + API Gateway)
    // ========================================================================

    // 1. VPC (Required for ElastiCache)
    const vpc = new cdk.aws_ec2.Vpc(this, 'CryptoVpc', {
      maxAzs: 2,
      natGateways: 1, // Minimize cost, but 1 is needed for Lambda to reach CoinGecko
    });

    // 2. Security Groups
    const lambdaSg = new cdk.aws_ec2.SecurityGroup(this, 'LambdaSg', {
      vpc,
      description: 'Security Group for Crypto Lambda',
      allowAllOutbound: true,
    });

    const redisSg = new cdk.aws_ec2.SecurityGroup(this, 'RedisSg', {
      vpc,
      description: 'Security Group for Redis Cluster',
      allowAllOutbound: true,
    });

    // Allow Lambda to connect to Redis on port 6379
    redisSg.addIngressRule(
      lambdaSg,
      cdk.aws_ec2.Port.tcp(6379),
      'Allow Lambda to connect to Redis'
    );

    // 3. ElastiCache Redis Cluster
    const redisSubnetGroup = new cdk.aws_elasticache.CfnSubnetGroup(this, 'RedisSubnetGroup', {
      description: 'Subnet group for Redis',
      subnetIds: vpc.privateSubnets.map(subnet => subnet.subnetId),
    });

    const redisCluster = new cdk.aws_elasticache.CfnCacheCluster(this, 'CryptoRedis', {
      cacheNodeType: 'cache.t3.micro', // Smallest node type
      engine: 'redis',
      numCacheNodes: 1,
      autoMinorVersionUpgrade: true,
      cacheSubnetGroupName: redisSubnetGroup.ref,
      vpcSecurityGroupIds: [redisSg.securityGroupId],
      port: 6379,
    });

    // 4. Lambda Function
    const cryptoLambda = new cdk.aws_lambda_nodejs.NodejsFunction(this, 'CryptoHandler', {
      runtime: cdk.aws_lambda.Runtime.NODEJS_18_X,
      entry: path.join(__dirname, '../lambda/index.js'), // Point to logic file
      handler: 'handler',
      vpc,
      vpcSubnets: {
        subnetType: cdk.aws_ec2.SubnetType.PRIVATE_WITH_EGRESS,
      },
      securityGroups: [lambdaSg],
      environment: {
        REDIS_HOST: redisCluster.attrRedisEndpointAddress,
        REDIS_PORT: '6379',
      },
      timeout: cdk.Duration.seconds(30),
      bundling: {
        minify: true,
      },
    });

    // 5. API Gateway
    const api = new cdk.aws_apigateway.RestApi(this, 'CryptoApi', {
      restApiName: 'Crypto Service',
      defaultCorsPreflightOptions: {
        allowOrigins: cdk.aws_apigateway.Cors.ALL_ORIGINS,
        allowMethods: cdk.aws_apigateway.Cors.ALL_METHODS,
      },
    });

    const cryptoIntegration = new cdk.aws_apigateway.LambdaIntegration(cryptoLambda);

    // GET /history?coinId=...&days=...
    const historyResource = api.root.addResource('history');
    historyResource.addMethod('GET', cryptoIntegration);

    new cdk.CfnOutput(this, 'ApiUrl', {
      value: api.url,
      description: 'API Gateway URL',
    });
  }
}
