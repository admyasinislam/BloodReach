import { BloodGroup, District } from './types';

export const BLOOD_GROUPS: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

// For simplicity in this demo, we use a subset of major districts. 
// In a real app, this would contain all 64 districts.
export const DISTRICTS: District[] = [
  'Dhaka', 'Chittagong', 'Sylhet', 'Rajshahi', 'Khulna', 
  'Barisal', 'Rangpur', 'Mymensingh', 'Comilla', 'Narayanganj', 'Gazipur'
];

export const DISTRICT_LABELS: Record<District, string> = {
  'Dhaka': 'ঢাকা',
  'Chittagong': 'চট্টগ্রাম',
  'Sylhet': 'সিলেট',
  'Rajshahi': 'রাজশাহী',
  'Khulna': 'খুলনা',
  'Barisal': 'বরিশাল',
  'Rangpur': 'রংপুর',
  'Mymensingh': 'ময়মনসিংহ',
  'Comilla': 'কুমিল্লা',
  'Narayanganj': 'নারায়ণগঞ্জ',
  'Gazipur': 'গাজীপুর'
};

export const GENDER_LABELS = {
  'Male': 'পুরুষ',
  'Female': 'মহিলা',
  'Other': 'অন্যান্য'
};