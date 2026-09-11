import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Crown, CreditCard, Lock, X, Sparkles, Check } from 'lucide-react';
import { useUpgradeSubscriptionMutation } from '../../redux/services/profileApi';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

export const SubscriptionModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [selectedPlan, setSelectedPlan] = useState<'Gold' | 'VIP'>('VIP');
  const [cardNumber, setCardNumber] = useState('4242 4242 4242 4242');
  const [expDate, setExpDate] = useState('12/28');
  const [cvv, setCvv] = useState('123');
  const [cardHolder, setCardHolder] = useState('Alex Mercer');
  const [successMessage, setSuccessMessage] = useState('');

  const [upgradeSubscription, { isLoading }] = useUpgradeSubscriptionMutation();

  const handleFakePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await upgradeSubscription({ membershipTier: selectedPlan }).unwrap();
      setSuccessMessage(`🎉 Payment Approved! Upgraded to SoulSync ${selectedPlan} Tier.`);
      setTimeout(() => {
        onClose();
      }, 2200);
    } catch (e) {}
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.94 }}
        className="rounded-3xl border border-white/[0.08] bg-[#121522] p-8 max-w-lg w-full relative space-y-6 shadow-2xl shadow-black/80"
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-full bg-white/[0.04]"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 mx-auto flex items-center justify-center text-amber-400">
            <Crown className="w-6 h-6 fill-amber-400" />
          </div>
          <h2 className="text-2xl font-extrabold text-white font-outfit">SoulSync VIP Membership</h2>
          <p className="text-xs text-slate-400">Unlock priority candidate matching, unlimited likes, and direct social links.</p>
        </div>

        {successMessage ? (
          <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-center font-bold text-sm animate-pulse space-y-2">
            <Sparkles className="w-8 h-8 mx-auto text-emerald-400" />
            <p>{successMessage}</p>
          </div>
        ) : (
          <form onSubmit={handleFakePayment} className="space-y-5">
            {/* Plan Picker */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSelectedPlan('Gold')}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  selectedPlan === 'Gold'
                    ? 'bg-amber-500/15 border-amber-500/40 text-white shadow-lg'
                    : 'bg-[#0c0e17] border-white/[0.06] text-slate-400 hover:border-white/10'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm">Gold Tier</span>
                  <span className="text-xs font-black text-amber-400">$9.99/mo</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Boosted visibility & unlimited likes.</p>
              </button>

              <button
                type="button"
                onClick={() => setSelectedPlan('VIP')}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  selectedPlan === 'VIP'
                    ? 'bg-rose-500/15 border-rose-500/40 text-white shadow-lg'
                    : 'bg-[#0c0e17] border-white/[0.06] text-slate-400 hover:border-white/10'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm">VIP Master</span>
                  <span className="text-xs font-black text-rose-400">$19.99/mo</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Direct social links unlock & VIP badge.</p>
              </button>
            </div>

            {/* Credit Card Form */}
            <div className="space-y-3 p-4 rounded-2xl bg-[#0c0e17] border border-white/[0.08]">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                <span className="flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-rose-400" /> Card Information
                </span>
                <span className="text-[10px] text-slate-500">256-Bit SSL Encrypted</span>
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Cardholder Name</label>
                <Input
                  type="text"
                  required
                  value={cardHolder}
                  onChange={(e) => setCardHolder(e.target.value)}
                  className="h-10 text-xs"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Card Number</label>
                <Input
                  type="text"
                  required
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="h-10 text-xs font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Expiry Date</label>
                  <Input
                    type="text"
                    required
                    value={expDate}
                    onChange={(e) => setExpDate(e.target.value)}
                    className="h-10 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">CVV</label>
                  <Input
                    type="text"
                    required
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                    className="h-10 text-xs font-mono"
                  />
                </div>
              </div>
            </div>

            <Button
              type="submit"
              variant="glow"
              size="lg"
              isLoading={isLoading}
              className="w-full text-xs font-bold gap-2"
            >
              <Lock className="w-3.5 h-3.5" /> Confirm & Pay ${selectedPlan === 'Gold' ? '9.99' : '19.99'}
            </Button>
          </form>
        )}
      </motion.div>
    </div>
  );
};
