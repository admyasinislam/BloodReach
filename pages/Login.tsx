import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loginUser } from '../services/mockData';
import { Lock, Mail, LogIn } from 'lucide-react';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const user = await loginUser(email, password);
    setLoading(false);

    if (user) {
      login(user);
      if (user.role === 'admin' || user.email === 'iyeasin44@gmail.com') {
          navigate('/admin');
      } else {
          navigate('/dashboard');
      }
    } else {
      setError('ভুল ইমেইল অথবা পাসওয়ার্ড');
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 pt-20">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
        <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">লগইন করুন</h2>

        {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm text-center">
                {error}
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">ইমেইল</label>
                <div className="relative">
                    <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-3 pl-10 rounded-lg border border-slate-200 focus:ring-2 focus:ring-brand-red outline-none"
                        placeholder="আপনার ইমেইল"
                        required
                    />
                    <Mail className="absolute left-3 top-3.5 text-slate-400" size={18} />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">পাসওয়ার্ড</label>
                <div className="relative">
                    <input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-3 pl-10 rounded-lg border border-slate-200 focus:ring-2 focus:ring-brand-red outline-none"
                        placeholder="********"
                        required
                    />
                    <Lock className="absolute left-3 top-3.5 text-slate-400" size={18} />
                </div>
            </div>

            <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-brand-red text-white font-bold py-3 rounded-xl shadow-md hover:bg-red-700 transition flex items-center justify-center space-x-2"
            >
                {loading ? 'অপেক্ষা করুন...' : (
                    <>
                        <LogIn size={20} />
                        <span>প্রবেশ করুন</span>
                    </>
                )}
            </button>
        </form>
        
        <div className="mt-6 text-center text-sm">
            <span className="text-slate-500">অ্যাকাউন্ট নেই? </span>
            <a href="/#/register" className="text-brand-red font-bold hover:underline">নিবন্ধন করুন</a>
        </div>
      </div>
    </div>
  );
};