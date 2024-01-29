import { ICPDoc } from "./cloudProvider.interface";
import CloudProvider from "./cloudProvider.model";


/**
 * Query for CloudProviders
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
export const queryCloudProviders = async (): Promise<ICPDoc[]> => {
    const cloudProviders = await CloudProvider.find();
    return cloudProviders;
};