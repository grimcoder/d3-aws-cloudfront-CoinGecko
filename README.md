# React D3 Visualization with AWS CDK & Redis Caching

This project is a React application featuring interactive D3.js visualizations, routed with `react-router-dom`, and fully deployable to AWS using the Cloud Development Kit (CDK). It now includes a serverless backend with Redis caching to optimize data fetching.

## Application Features

- **React + Vite**: Fast, modern development environment.
- **Routing**: `react-router-dom` for seamless navigation between Home and Dashboard.
- **D3 Interactive Charts**: 
  - Real-time/historical cryptocurrency data visualization.
  - Interactive zooming and panning.
  - Tooltips with precise data inspection.
  - Multi-currency support (Bitcoin, Ethereum, Solana, Dogecoin).
  - Customizable date ranges (7D, 1M, 3M, 1Y).
- **Styling**: Premium transparency/glassmorphism aesthetics using Vanilla CSS.

## AWS Deployment (CDK)

The `infra/` directory contains a TypeScript CDK project that provisions a complete serverless architecture:

### Frontend
- **S3 Bucket**: Hosts the static website assets (HTML, CSS, JS).
- **CloudFront Distribution**: Serves the website globally with HTTPS and low latency.
- **Origin Access Control (OAC)**: Securely restricts S3 access.

### Backend (New!)
- **AWS Lambda**: Serverless compute to fetch data from CoinGecko.
- **Amazon ElastiCache (Redis)**: Caches API responses to reduce latency and avoid rate limits (423 error).
- **Amazon API Gateway**: Exposes the Lambda function as a RESTful API.
- **VPC & NAT Gateway**: Secure networking environment for the backend resources.

## How to Run

### Development

1. Create a `.env` file in the root directory:
   ```env
   VITE_API_BASE_URL=https://your-api-gateway-url.amazonaws.com/prod
   ```
2. Run the local development server:
   ```bash
   npm run dev
   ```

### Deploy to AWS

Prerequisites: Ensure you are authenticated with AWS (e.g., `aws sso login` or configured credentials).

To build and deploy the application:

```bash
npm run deploy
```

This script will automatically:
1. Build the React app (`npm run build`).
2. Synthesize and deploy the CDK stack (`npx cdk deploy`).
3. Output the **CloudFront URL** and **API Gateway URL** upon completion.

**Note:** The initial deployment may take 10-15 minutes as it provisions the VPC and Redis Cluster.

### Teardown

To delete all provisioned AWS resources and avoid incurring costs:

```bash
npm run destroy
```

## Live Demo
At the moment of publishing there is a sample running on https://d1lkadr265qk1d.cloudfront.net/dashboard
