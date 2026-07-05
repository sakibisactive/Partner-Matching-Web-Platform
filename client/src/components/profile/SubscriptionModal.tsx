import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Crown, Check, CreditCard, Lock, X, Sparkles } from 'lucide-react';
import { useUpgradeSubscriptionMutation } from '../../redux/services/profileApi';

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
      setSuccessMessage(`🎉 Payment Approved! Upgraded to FIND TRU LUV ${selectedPlan} Tier.`);
      setTimeout(() => {
        onClose();
      }, 2500);
    } catch (e) {}
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="glass-panel p-8 rounded-3xl border border-slate-800 max-w-lg w-full relative space-y-6 shadow-2xl"
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-slate-400 hover:text-white rounded-full bg-slate-900"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 via-rose-500 to-indigo-600 mx-auto flex items-center justify-center text-white shadow-lg shadow-amber-500/20">
            <Crown className="w-6 h-6 fill-white" />
          </div>
          <h2 className="text-2xl font-extrabold text-white font-outfit uppercase">FIND TRU LUV VIP Checkout</h2>
          <p className="text-xs text-slate-400">Unlock priority matching, unlimited likes, and direct contact access.</p>
        </div>

        {successMessage ? (
          <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-center font-bold text-sm animate-pulse space-y-2">
            <Sparkles className="w-8 h-8 mx-auto text-emerald-400" />
            <p>{successMessage}</p>
          </div>
        ) : (
          <form onSubmit={handleFakePayment} className="space-y-6">
            {/* Plan Picker */}
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setSelectedPlan('Gold')}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  selectedPlan === 'Gold'
                    ? 'bg-amber-500/15 border-amber-500 text-amber-300 shadow-lg'
                    : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm">Gold Tier</span>
                  <span className="text-xs font-black text-amber-400">$9.99/mo</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">Boosted discover visibility & unlimited swipes.</p>
              </button>

              <button
                type="button"
                onClick={() => setSelectedPlan('VIP')}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  selectedPlan === 'VIP'
                    ? 'bg-rose-500/15 border-rose-500 text-rose-300 shadow-lg'
                    : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm">VIP Master</span>
                  <span className="text-xs font-black text-rose-400">$19.99/mo</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">Direct social links unlock & VIP crown badge.</p>
              </button>
            </div>

            {/* Real Credit Card Payment Form */}
            <div className="space-y-3 p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-1">
                <span className="flex items-center gap-1">
                  <CreditCard className="w-4 h-4 text-indigo-400" /> Credit / Debit Card
                </span>
                <span className="text-[10px] text-slate-500">256-Bit SSL Encrypted</span>
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 uppercase">Cardholder Name</label>
                <input
                  type="text"
                  required
                  value={cardHolder}
                  onChange={(e) => setCardHolder(e.target.value)}
                  className="w-full p-2.5 rounded-xl glass-input text-xs"
                />
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 uppercase">Card Number</label>
                <input
                  type="text"
                  required
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full p-2.5 rounded-xl glass-input text-xs font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] text-slate-400 uppercase">Expiry Date</label>
                  <input
                    type="text"
                    required
                    value={expDate}
                    onChange={(e) => setExpDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl glass-input text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 uppercase">CVV</label>
                  <input
                    type="text"
                    required
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                    className="w-full p-2.5 rounded-xl glass-input text-xs font-mono"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-amber-500 via-rose-600 to-indigo-600 hover:opacity-95 shadow-xl shadow-rose-500/20 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5" /> Confirm & Pay ${selectedPlan === 'Gold' ? '9.99' : '19.99'}
                </>
              )}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
};
