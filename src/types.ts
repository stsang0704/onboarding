import type { Department } from "./lib/departments.ts";

export type EmployeeProfile = {
  id: string;
  fullName: string;
  department: Department;
  jobTitle: string;
  yearJoined: number;
  hobbies: string[];
  photoDataUrl: string | null;
  updatedAt: string;
};
