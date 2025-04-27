import * as LPUsageRepo from '../repositories/lp_usage_log_repo';

export async function getLPUsageLogs() {
    return await LPUsageRepo.getLPUsageLogs();
}

export async function getLPUsageLog(id) {
    return await LPUsageRepo.getLPUsageLog(id);
}

export async function storeLPUsageLog(data, session) {
    return await LPUsageRepo.storeLPUsageLog(data, session);
}