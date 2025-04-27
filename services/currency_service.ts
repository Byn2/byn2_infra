import * as currencyRepo from '../repositories/currency_repo';

export async function getCurrency(user) {
  return await currencyRepo.getCurrency(user);
}

export async function storeCurrency(data, session) {
  return await currencyRepo.storeCurrency(data, session);
}
