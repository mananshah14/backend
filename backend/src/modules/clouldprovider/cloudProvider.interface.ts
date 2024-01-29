import { Model, Document } from 'mongoose';

export interface ICloudProvider {
    name: string;
    regions: string[]
}

export interface ICPDoc extends ICloudProvider, Document {
}

export interface ICPModel extends Model<ICPDoc> {
}
