export interface PersonalDetails {
  fullName: string;
  mobile: string;
  email: string;
  dob: string;
  address?: string;
  image?: string;
  latitude?: number;
  longitude?: number;
  summary: string;
}

export interface ResumeData {
  id: string;
  template: string;
  createdAt: string;
  personal: PersonalDetails;
  education: Education[];
  skills: Skills;
  experience?: Experience[];
  projects?: Project[];
  certifications?: Certification[];
  languages?: string[];
  declaration?: string;
}

export interface Certification {
  id: string;
  name: string;
  institute: string;
}


export interface Education {
  id: string;
  degree: string;
  institute: string;
  board: string;
  passingYear: string;
  percentage: string;
}

export interface Skills {
  technical: string[];
  soft: string[];
}

export interface Experience {
  id: string;
  company: string;
  jobTitle: string;
  from: string;
  to: string;
  responsibilities: string;
}


export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string;
}
