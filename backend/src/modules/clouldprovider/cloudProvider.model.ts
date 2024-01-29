import mongoose from 'mongoose';
import toJSON from '../toJSON/toJSON';
import { ICPDoc, ICPModel } from './cloudProvider.interface';

const cloudProviderSchema = new mongoose.Schema<ICPDoc, ICPModel>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    regions: [{
      type: String,
      required: true,
      unique: true,
      trim: true,
    }],
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
cloudProviderSchema.plugin(toJSON);

const CloudProvider = mongoose.model<ICPDoc, ICPModel>('CloudProvider', cloudProviderSchema);

export default CloudProvider;
