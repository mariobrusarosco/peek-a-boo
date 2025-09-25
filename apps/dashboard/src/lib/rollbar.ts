import Rollbar from 'rollbar';

// Initialize Rollbar
const rollbar = new Rollbar({
  accessToken: process.env.ROLLBAR_ACCESS_TOKEN!,
  environment: process.env.NODE_ENV || 'development',
  captureUncaught: true,
  captureUnhandledRejections: true,
  payload: {
    code_version: process.env.VERCEL_GIT_COMMIT_SHA || 'unknown',
    server: {
      branch: process.env.VERCEL_GIT_COMMIT_REF || 'unknown',
      host: process.env.VERCEL_URL || 'localhost',
    },
  },
});

export default rollbar;