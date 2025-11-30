import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BloodGroup, District, Donor } from '../types';
import { BLOOD_GROUPS, DISTRICTS, DISTRICT_LABELS } from '../constants';
import { registerDonor } from '../services/mockData';
import { ChevronDown, Calendar, MapPin, User, Phone, CheckCircle, Mail, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<Donor>>({
    name: '',
    email: '',
    password: '',
    phone: '',
    bloodGroup: 'A+',
    district: 'Dhaka',
    gender: 'Male',
    lastDonationDate: '',
    willChangeLocation: false,
    yearsUntilChange: 0,
    institute: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    // Handle Checkbox
    if (type === 'checkbox') {
        const checked = (e.target as HTMLInputElement).checked;
        setFormData(prev => ({ ...prev, [name]: checked }));
        return;
    }

    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!formData.name || !formData.phone || !formData.lastDonationDate || !formData.email || !formData.password) {
        alert("অনুগ্রহ করে সকল আবশ্যক তথ্য পূরণ করুন");
        return;
    }

    // Phone validation
    if (formData.phone.length < 11) {
        alert("সঠিক মোবাইল নম্বর প্রদান করুন");
        return;
    }

    setLoading(true);
    
    const newDonor = await registerDonor({
        ...formData as Donor,
        isAvailable: true
    });

    setLoading(false);

    if (newDonor) {
        alert("নিবন্ধন সফল হয়েছে!");
        login(newDonor); // Auto login after register
        navigate('/dashboard'); 
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 pb-20">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <User className="text-brand-red" />
            রক্তদাতা নিবন্ধন
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Name */}
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">আপনার নাম *</label>
                <input 
                    type="text" 
                    name="name" 
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-brand-red focus:border-transparent outline-none transition"
                    placeholder="পুরো নাম লিখুন"
                />
            </div>

            {/* Email */}
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">ইমেইল (লগইন এর জন্য) *</label>
                <div className="relative">
                    <input 
                        type="email" 
                        name="email" 
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full p-3 pl-10 rounded-lg border border-slate-200 focus:ring-2 focus:ring-brand-red outline-none transition"
                        placeholder="আপনার ইমেইল দিন"
                    />
                     <Mail className="absolute left-3 top-3.5 text-slate-400" size={18} />
                </div>
            </div>

            {/* Password */}
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">পাসওয়ার্ড *</label>
                <div className="relative">
                    <input 
                        type="password" 
                        name="password" 
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full p-3 pl-10 rounded-lg border border-slate-200 focus:ring-2 focus:ring-brand-red outline-none transition"
                        placeholder="গোপন পাসওয়ার্ড দিন"
                    />
                    <Lock className="absolute left-3 top-3.5 text-slate-400" size={18} />
                </div>
            </div>

            {/* Phone */}
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">মোবাইল নম্বর *</label>
                <div className="relative">
                    <span className="absolute left-3 top-3 text-slate-400">+880</span>
                    <input 
                        type="tel" 
                        name="phone" 
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full p-3 pl-14 rounded-lg border border-slate-200 focus:ring-2 focus:ring-brand-red outline-none transition"
                        placeholder="1712345678"
                    />
                </div>
            </div>

            {/* Blood Group & Gender Row */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">রক্তের গ্রুপ *</label>
                    <div className="relative">
                        <select 
                            name="bloodGroup" 
                            value={formData.bloodGroup}
                            onChange={handleChange}
                            className="w-full p-3 appearance-none rounded-lg border border-slate-200 focus:ring-2 focus:ring-brand-red outline-none bg-white"
                        >
                            {BLOOD_GROUPS.map(bg => (
                                <option key={bg} value={bg}>{bg}</option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-3.5 text-slate-400 pointer-events-none" size={18} />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">লিঙ্গ</label>
                    <div className="relative">
                        <select 
                            name="gender" 
                            value={formData.gender}
                            onChange={handleChange}
                            className="w-full p-3 appearance-none rounded-lg border border-slate-200 focus:ring-2 focus:ring-brand-red outline-none bg-white"
                        >
                            <option value="Male">পুরুষ</option>
                            <option value="Female">মহিলা</option>
                            <option value="Other">অন্যান্য</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-3.5 text-slate-400 pointer-events-none" size={18} />
                    </div>
                </div>
            </div>

            {/* District */}
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">বর্তমান জেলা *</label>
                <div className="relative">
                    <select 
                        name="district" 
                        value={formData.district}
                        onChange={handleChange}
                        className="w-full p-3 appearance-none rounded-lg border border-slate-200 focus:ring-2 focus:ring-brand-red outline-none bg-white"
                    >
                        {DISTRICTS.map(d => (
                            <option key={d} value={d}>{DISTRICT_LABELS[d]}</option>
                        ))}
                    </select>
                    <MapPin className="absolute right-3 top-3.5 text-slate-400 pointer-events-none" size={18} />
                </div>
            </div>

            {/* Institute (Optional) */}
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">শিক্ষা প্রতিষ্ঠান / কর্মস্থল (ঐচ্ছিক)</label>
                <input 
                    type="text" 
                    name="institute" 
                    value={formData.institute}
                    onChange={handleChange}
                    className="w-full p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-brand-red outline-none"
                    placeholder="যেমন: ঢাকা বিশ্ববিদ্যালয়"
                />
            </div>

            {/* Last Donation Date */}
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">শেষ রক্তদানের তারিখ *</label>
                <div className="relative">
                    <input 
                        type="date" 
                        name="lastDonationDate" 
                        value={formData.lastDonationDate}
                        onChange={handleChange}
                        className="w-full p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-brand-red outline-none"
                    />
                    <Calendar className="absolute right-3 top-3.5 text-slate-400 pointer-events-none" size={18} />
                </div>
            </div>

            {/* Future Logic Section */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="flex items-center space-x-3 mb-4">
                    <input 
                        type="checkbox" 
                        id="willChange"
                        name="willChangeLocation"
                        checked={formData.willChangeLocation}
                        onChange={handleChange}
                        className="w-5 h-5 text-brand-red rounded focus:ring-brand-red"
                    />
                    <label htmlFor="willChange" className="text-sm text-slate-700 font-medium">
                        ভবিষ্যতে আপনার অবস্থান পরিবর্তন হবে? (যেমন: ছাত্রছাত্রী)
                    </label>
                </div>

                {formData.willChangeLocation && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2">
                        <div>
                            <label className="block text-xs font-medium text-slate-500 mb-1">কত বছর পর?</label>
                            <input 
                                type="number" 
                                name="yearsUntilChange"
                                value={formData.yearsUntilChange}
                                onChange={handleChange}
                                className="w-full p-2 rounded border border-slate-200"
                                placeholder="উদাহরণ: ২"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-500 mb-1">গন্তব্য জেলা</label>
                            <select 
                                name="targetDistrict" 
                                value={formData.targetDistrict || 'Dhaka'}
                                onChange={handleChange}
                                className="w-full p-2 rounded border border-slate-200 bg-white"
                            >
                                {DISTRICTS.map(d => (
                                    <option key={d} value={d}>{DISTRICT_LABELS[d]}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                )}
            </div>

            {/* Submit */}
            <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-brand-red text-white font-bold py-4 rounded-xl shadow-md hover:bg-red-700 transition flex items-center justify-center space-x-2 disabled:opacity-70"
            >
                {loading ? (
                   <span>অপেক্ষা করুন...</span>
                ) : (
                    <>
                        <CheckCircle size={20} />
                        <span>নিবন্ধন সম্পন্ন করুন</span>
                    </>
                )}
            </button>
        </form>
      </div>
    </div>
  );
};