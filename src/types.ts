export interface CandidateRecord {
  submissionId: string;
  candidateId: string;
  timestamp: string;
  fullName: string;
  phoneNumber: string;
  district: string;
  officeOrIti: string;
  skillCategory: string;
  status: string;
}

export interface MasterITI {
  district: string;
  itiType: string;
  name: string;
}

export interface MasterSkill {
  slNo: number;
  name: string;
}

export interface DistrictStat {
  district: string;
  totalCandidates: number;
  totalITIs: number;
  activeITIs: number;
  topSkill: string;
}

export interface SkillStat {
  slNo: number;
  skillName: string;
  candidateCount: number;
  districtsCount: number;
  itisCount: number;
}

export interface ITIStat {
  name: string;
  district: string;
  itiType: string;
  candidateCount: number;
  skillsOffered: string[];
  status: 'Active Registrations' | 'No Registrations Yet';
}

export type ActiveTab = 'districts' | 'skills' | 'all-candidates';
export type NavigationState = 
  | { view: 'home'; tab?: ActiveTab }
  | { view: 'district'; districtName: string }
  | { view: 'skill'; skillName: string };
