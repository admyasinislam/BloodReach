export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

export type District = 
  | 'Dhaka' | 'Chittagong' | 'Sylhet' | 'Rajshahi' | 'Khulna' 
  | 'Barisal' | 'Rangpur' | 'Mymensingh' | 'Comilla' | 'Narayanganj' | 'Gazipur';

export interface Donor {
  id: string;
  name: string;
  email?: string; // Added for Auth
  password?: string; // Added for Auth (Mock)
  role?: 'admin' | 'user'; // Added for Role-based access
  phone: string;
  bloodGroup: BloodGroup;
  district: District;
  gender: 'Male' | 'Female' | 'Other';
  lastDonationDate: string; // ISO Date string YYYY-MM-DD
  isAvailable: boolean;
  institute?: string;
  
  // Future location logic
  willChangeLocation: boolean;
  yearsUntilChange?: number;
  targetDistrict?: District;
}

export interface Stats {
  totalDonors: number;
  livesSaved: number;
}