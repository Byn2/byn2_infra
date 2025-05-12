import * as currencyRepo from '../repositories/currency_repo';

export async function getCurrency(user: any) {
  return await currencyRepo.getCurrency(user);
}

export async function storeCurrency(data: any, session: any) {
  return await currencyRepo.storeCurrency(data, session);
}
