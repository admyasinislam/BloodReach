import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BloodGroup, District, Donor, Stats } from '../types';
import { BLOOD_GROUPS, DISTRICTS, DISTRICT_LABELS } from '../constants';
import { searchDonors, getStats } from '../services/mockData';
import { Search, Phone, MessageCircle, Heart, Users, MapPin, ChevronDown, Calendar } from 'lucide-react';

export const Home: React.FC = () => {
  const [selectedBloodGroup, setSelectedBloodGroup] = useState<BloodGroup>('A+');
  const [selectedDistrict, setSelectedDistrict] = useState<District>('Dhaka');
  const [searchResults, setSearchResults] = useState<Donor[] | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [stats, setStats] = useState<Stats>({ totalDonors: 0, livesSaved: 0 });

  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load lightweight stats on mount
    setStats(getStats());
  }, []);

  const handleSearch = async () => {
    setIsSearching(true);
    setSearchResults(null); // Clear previous results
    
    try {
      const results = await searchDonors(selectedBloodGroup, selectedDistrict);
      setSearchResults(results);
      
      // Auto-scroll to results after a short delay for rendering
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (error) {
      console.error("Search failed", error);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="pb-20">
      {/* Hero Section */}
      <div className="bg-brand-red text-white rounded-b-[2.5rem] shadow-lg overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/medical-icons.png')]"></div>
        
        <div className="max-w-4xl mx-auto px-6 py-12 relative z-10 text-center">
            <h1 className="text-3xl font-bold mb-2">রক্ত দিন, জীবন বাঁচান</h1>
            <p className="text-red-100 mb-8">আপনার এক ব্যাগ রক্তে বাঁচতে পারে একটি প্রাণ</p>
            
            {/* Search Card */}
            <div className="bg-white text-slate-800 p-6 rounded-2xl shadow-xl max-w-lg mx-auto transform translate-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {/* Blood Group Select */}
                    <div className="text-left">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">রক্তের গ্রুপ</label>
                        <div className="relative">
                            <select 
                                value={selectedBloodGroup}
                                onChange={(e) => setSelectedBloodGroup(e.target.value as BloodGroup)}
                                className="w-full p-3 bg-slate-50 rounded-xl border-none font-bold text-lg text-brand-dark focus:ring-2 focus:ring-brand-red outline-none appearance-none"
                            >
                                {BLOOD_GROUPS.map(bg => <option key={bg} value={bg}>{bg}</option>)}
                            </select>
                            <ChevronDown className="absolute right-3 top-4 text-slate-400 pointer-events-none" size={20} />
                        </div>
                    </div>

                    {/* District Select */}
                    <div className="text-left">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">জেলা</label>
                        <div className="relative">
                            <select 
                                value={selectedDistrict}
                                onChange={(e) => setSelectedDistrict(e.target.value as District)}
                                className="w-full p-3 bg-slate-50 rounded-xl border-none font-bold text-lg text-brand-dark focus:ring-2 focus:ring-brand-red outline-none appearance-none"
                            >
                                {DISTRICTS.map(d => <option key={d} value={d}>{DISTRICT_LABELS[d]}</option>)}
                            </select>
                            <ChevronDown className="absolute right-3 top-4 text-slate-400 pointer-events-none" size={20} />
                        </div>
                    </div>
                </div>

                <button 
                    onClick={handleSearch}
                    disabled={isSearching}
                    className="w-full bg-brand-dark text-white font-bold py-4 rounded-xl shadow-md hover:bg-slate-800 transition flex items-center justify-center space-x-2"
                >
                    {isSearching ? (
                        <span>খোঁজা হচ্ছে...</span>
                    ) : (
                        <>
                            <Search size={20} />
                            <span>রক্তদাতা খুঁজুন</span>
                        </>
                    )}
                </button>
            </div>
        </div>
        <div className="h-12 bg-transparent"></div>
    </div>

      {/* Middle CTA */}
      <div className="max-w-4xl mx-auto px-4 mt-16 text-center">
        <Link to="/register" className="inline-flex items-center space-x-2 text-brand-red bg-red-50 px-6 py-3 rounded-full font-bold border border-red-100 hover:bg-red-100 transition shadow-sm">
            <Heart size={20} fill="currentColor" />
            <span>আজই রক্তদাতা হিসেবে যোগ দিন</span>
        </Link>
      </div>

      {/* Stats Section */}
      <div className="max-w-4xl mx-auto px-4 mt-8 grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center">
            <div className="bg-blue-100 p-2 rounded-full mb-2 text-blue-600"><Users size={24} /></div>
            <span className="text-2xl font-bold text-slate-800">{stats.totalDonors.toLocaleString()}</span>
            <span className="text-xs text-slate-500">নিবন্ধিত রক্তদাতা</span>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center">
            <div className="bg-green-100 p-2 rounded-full mb-2 text-green-600"><Heart size={24} /></div>
            <span className="text-2xl font-bold text-slate-800">{stats.livesSaved.toLocaleString()}</span>
            <span className="text-xs text-slate-500">জীবন বাঁচানো হয়েছে</span>
        </div>
      </div>

      {/* Search Results Section */}
      <div ref={resultsRef} className="max-w-4xl mx-auto px-4 mt-10 scroll-mt-24">
        {searchResults && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h3 className="text-xl font-bold text-slate-800 mb-4 border-l-4 border-brand-red pl-3">
                    ফলাফল ({searchResults.length} জন রক্তদাতা পাওয়া গেছে)
                </h3>
                
                {searchResults.length === 0 ? (
                    <div className="text-center p-8 bg-white rounded-xl border border-slate-100">
                        <p className="text-slate-500">দুঃখিত, এই মুহূর্তে কোনো রক্তদাতা পাওয়া যায়নি।</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {searchResults.map(donor => (
                            <div key={donor.id} className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="flex items-start space-x-4">
                                    <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center text-brand-red font-bold text-lg shrink-0 border border-red-100">
                                        {donor.bloodGroup}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-800 text-lg">{donor.name}</h4>
                                        <div className="flex items-center text-slate-500 text-sm mt-1 space-x-3">
                                            <span className="flex items-center"><MapPin size={14} className="mr-1" /> {DISTRICT_LABELS[donor.district]}</span>
                                            <span className="flex items-center"><Calendar size={14} className="mr-1" /> শেষ দান: {donor.lastDonationDate}</span>
                                        </div>
                                        {donor.institute && <p className="text-xs text-slate-400 mt-1">{donor.institute}</p>}
                                    </div>
                                </div>
                                
                                <div className="flex items-center space-x-3 mt-2 sm:mt-0">
                                    <a 
                                        href={`tel:${donor.phone}`}
                                        className="flex-1 sm:flex-none bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition flex items-center justify-center space-x-2"
                                    >
                                        <Phone size={18} />
                                        <span>কল</span>
                                    </a>
                                    <a 
                                        href={`https://wa.me/${donor.phone.replace('+', '')}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex-1 sm:flex-none bg-[#25D366] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#20b858] transition flex items-center justify-center space-x-2"
                                    >
                                        <MessageCircle size={18} />
                                        <span>হোয়াটসঅ্যাপ</span>
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        )}
      </div>
    </div>
  );
};