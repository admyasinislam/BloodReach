import { Donor, Stats } from '../types';

const STORAGE_KEY = 'bloodreach_donors';

// Initial Seed Data with the requested Admin
const SEED_DONORS: Donor[] = [
  {
    id: 'admin-1',
    name: 'Admin User',
    email: 'iyeasin44@gmail.com',
    password: 'password123', // Simple mock password
    role: 'admin',
    phone: '+8801711000000',
    bloodGroup: 'AB+',
    district: 'Dhaka',
    gender: 'Male',
    lastDonationDate: '2023-01-01',
    isAvailable: true,
    willChangeLocation: false
  },
  {
    id: '2',
    name: 'ফাতিমা আক্তার',
    email: 'fatima@example.com',
    password: 'password123',
    role: 'user',
    phone: '+8801811000000',
    bloodGroup: 'O+',
    district: 'Dhaka',
    gender: 'Female',
    lastDonationDate: new Date().toISOString().split('T')[0], // Not Eligible (Today)
    isAvailable: true,
    willChangeLocation: false
  },
  {
    id: '3',
    name: 'করিম রহমান',
    email: 'karim@example.com',
    password: 'password123',
    role: 'user',
    phone: '+8801911000000',
    bloodGroup: 'AB+',
    district: 'Chittagong',
    gender: 'Male',
    lastDonationDate: '2023-05-20',
    isAvailable: true,
    willChangeLocation: false
  },
  {
    id: '4',
    name: 'সুমাইয়া ইসলাম',
    email: 'sumaiya@example.com',
    password: 'password123',
    role: 'user',
    phone: '+8801611000000',
    bloodGroup: 'B+',
    district: 'Sylhet',
    gender: 'Female',
    lastDonationDate: '2024-02-15',
    isAvailable: false,
    willChangeLocation: true,
    yearsUntilChange: 2,
    targetDistrict: 'Dhaka'
  }
];

// Helper to initialize or get data
const getStoredDonors = (): Donor[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_DONORS));
    return SEED_DONORS;
  }
  return JSON.parse(stored);
};

// Helper to save data
const saveStoredDonors = (donors: Donor[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(donors));
};

export const getStats = (): Stats => {
  const donors = getStoredDonors();
  return {
    totalDonors: donors.length + 12400, // Mock base number + real count
    livesSaved: (donors.length * 3) + 35000 // Mock calc
  };
};

export const searchDonors = (bloodGroup: string, district: string): Promise<Donor[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const donors = getStoredDonors();
      const today = new Date();
      
      const results = donors.filter(d => {
        // Exclude admin from public search if needed, or keep them. 
        // Usually admins strictly managing shouldn't be in search unless they want to donate.
        // We will include them if they match criteria.
        
        // 1. Basic Match
        if (d.bloodGroup !== bloodGroup) return false;
        if (d.district !== district) return false;
        if (!d.isAvailable) return false;

        // 2. 4-Month Rule (120 Days)
        if (!d.lastDonationDate) return true; // Assume eligible if no date
        const lastDonation = new Date(d.lastDonationDate);
        const diffTime = Math.abs(today.getTime() - lastDonation.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        return diffDays >= 120;
      });
      resolve(results);
    }, 500);
  });
};

export const registerDonor = (donor: Omit<Donor, 'id'>): Promise<Donor> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const donors = getStoredDonors();
      const newDonor = { ...donor, id: Math.random().toString(36).substr(2, 9), role: 'user' as const };
      donors.push(newDonor);
      saveStoredDonors(donors);
      resolve(newDonor);
    }, 800);
  });
};

// Admin/User Functions

export const loginUser = (email: string, password: string): Promise<Donor | null> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const donors = getStoredDonors();
            const user = donors.find(d => d.email === email && d.password === password);
            resolve(user || null);
        }, 500);
    });
};

export const getAllDonors = (): Promise<Donor[]> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(getStoredDonors());
        }, 500);
    });
};

export const updateDonor = (updatedDonor: Donor): Promise<boolean> => {
    return new Promise((resolve) => {
        const donors = getStoredDonors();
        const index = donors.findIndex(d => d.id === updatedDonor.id);
        if (index !== -1) {
            donors[index] = updatedDonor;
            saveStoredDonors(donors);
            resolve(true);
        } else {
            resolve(false);
        }
    });
};

export const deleteDonor = (id: string): Promise<boolean> => {
    return new Promise((resolve) => {
        const donors = getStoredDonors();
        const filtered = donors.filter(d => d.id !== id);
        saveStoredDonors(filtered);
        resolve(true);
    });
};