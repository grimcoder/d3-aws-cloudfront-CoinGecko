The React application with D3 visualization and AWS CDK deployment support has been successfully set up!

Application Features
React + Vite: Fast, modern development environment.
Routing: react-router-dom for navigation between Home and Dashboard.
D3 Visualization: Interactive cryptocurrency line chart (Bitcoin history) with hover effects and gradients.
API Integration: Fetches real-time/historical data from the public CoinGecko API.
Styling: Premium transparency/glassmorphism aesthetics with Vanilla CSS.
AWS Deployment (CDK)
Infrastructure: infra/ directory containing a TypeScript CDK project.
Resources:
S3 Bucket: Hosts the static website assets.
CloudFront Distribution: Serves the website globally with HTTPS.
S3 Deployment: Automatically uploads the dist folder content to S3.
Origin Access Control: Securely restricts S3 access to CloudFront only.
How to Run
Development:
bash
npm run dev
Deploy to AWS: Make sure you are authenticated with AWS (e.g., aws sso login or valid credentials).
bash
npm run deploy
This script will:
Build the React app (npm run build).
Deploy the infrastructure and assets via CDK (npx cdk deploy).
Output the CloudFront URL at the end.
Teardown: To delete all resources and avoid costs:
bash
npm run destroy