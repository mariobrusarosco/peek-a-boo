# Phase: Railway Deployment

This phase covers the deployment of the SDK service to Railway from our monorepo.

## Tasks

- [x] Create railway.json configuration file
- [x] Ensure port configuration is correct in main.ts
- [x] Ensure health endpoint exists
- [x] Create deployment guide
- [ ] Create Railway project and link repository
- [ ] Set root directory to apps/sdk-service
- [ ] Configure environment variables
- [ ] Deploy the service
- [ ] Verify deployment is working
- [ ] Set up CI/CD integration (optional)

## Notes

- We're using a monorepo with TurboRepo and PNPM, which requires special setup for Railway deployment
- The railway.json file is configured to navigate to the monorepo root for installing dependencies
- We build shared packages first, then the SDK service
- Environment variables need to be set up correctly for production 