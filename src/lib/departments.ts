export const DEPARTMENTS = [
  { id: "Design", label: "Design", color: "#ACD5F7" },
  { id: "HR", label: "HR", color: "#F2B47F" },
  { id: "Finance", label: "Finance", color: "#80BBA0" },
  { id: "Sales", label: "Sales", color: "#FB786B" },
  { id: "Marketing", label: "Marketing", color: "#A98AF0" },
  { id: "Operations", label: "Operations", color: "#FFE46A" },
] as const;

export type Department = (typeof DEPARTMENTS)[number]["id"];

export const NEUTRAL_CARD_COLOR = "#EFE3D2";

export function isDepartment(value: string): value is Department {
  return DEPARTMENTS.some((department) => department.id === value);
}

export function departmentColor(department: Department | ""): string {
  if (!department) return NEUTRAL_CARD_COLOR;
  return (
    DEPARTMENTS.find((item) => item.id === department)?.color ??
    NEUTRAL_CARD_COLOR
  );
}
