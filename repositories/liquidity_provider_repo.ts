import LiquidityProvider from '../models/liquidity_provider';

const projection = {
  _id: 1,
  user_id: 1,
  tier: 1,
  currency: 1,
  amount_provided: 1,
  amount_in_use: 1,
  monthly_interest_rate: 1,
  duration_days: 1,
  created_at: 1,
  updated_at: 1,
  status: 1,
};

export async function fetchLiquidityProviders() {
  return await LiquidityProvider.find().select(projection);
}

export async function fetchLiquidityProviderById(id: string) {
  return await LiquidityProvider.findById(id).select(projection);
}

export async function fetchLiquidityProviderByUserId(userId: string) {
  return await LiquidityProvider.findOne({ user_id: userId }).select(
    projection
  );
}

export async function fetchLiquidityProvidersByStatus(status: string) {
  return await LiquidityProvider.find({ status: status }).select(projection);
}

export async function fetchLiquidityProviderByUserIdAndStatus(
  userId: string,
  id: string,
  status: string
) {
  return await LiquidityProvider.findOne({
    _id: id,
    user_id: userId,
    status: status,
  }).select(projection);
}

export async function createLiquidityProvider(data, options = {}) {
  try {
    const liquidityProvider = new LiquidityProvider(data);
    return await liquidityProvider.save(options);
  } catch (error) {
    console.log(error);
  }
}

export async function updateLiquidityProvider(id: string, data, options = {}) {
  console.log('Updating liquidity provider...');
  const liquidityProvider = await LiquidityProvider.findByIdAndUpdate(
    id,
    data,
    {
      new: true,
      ...options,
    }
  );
  return liquidityProvider;
}

export async function deleteLiquidityProvider(id: string, options = {}) {
  return await LiquidityProvider.findByIdAndDelete(id, options);
}
