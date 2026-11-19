import React, { useState } from 'react';
import { LoyaltyStatus, LoyaltyReward, User } from '../types/index.ts';
import { Award, Gift, Sparkles, Check, ArrowRight, ShieldCheck, Copy } from 'lucide-react';
import { api } from '../api/client.ts';

interface LoyaltyHubProps {
  loyaltyStatus: LoyaltyStatus;
  rewards: LoyaltyReward[];
  user: User | null;
  onRewardRedeemed: (remainingPoints: number, code: string, title: string) => void;
  onBookNowClick: () => void;
}

export const LoyaltyHub: React.FC<LoyaltyHubProps> = ({
  loyaltyStatus,
  rewards,
  user,
  onRewardRedeemed,
  onBookNowClick,
}) => {
  const [redeemingId, setRedeemingId] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const points = Number(user?.loyaltyPoints ?? loyaltyStatus?.points ?? 0);
  const currentTier = user?.loyaltyTier || loyaltyStatus?.tier || 'Bronze';

  // Calculate tier progress percentage
  let progressPct = 50;
  if (currentTier === 'Bronze') progressPct = (points / 400) * 100;
  else if (currentTier === 'Silver') progressPct = ((points - 400) / 600) * 100;
  else if (currentTier === 'Gold') progressPct = ((points - 1000) / 1500) * 100;
  else progressPct = 100;
  progressPct = Math.min(100, Math.max(0, progressPct));

  const handleRedeem = async (reward: LoyaltyReward) => {
    if (points < reward.pointsRequired) {
      setErrorMsg(`You need ${reward.pointsRequired - points} more points to redeem this reward.`);
      setTimeout(() => setErrorMsg(null), 3500);
      return;
    }

    setRedeemingId(reward._id);
    setErrorMsg(null);
    try {
      const res = await api.redeemReward(reward._id);
      onRewardRedeemed(res.remainingPoints, res.couponCode, res.rewardTitle);
      setCopiedCode(res.couponCode);
      setTimeout(() => setCopiedCode(null), 4000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to redeem reward');
    } finally {
      setRedeemingId(null);
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-10 sm:py-14">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 mb-6 sm:mb-10 pb-4 sm:pb-5 border-b border-stone-800">
        <div>
          <div className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-mono uppercase tracking-widest text-amber-400 bg-amber-950/60 border border-amber-500/30 px-3 py-1 rounded-full mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>Banda Services Privilege Club</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-serif font-bold text-white tracking-tight">
            Loyalty Rewards &amp; VIP Tiers
          </h2>
          <p className="text-xs sm:text-sm text-stone-300 mt-1 max-w-xl">
            Earn 1 point for every UGX 500 spent on beauty appointments across Kampala.
          </p>
        </div>
        <div className="text-xs font-mono text-amber-300 bg-stone-900/90 border border-stone-800 px-3.5 py-2 rounded-xl backdrop-blur-md self-start md:self-auto">
          Automatic Points on Checkout
        </div>
      </div>

      {errorMsg && (
        <div className="mb-6 p-3.5 bg-rose-950/80 border border-rose-500/40 rounded-xl text-rose-200 text-xs">
          {errorMsg}
        </div>
      )}

      {/* Tier Status Banner */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 text-white rounded-2xl sm:rounded-3xl p-5 sm:p-10 mb-8 sm:mb-12 shadow-2xl border border-stone-700/80 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-amber-500/10 to-transparent pointer-events-none" />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-center relative z-10">
          <div className="md:col-span-7 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 text-xs font-mono font-bold uppercase tracking-wider shadow-sm">
                {currentTier} Member
              </span>
              <span className="text-xs text-stone-400">· Member #{user?._id?.slice(0, 8) || 'BANDA-2026'}</span>
            </div>

            <div className="text-2xl sm:text-5xl font-serif font-bold">
              <span className="font-mono tabular-nums text-amber-300">{points.toLocaleString()}</span>{' '}
              <span className="text-base sm:text-2xl text-stone-300 font-sans font-normal">Available Points</span>
            </div>

            {/* Progress to next tier */}
            <div className="space-y-2 pt-2 max-w-md">
              <div className="flex justify-between text-xs text-stone-300">
                <span className="font-medium">Current: {currentTier}</span>
                <span className="text-amber-400 font-mono">
                  {loyaltyStatus.nextTier
                    ? `${loyaltyStatus.pointsToNextTier} pts to ${loyaltyStatus.nextTier}`
                    : 'Highest VIP Luxe Tier Unlocked!'}
                </span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-stone-950 overflow-hidden border border-stone-800">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 to-amber-200 rounded-full transition-all duration-700 shadow-sm shadow-amber-400"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>
          </div>

          <div className="md:col-span-5 bg-stone-950/80 rounded-2xl p-6 border border-stone-700/80 space-y-3.5 shadow-xl">
            <div className="text-xs uppercase tracking-wider font-mono font-bold text-amber-400 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Active VIP Tier Benefits</span>
            </div>
            <ul className="text-xs text-stone-200 space-y-2.5">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Priority on-demand artist GPS dispatch</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Complimentary organic Nilotica shea butter treatment</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>10% off service add-ons and custom nail art paintings</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Rewards Catalog */}
      <div className="mb-8 sm:mb-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-5 sm:mb-6">
          <h3 className="text-xl sm:text-2xl font-serif font-bold text-white">
            Redeem Exclusive Rewards &amp; Vouchers
          </h3>
          <span className="text-xs text-stone-400">Apply coupon code at checkout</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {rewards.map((reward) => {
            const canAfford = points >= reward.pointsRequired;
            const isRedeeming = redeemingId === reward._id;
            const justRedeemed = copiedCode === reward.code;

            return (
              <div
                key={reward._id}
                className="bg-stone-900/85 backdrop-blur-xl rounded-2xl border border-stone-800 p-4 sm:p-6 shadow-xl flex flex-col justify-between hover:border-amber-400/40 transition-all space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] uppercase tracking-wider font-mono font-semibold text-stone-400 bg-stone-950 px-2 py-0.5 rounded border border-stone-800">
                      {reward.category}
                    </span>
                    <span className="font-mono text-xs font-bold text-amber-400 bg-amber-950/80 border border-amber-500/30 px-2.5 py-0.5 rounded-full">
                      {reward.pointsRequired} pts
                    </span>
                  </div>

                  <h4 className="text-base font-serif font-bold text-white mb-1.5">
                    {reward.title}
                  </h4>

                  <p className="text-xs text-stone-300 leading-relaxed">
                    {reward.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-stone-800 flex items-center justify-between">
                  <div className="text-[11px] font-mono text-stone-400">
                    Code: <span className="text-amber-300 font-bold">{reward.code}</span>
                  </div>

                  <button
                    onClick={() => handleRedeem(reward)}
                    disabled={!canAfford || isRedeeming}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      justRedeemed
                        ? 'bg-emerald-500 text-stone-950'
                        : canAfford
                        ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-stone-950 hover:from-amber-300 hover:to-amber-400 shadow-md'
                        : 'bg-stone-800 text-stone-500 cursor-not-allowed border border-stone-700'
                    }`}
                  >
                    {justRedeemed ? 'Copied Code!' : isRedeeming ? 'Redeeming...' : 'Redeem Voucher'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
