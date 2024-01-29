import catchAsync from '../utils/catchAsync';
import { Request, Response } from 'express';
import * as cloudProviderService from './cloudProvider.service';


export const getCloudProviderWithDetails = catchAsync(async (_: Request, res: Response) => {
    const result = await cloudProviderService.queryCloudProviders();
    res.send(result);
});