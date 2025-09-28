// @ts-nocheck
import LPUsageLog from '../models/lp_usage_log';

const projection = {
  _id: 1,
  lp_id: 1,
  type: 1,
  related_user_id: 1,
  amount: 1,
  currency: 1,
  note: 1,
  timestamp: 1,
};

export async function storeLPUsageLog(data: any, options = {}) {
  const lpUsageLog = new LPUsageLog(data);
  return await lpUsageLog.save(options);
}

export async function createOrUpdateLPUsageLog(data: any, options = {}) {
  try {
    if (data._id) {
      // Update an existing record with upsert enabled.
      return await LPUsageLog.findByIdAndUpdate(data._id, data, {
        new: true,
        upsert: true,
        ...options,
      });
    } else {
      // Create a new record if no _id is provided.
      const lpUsageLog = new LPUsageLog(data);
      return await lpUsageLog.save(options);
    }
  } catch (error) {
    console.log(error);
  }
}

export async function getLPUsageLogs(options = {}) {
  return await LPUsageLog.find({}, projection, options);
}

export async function getLPUsageLog(id: string, options = {}) {
  return await LPUsageLog.findById(id, projection, options);
}
