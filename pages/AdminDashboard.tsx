import React, { useEffect, useState } from 'react';
import { getAllDonors, updateDonor, deleteDonor } from '../services/mockData';
import { Donor, District, BloodGroup } from '../types';
import { BLOOD_GROUPS, DISTRICTS, DISTRICT_LABELS } from '../constants';
import { Trash2, Edit2, Check, X, Search, ShieldAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const AdminDashboard: React.FC = () => {
    const { isAdmin, user } = useAuth();
    const navigate = useNavigate();
    const [donors, setDonors] = useState<Donor[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<Partial<Donor>>({});

    useEffect(() => {
        if (!isAdmin) {
            navigate('/dashboard');
            return;
        }
        loadDonors();
    }, [isAdmin, navigate]);

    const loadDonors = async () => {
        setLoading(true);
        const data = await getAllDonors();
        setDonors(data);
        setLoading(false);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('আপনি কি নিশ্চিত যে আপনি এই রক্তদাতাকে মুছে ফেলতে চান?')) {
            await deleteDonor(id);
            loadDonors();
        }
    };

    const startEdit = (donor: Donor) => {
        setEditingId(donor.id);
        setEditForm(donor);
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditForm({});
    };

    const saveEdit = async () => {
        if (editForm.id) {
            await updateDonor(editForm as Donor);
            setEditingId(null);
            loadDonors();
        }
    };

    const filteredDonors = donors.filter(d => 
        d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.phone.includes(searchTerm) ||
        d.district.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="p-8 text-center">লোড হচ্ছে...</div>;

    return (
        <div className="max-w-6xl mx-auto p-4 pb-20">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                    <ShieldAlert className="text-brand-red" />
                    অ্যাডমিন ড্যাশবোর্ড
                </h2>
                <div className="text-sm text-slate-500">
                    স্বাগতম, <span className="font-bold text-slate-800">{user?.name}</span>
                </div>
            </div>

            {/* Search Bar */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 mb-6">
                <div className="relative">
                    <Search className="absolute left-3 top-3 text-slate-400" size={20} />
                    <input 
                        type="text"
                        placeholder="নাম, ফোন বা জেলা দিয়ে খুঁজুন..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full pl-10 p-2 rounded-lg border border-slate-200 outline-none focus:border-brand-red"
                    />
                </div>
            </div>

            {/* Desktop Table View (Hidden on Mobile) */}
            <div className="hidden md:block bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 text-slate-600 text-sm font-semibold uppercase">
                        <tr>
                            <th className="p-4">নাম</th>
                            <th className="p-4">গ্রুপ</th>
                            <th className="p-4">ফোন</th>
                            <th className="p-4">জেলা</th>
                            <th className="p-4">শেষ দান</th>
                            <th className="p-4">স্ট্যাটাস</th>
                            <th className="p-4 text-right">অ্যাকশন</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                        {filteredDonors.map(donor => (
                            <tr key={donor.id} className="hover:bg-slate-50">
                                {editingId === donor.id ? (
                                    // Edit Mode Row
                                    <>
                                        <td className="p-4">
                                            <input 
                                                className="border rounded p-1 w-full" 
                                                value={editForm.name} 
                                                onChange={e => setEditForm({...editForm, name: e.target.value})}
                                            />
                                        </td>
                                        <td className="p-4">
                                            <select 
                                                className="border rounded p-1"
                                                value={editForm.bloodGroup}
                                                onChange={e => setEditForm({...editForm, bloodGroup: e.target.value as BloodGroup})}
                                            >
                                                {BLOOD_GROUPS.map(bg => <option key={bg} value={bg}>{bg}</option>)}
                                            </select>
                                        </td>
                                        <td className="p-4">
                                            <input 
                                                className="border rounded p-1 w-full"
                                                value={editForm.phone}
                                                onChange={e => setEditForm({...editForm, phone: e.target.value})}
                                            />
                                        </td>
                                        <td className="p-4">
                                            <select 
                                                className="border rounded p-1"
                                                value={editForm.district}
                                                onChange={e => setEditForm({...editForm, district: e.target.value as District})}
                                            >
                                                {DISTRICTS.map(d => <option key={d} value={d}>{DISTRICT_LABELS[d]}</option>)}
                                            </select>
                                        </td>
                                        <td className="p-4">
                                            <input 
                                                type="date"
                                                className="border rounded p-1"
                                                value={editForm.lastDonationDate}
                                                onChange={e => setEditForm({...editForm, lastDonationDate: e.target.value})}
                                            />
                                        </td>
                                        <td className="p-4">
                                            <input 
                                                type="checkbox"
                                                checked={editForm.isAvailable}
                                                onChange={e => setEditForm({...editForm, isAvailable: e.target.checked})}
                                            />
                                        </td>
                                        <td className="p-4 text-right space-x-2">
                                            <button onClick={saveEdit} className="text-green-600 hover:bg-green-50 p-1 rounded"><Check size={18} /></button>
                                            <button onClick={cancelEdit} className="text-red-600 hover:bg-red-50 p-1 rounded"><X size={18} /></button>
                                        </td>
                                    </>
                                ) : (
                                    // Display Mode Row
                                    <>
                                        <td className="p-4 font-medium text-slate-800">{donor.name}</td>
                                        <td className="p-4"><span className="bg-red-50 text-red-700 px-2 py-1 rounded-md font-bold text-xs">{donor.bloodGroup}</span></td>
                                        <td className="p-4">{donor.phone}</td>
                                        <td className="p-4">{DISTRICT_LABELS[donor.district]}</td>
                                        <td className="p-4">{donor.lastDonationDate}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${donor.isAvailable ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                                                {donor.isAvailable ? 'সচল' : 'বন্ধ'}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right space-x-2">
                                            <button onClick={() => startEdit(donor)} className="text-blue-600 hover:bg-blue-50 p-2 rounded-full transition"><Edit2 size={16} /></button>
                                            <button onClick={() => handleDelete(donor.id)} className="text-red-600 hover:bg-red-50 p-2 rounded-full transition"><Trash2 size={16} /></button>
                                        </td>
                                    </>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
                {filteredDonors.map(donor => (
                    <div key={donor.id} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                         {editingId === donor.id ? (
                            <div className="space-y-3">
                                <input className="w-full border p-2 rounded" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} />
                                <div className="flex gap-2">
                                    <select className="w-1/2 border p-2 rounded" value={editForm.bloodGroup} onChange={e => setEditForm({...editForm, bloodGroup: e.target.value as BloodGroup})}>
                                        {BLOOD_GROUPS.map(bg => <option key={bg} value={bg}>{bg}</option>)}
                                    </select>
                                    <select className="w-1/2 border p-2 rounded" value={editForm.district} onChange={e => setEditForm({...editForm, district: e.target.value as District})}>
                                        {DISTRICTS.map(d => <option key={d} value={d}>{DISTRICT_LABELS[d]}</option>)}
                                    </select>
                                </div>
                                <input className="w-full border p-2 rounded" value={editForm.phone} onChange={e => setEditForm({...editForm, phone: e.target.value})} />
                                <input type="date" className="w-full border p-2 rounded" value={editForm.lastDonationDate} onChange={e => setEditForm({...editForm, lastDonationDate: e.target.value})} />
                                <div className="flex justify-end gap-2 mt-2">
                                    <button onClick={saveEdit} className="bg-green-600 text-white px-4 py-2 rounded">Save</button>
                                    <button onClick={cancelEdit} className="bg-slate-200 text-slate-700 px-4 py-2 rounded">Cancel</button>
                                </div>
                            </div>
                         ) : (
                            <div>
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h3 className="font-bold text-lg">{donor.name}</h3>
                                        <p className="text-sm text-slate-500">{donor.phone}</p>
                                    </div>
                                    <span className="bg-red-50 text-red-700 px-2 py-1 rounded font-bold">{donor.bloodGroup}</span>
                                </div>
                                <div className="text-sm text-slate-600 mb-4 space-y-1">
                                    <p>জেলা: {DISTRICT_LABELS[donor.district]}</p>
                                    <p>শেষ দান: {donor.lastDonationDate}</p>
                                </div>
                                <div className="flex border-t pt-3 gap-2">
                                    <button onClick={() => startEdit(donor)} className="flex-1 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium">Edit</button>
                                    <button onClick={() => handleDelete(donor.id)} className="flex-1 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium">Delete</button>
                                </div>
                            </div>
                         )}
                    </div>
                ))}
            </div>
        </div>
    );
};