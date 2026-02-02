
export enum CourseType {
  Foundation = 'Foundation',
  Diploma = 'Diploma',
  Bachelor = 'Bachelor',
  Master = 'Master',
  PhD = 'PhD',
  ShortCourse = 'Short Course'
}

export interface Course {
  id: string;
  universityName: string;
  courseName: string;
  courseType: CourseType;
  priceMYR: number; // This acts as Tuition Fees
  miscFeesMYR: number;
  location: string;
  description?: string;
}

export interface FilterState {
  search: string;
  courseType: string;
  location: string;
  university: string;
  courseName: string;
  maxPrice: number;
}
