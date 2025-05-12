//@ts-nocheck
//@ts-ignore
import * as liquidityProviderRepo from '../repositories/liquidity_provider_repo';
import * as lpUsageLogRepo from '../repositories/lp_usage_log_repo';
const STAKE_TIERS = {
  basic: { min: 10, rate: 0.01, duration_days: 30 },
  crypto: { min: 100, rate: 0.05, duration_days: 60 },
  pro: { min: 1000, rate: 0.1, duration_days: 90 },
};

export async function stakeFunds(user, data, session) {
  const { tier, amount, currency } = data;
  console.log('Staking funds...');
  console.log('Tier:', tier);
  console.log('Amount:', amount);

  if (!tier || !STAKE_TIERS[tier]) {
    return { success: false, message: 'Invalid tier' };
  }

  if (!amount) {
    return { success: false, message: 'Amount is required' };
  }

  if (amount < STAKE_TIERS[tier].min) {
    return { success: false, message: 'Amount is too low for this tier' };
  }

  //send withdraw from users funds

  //save liquidity provider

  const lp = await liquidityProviderRepo.createLiquidityProvider(
    {
      user_id: user._id,
      tier,
      currency,
      amount_provided: amount,
      monthly_interest_rate: STAKE_TIERS[tier].rate,
      duration_days: STAKE_TIERS[tier].duration_days,
      date_staked: new Date(),
    },
    { session }
  );

  console.log('Liquidity provider stored:', lp);

  return {
    success: true,
    message: 'Funds staked successfully',
  };
}

export async function useStakedFunds({ amount, requestingUserId }, session) {
  const liquidity = await liquidityProviderRepo.fetchLiquidityProvidersByStatus(
    'active'
  );

  const totalAvailable = liquidity.reduce(
    (sum, lp) => sum + (lp.amount_provided - lp.amount_in_use),
    0
  );

  if (amount > totalAvailable) {
    return { success: false, message: 'Not enough funds available' };
  }

  let remaining = amount;

  for (const lp of liquidity) {
    const available = lp.amount_provided - lp.amount_in_use;
    if (available <= 0) continue;

    const used = Math.min(available, remaining);
    lp.amount_in_use += used;

    await liquidityProviderRepo.updateLiquidityProvider(
      lp._id,
      { amount_in_use: lp.amount_in_use },
      { session }
    );

    const usageLog = await lpUsageLogRepo.createOrUpdateLPUsageLog(
      {
        lp_id: lp._id,
        type: 'used',
        amount: used,
        currency: 'USDC',
        related_user_id: requestingUserId,
        timestamp: new Date(),
      },
      { session }
    );

    remaining -= used;
    if (remaining <= 0) break;
  }

  return { success: true };
}

export async function payoutInterest(user, id, session) {
  const lp =
    await liquidityProviderRepo.fetchLiquidityProviderByUserIdAndStatus(
      user._id,
      id,
      'active'
    );
  console.log('liquidity', lp);
  const principal = lp.amount_provided;
  const rate = lp.monthly_interest_rate ?? STAKE_TIERS[lp.tier]?.rate ?? 0;

  console.log('rate', rate);

  const interest = principal * rate;
  console.log('Interest:', interest);
  const totalPayout = principal + interest;
  console.log('Total Payout:', totalPayout);

  if (totalPayout > 0) {
    // await walletService.deposit(user, { amount: totalInterest }, session, 'interest');
    // await transactionService.storeTransations({
    //   from_id: null,
    //   to_id: user._id,
    //   amount: totalInterest,
    //   currency: 'USDC',
    //   reason: 'interest_payout',
    //   status: 'completed',
    //   provider: 'staking_contract',
    //   fee: { amount: 0, currency: 'USDC' },
    // }, session);
  }

  // Update LP status to 'completed' so it can’t be reused

  return { principal, interest, total: totalPayout };
}

export async function fetchLiquidityProviders() {
  return await liquidityProviderRepo.fetchLiquidityProviders();
}

export async function fetchLiquidityProviderById(id) {
  return await liquidityProviderRepo.fetchLiquidityProviderById(id);
}

export async function fetchLiquidityProviderByUserId(userId) {
  return await liquidityProviderRepo.fetchLiquidityProviderByUserId(userId);
}

export async function updateLiquidityProvider(id, data, session) {
  return await liquidityProviderRepo.updateLiquidityProvider(id, data, session);
}

export async function deleteLiquidityProvider(id, session) {
  return await liquidityProviderRepo.deleteLiquidityProvider(id, session);
}
