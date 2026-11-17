import { isDepartment } from "./departments.ts";
import type { EmployeeProfile } from "../types.ts";

const STORAGE_KEY = "together.connection-card";

function isProfile(value: unknown): value is EmployeeProfile {
  if (!value || typeof value !== "object") return false;

  const profile = value as Partial<EmployeeProfile>;

  return (
    typeof profile.id === "string" &&
    typeof profile.fullName === "string" &&
    typeof profile.department === "string" &&
    isDepartment(profile.department) &&
    typeof profile.jobTitle === "string" &&
    typeof profile.yearJoined === "number" &&
    Number.isFinite(profile.yearJoined) &&
    Array.isArray(profile.hobbies) &&
    profile.hobbies.every((hobby) => typeof hobby === "string") &&
    (typeof profile.photoDataUrl === "string" || profile.photoDataUrl === null) &&
    typeof profile.updatedAt === "string"
  );
}

export function loadProfile(): EmployeeProfile | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    return isProfile(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function saveProfile(profile: EmployeeProfile): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
}
