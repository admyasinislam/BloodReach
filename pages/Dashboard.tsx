import React, { useState, useEffect } from 'react';
import { User, Calendar, Bell, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { updateDonor } from '../services/mockData';
import { Donor } from '../types';

export const Dashboard: React.FC = () => {
  const { user, login, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
        navigate('/login');
    }
  }, [user, navigate]);

  if (!user) return null;

  const handleDonatedToday = async () => {
    if (window.confirm("আপনি কি নিশ্চিত যে আপনি আজ রক্তদান করেছেন? এটি আপনার প্রোফাইল আগামী ৪ মাসের জন্য লুকিয়ে রাখবে।")) {
      setLoading(true);
      const today = new Date().toISOString().split('T')[0];
      
      const updatedUser: Donor = {
          ...user,
          lastDonationDate: today,
          isAvailable: false
      };

      const success = await updateDonor(updatedUser);
      if (success) {
          login(updatedUser); // Update local context
          alert("অভিনন্দন! আপনার তথ্য আপডেট করা হয়েছে।");
      }
      setLoading(false);
    }
  };

  const toggleAvailability = async () => {
      setLoading(true);
      const updatedUser: Donor = {
          ...user,
          isAvailable: !user.isAvailable
      };
      
      const success = await updateDonor(updatedUser);
      if (success) {
          login(updatedUser);
      }
      setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto p-4 space-y-6">
      
      {/* Header Profile Card */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-brand-red"></div>
        <div className="w-20 h-20 bg-slate-100 rounded-full mx-auto flex items-center justify-center mb-4">
          <User size={40} className="text-slate-400" />
        </div>
        <h2 className="text-xl font-bold text-slate-800">{user.name}</h2>
        <p className="text-slate-500">ব্লাড গ্রুপ: <span className="font-bold text-brand-red">{user.bloodGroup}</span></p>
        <p className="text-slate-500 text-sm">{user.district}</p>
      </div>

      {/* Availability Toggle */}
      <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-slate-800">রক্তদানের জন্য প্রস্তুত?</h3>
          <p className="text-xs text-slate-500">{user.isAvailable ? 'বর্তমানে সচল আছেন' : 'বর্তমানে সচল নেই'}</p>
        </div>
        <button 
          onClick={toggleAvailability}
          disabled={loading}
          className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${user.isAvailable ? 'bg-green-500' : 'bg-slate-300'}`}
        >
          <span className={`inline-block h-6 w-6 transform rounded-full bg-white transition ${user.isAvailable ? 'translate-x-7' : 'translate-x-1'}`} />
        </button>
      </div>

      {/* Actions */}
      <div className="space-y-4">
        <button 
          onClick={handleDonatedToday}
          disabled={loading}
          className="w-full bg-white border-2 border-brand-red text-brand-red font-bold py-4 rounded-xl flex items-center justify-center space-x-2 hover:bg-red-50 transition"
        >
          <Calendar size={20} />
          <span>আমি আজ রক্ত দিয়েছি</span>
        </button>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-blue-50 p-4 rounded-xl">
          <ShieldCheck className="text-blue-600 mb-2" size={24} />
          <p className="text-xs text-slate-500">শেষ রক্তদান</p>
          <p className="font-bold text-slate-700">{user.lastDonationDate || 'N/A'}</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-xl">
          <Bell className="text-purple-600 mb-2" size={24} />
          <p className="text-xs text-slate-500">নোটিফিকেশন</p>
          <p className="font-bold text-slate-700">চালু আছে</p>
        </div>
      </div>
    </div>
  );
};