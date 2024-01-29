import { cloudProviderController } from '../../modules/clouldprovider';
import express, { Router } from 'express';

const router: Router = express.Router();

router
  .route('/')
  .get(cloudProviderController.getCloudProviderWithDetails);

export default router;