# React D3 Visualization with AWS CDK

This project is a React application featuring interactive D3.js visualizations, routed with `react-router-dom`, and fully deployable to AWS using the Cloud Development Kit (CDK).

## Application Features

- **React + Vite**: Fast, modern development environment.
- **Routing**: `react-router-dom` for seamless navigation between Home and Dashboard.
- **D3 Visualization**: Interactive cryptocurrency line chart (Bitcoin history) featuring:
  - Gradient styling
  - Hover effects with tooltips
  - Smooth animations
- **API Integration**: Fetches real-time/historical data from the public **CoinGecko API**.
- **Styling**: Premium transparency/glassmorphism aesthetics using Vanilla CSS.

## AWS Deployment (CDK)

The `infra/` directory contains a TypeScript CDK project that provision the following resources:

- **S3 Bucket**: Hosts the static website assets (HTML, CSS, JS).
- **CloudFront Distribution**: Serves the website globally with HTTPS and low latency.
- **Origin Access Control (OAC)**: Securely restricts S3 access so content is only served via CloudFront.
- **S3 Deployment**: Automatically uploads the contents of the `dist` folder to the S3 bucket during deployment.

## How to Run

### Development

Run the local development server:

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
3. Output the **CloudFront URL** upon completion.

### Teardown

To delete all provisioned AWS resources and avoid incurring costs:

```bash
npm run destroy
```