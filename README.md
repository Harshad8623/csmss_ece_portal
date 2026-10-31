# CSMSS ECE Portal — React Web Prototype

An academic departmental web portal built with a React frontend and Vite tooling.

## Tech stack

React, JavaScript, Vite, Tailwind CSS and dependencies for interface components, navigation and data visualization.

## Local setup

```bash
npm install
npm run start
```

The available build command is `npm run build`.

## Configuration and safety

Create a local `.env` from `.env.example` where appropriate. Never put private AI-provider API keys in `VITE_` variables: Vite bundles those values into browser-facing code. The current branch no longer tracks the prior `.env` file, but exposed historical values still require rotation. Frontend authorization also requires appropriately configured backend/database policies.

## Status

Student portfolio prototype. Deployment, authentication policy and production readiness have not been independently verified.

**Author:** [Harshad Madhav Dhuppe](https://github.com/Harshad8623)
