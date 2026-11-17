import { ImagePlus, Plus, UserRound, X } from "lucide-react";
import { useState, type ChangeEvent, type FormEvent } from "react";
import {
  DEPARTMENTS,
  departmentColor,
  isDepartment,
  type Department,
} from "../lib/departments.ts";
import { fileToPhotoDataUrl } from "../lib/photo.ts";
import type { EmployeeProfile } from "../types.ts";
import { Button } from "./Button.tsx";
import { ConnectionCard } from "./ConnectionCard.tsx";

const MAX_HOBBIES = 8;
const CURRENT_YEAR = new Date().getFullYear();
const YEAR_OPTIONS = Array.from(
  { length: CURRENT_YEAR - 1979 },
  (_, index) => CURRENT_YEAR - index,
);

const fieldClass =
  "w-full rounded-2xl border bg-white px-4 py-3 text-base text-ink outline-none transition placeholder:text-[#b3a89c] focus:border-ink";

type FieldName = "fullName" | "department" | "jobTitle" | "yearJoined";
type FormErrors = Partial<Record<FieldName | "form", string>>;

type OnboardingFormProps = {
  initialProfile: EmployeeProfile | null;
  onSave: (profile: EmployeeProfile) => void;
  onBack: () => void;
};

export function OnboardingForm({
  initialProfile,
  onSave,
  onBack,
}: OnboardingFormProps) {
  const [fullName, setFullName] = useState(initialProfile?.fullName ?? "");
  const [department, setDepartment] = useState<Department | "">(
    initialProfile?.department ?? "",
  );
  const [jobTitle, setJobTitle] = useState(initialProfile?.jobTitle ?? "");
  const [yearJoined, setYearJoined] = useState(
    initialProfile ? String(initialProfile.yearJoined) : "",
  );
  const [hobbies, setHobbies] = useState<string[]>(
    initialProfile?.hobbies ?? [],
  );
  const [hobbyDraft, setHobbyDraft] = useState("");
  const [photoDataUrl, setPhotoDataUrl] = useState<string | null>(
    initialProfile?.photoDataUrl ?? null,
  );
  const [photoError, setPhotoError] = useState("");
  const [photoBusy, setPhotoBusy] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const pendingHobby = hobbyDraft.trim();
  const previewHobbies =
    pendingHobby &&
    !hobbies.some((hobby) => hobby.toLowerCase() === pendingHobby.toLowerCase())
      ? [...hobbies, pendingHobby]
      : hobbies;

  function clearError(field: FieldName) {
    setErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  }

  function addHobby() {
    if (!pendingHobby || hobbies.length >= MAX_HOBBIES) return;
    if (
      hobbies.some((hobby) => hobby.toLowerCase() === pendingHobby.toLowerCase())
    ) {
      setHobbyDraft("");
      return;
    }
    setHobbies((current) => [...current, pendingHobby]);
    setHobbyDraft("");
  }

  async function onPhotoChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setPhotoBusy(true);
    setPhotoError("");
    try {
      setPhotoDataUrl(await fileToPhotoDataUrl(file));
    } catch (error) {
      setPhotoError(
        error instanceof Error ? error.message : "Could not use that photo.",
      );
    } finally {
      setPhotoBusy(false);
    }
  }

  function hobbiesForSave(): string[] {
    if (!pendingHobby || hobbies.length >= MAX_HOBBIES) return hobbies;
    if (
      hobbies.some((hobby) => hobby.toLowerCase() === pendingHobby.toLowerCase())
    ) {
      return hobbies;
    }
    return [...hobbies, pendingHobby];
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors: FormErrors = {};
    if (!fullName.trim()) nextErrors.fullName = "Add your full name.";
    if (!department) nextErrors.department = "Choose your department.";
    if (!jobTitle.trim()) nextErrors.jobTitle = "Add your job title.";
    if (!yearJoined) nextErrors.yearJoined = "Choose the year you joined.";

    const year = Number(yearJoined);
    if (yearJoined && (!Number.isInteger(year) || year < 1980 || year > CURRENT_YEAR)) {
      nextErrors.yearJoined = "Choose a valid year.";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      const firstInvalid = (
        ["fullName", "department", "jobTitle", "yearJoined"] as const
      ).find((field) => nextErrors[field]);
      if (firstInvalid) {
        const element = document.getElementById(firstInvalid);
        element?.scrollIntoView({ behavior: "smooth", block: "center" });
        element?.focus();
      }
      return;
    }

    if (!isDepartment(department)) return;

    const profile: EmployeeProfile = {
      id: initialProfile?.id ?? crypto.randomUUID(),
      fullName: fullName.trim(),
      department,
      jobTitle: jobTitle.trim(),
      yearJoined: Number(yearJoined),
      hobbies: hobbiesForSave(),
      photoDataUrl,
      updatedAt: new Date().toISOString(),
    };

    try {
      onSave(profile);
    } catch {
      setErrors({
        form: "This browser blocked local saving. Allow site data, then try again.",
      });
    }
  }

  const editing = initialProfile !== null;
  const atHobbyLimit = hobbies.length >= MAX_HOBBIES;

  return (
    <div className="grid items-start gap-10 pt-2 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:pt-4">
      <form className="@container order-2 lg:order-1" onSubmit={onSubmit} noValidate>
        <h1 className="font-serif text-4xl leading-tight font-bold tracking-[-0.03em] sm:text-5xl">
          {editing ? "Edit your Connection Card" : "Create your Connection Card"}
        </h1>
        <p className="mt-3 max-w-md text-base leading-relaxed text-muted">
          The preview updates as you type. People in the same department share
          one card color.
        </p>

        <div className="mt-8 space-y-5">
          <label className="block" htmlFor="fullName">
            <span className="mb-1.5 block text-sm font-bold">Full name</span>
            <input
              id="fullName"
              name="name"
              autoComplete="name"
              value={fullName}
              maxLength={80}
              aria-required="true"
              aria-invalid={Boolean(errors.fullName)}
              aria-describedby={errors.fullName ? "fullName-error" : undefined}
              placeholder="Jordan Lee"
              className={`${fieldClass} ${errors.fullName ? "border-danger" : "border-line"}`}
              onChange={(event) => {
                setFullName(event.target.value);
                clearError("fullName");
              }}
            />
            {errors.fullName && (
              <p id="fullName-error" className="mt-1.5 text-sm text-danger">
                {errors.fullName}
              </p>
            )}
          </label>

          <div className="grid gap-5 @min-[36rem]:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-bold" htmlFor="department">
                Department / Function
              </label>
              <div className="flex items-center gap-3">
                <div className="relative min-w-0 flex-1">
                  <select
                    id="department"
                    name="department"
                    value={department}
                    aria-required="true"
                    aria-invalid={Boolean(errors.department)}
                    aria-describedby={
                      errors.department ? "department-error" : "department-hint"
                    }
                    className={`${fieldClass} appearance-none pr-10 ${errors.department ? "border-danger" : "border-line"}`}
                    onChange={(event) => {
                      const value = event.target.value;
                      setDepartment(isDepartment(value) ? value : "");
                      clearError("department");
                    }}
                  >
                    <option value="">Select a department</option>
                    {DEPARTMENTS.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-xs text-muted">
                    ▾
                  </span>
                </div>
                <span
                  className="size-12 shrink-0 rounded-full ring-1 ring-black/10"
                  style={{ backgroundColor: departmentColor(department) }}
                  role="img"
                  aria-label={
                    department
                      ? `${department} card color`
                      : "Card color not chosen yet"
                  }
                />
              </div>
              {errors.department ? (
                <p id="department-error" className="mt-1.5 text-sm text-danger">
                  {errors.department}
                </p>
              ) : (
                <p id="department-hint" className="mt-1.5 text-sm text-muted">
                  {department
                    ? `Everyone in ${department} uses this color.`
                    : "Your department sets the card color."}
                </p>
              )}
            </div>

            <label className="block" htmlFor="yearJoined">
              <span className="mb-1.5 block text-sm font-bold">
                Year joined the company
              </span>
              <div className="relative">
                <select
                  id="yearJoined"
                  name="yearJoined"
                  value={yearJoined}
                  aria-required="true"
                  aria-invalid={Boolean(errors.yearJoined)}
                  aria-describedby={errors.yearJoined ? "yearJoined-error" : undefined}
                  className={`${fieldClass} appearance-none pr-10 ${errors.yearJoined ? "border-danger" : "border-line"}`}
                  onChange={(event) => {
                    setYearJoined(event.target.value);
                    clearError("yearJoined");
                  }}
                >
                  <option value="">Year</option>
                  {YEAR_OPTIONS.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
                <span className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-xs text-muted">
                  ▾
                </span>
              </div>
              {errors.yearJoined && (
                <p id="yearJoined-error" className="mt-1.5 text-sm text-danger">
                  {errors.yearJoined}
                </p>
              )}
            </label>
          </div>

          <label className="block" htmlFor="jobTitle">
            <span className="mb-1.5 block text-sm font-bold">Job title / Role</span>
            <input
              id="jobTitle"
              name="organization-title"
              autoComplete="organization-title"
              value={jobTitle}
              maxLength={60}
              aria-required="true"
              aria-invalid={Boolean(errors.jobTitle)}
              aria-describedby={errors.jobTitle ? "jobTitle-error" : undefined}
              placeholder="Product Designer"
              className={`${fieldClass} ${errors.jobTitle ? "border-danger" : "border-line"}`}
              onChange={(event) => {
                setJobTitle(event.target.value);
                clearError("jobTitle");
              }}
            />
            {errors.jobTitle && (
              <p id="jobTitle-error" className="mt-1.5 text-sm text-danger">
                {errors.jobTitle}
              </p>
            )}
          </label>

          <fieldset>
            <legend className="mb-1.5 text-sm font-bold">
              Hobbies and interests
            </legend>
            <div className="flex gap-2">
              <input
                id="hobby"
                value={hobbyDraft}
                maxLength={40}
                disabled={atHobbyLimit}
                placeholder={atHobbyLimit ? "Hobby limit reached" : "Hiking"}
                aria-describedby="hobby-hint"
                className={`${fieldClass} border-line disabled:bg-cream`}
                onChange={(event) => setHobbyDraft(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    addHobby();
                  }
                }}
              />
              <Button
                type="button"
                variant="secondary"
                className="shrink-0 px-4"
                onClick={addHobby}
                disabled={!pendingHobby || atHobbyLimit}
              >
                <Plus className="size-4" aria-hidden="true" />
                Add
              </Button>
            </div>
            <p id="hobby-hint" className="mt-1.5 text-sm text-muted">
              {atHobbyLimit
                ? "Eight hobbies fit on the card. Remove one to add another."
                : "Add a few. Press Enter after each one."}
            </p>
            {hobbies.length > 0 && (
              <ul className="mt-3 flex flex-wrap gap-2">
                {hobbies.map((hobby) => (
                  <li
                    key={hobby}
                    className="inline-flex items-center gap-1 rounded-full border border-line bg-white py-1 pr-1 pl-3 text-sm font-semibold"
                  >
                    {hobby}
                    <button
                      type="button"
                      className="cursor-pointer rounded-full p-1 text-muted hover:text-ink"
                      aria-label={`Remove ${hobby}`}
                      onClick={() =>
                        setHobbies((current) =>
                          current.filter((item) => item !== hobby),
                        )
                      }
                    >
                      <X className="size-3.5" aria-hidden="true" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </fieldset>

          <fieldset>
            <legend className="mb-1.5 text-sm font-bold">
              Profile photo{" "}
              <span className="font-medium text-muted">(optional)</span>
            </legend>
            <div className="flex items-center gap-4">
              <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-full border border-line bg-white text-ink/35">
                {photoDataUrl ? (
                  <img
                    src={photoDataUrl}
                    alt="Selected profile photo"
                    className="size-full object-cover"
                  />
                ) : (
                  <UserRound className="size-7" strokeWidth={1.6} aria-hidden="true" />
                )}
              </div>
              <div className="flex flex-col items-start gap-1">
                <div className="flex flex-wrap gap-2">
                  <label className="inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold focus-within:outline focus-within:outline-2 focus-within:outline-offset-3 focus-within:outline-ink">
                    <ImagePlus className="size-4" aria-hidden="true" />
                    {photoDataUrl ? "Change photo" : "Upload photo"}
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      className="sr-only"
                      onChange={onPhotoChange}
                    />
                  </label>
                  {photoDataUrl && (
                    <button
                      type="button"
                      className="cursor-pointer rounded-full px-3 py-2 text-sm font-semibold text-muted hover:text-ink"
                      onClick={() => {
                        setPhotoDataUrl(null);
                        setPhotoError("");
                      }}
                    >
                      Remove
                    </button>
                  )}
                </div>
                <p className="text-sm text-muted">
                  {photoBusy ? "Preparing your photo…" : "A square photo works best."}
                </p>
                {photoError && (
                  <p role="alert" className="text-sm text-danger">
                    {photoError}
                  </p>
                )}
              </div>
            </div>
          </fieldset>
        </div>

        {errors.form && (
          <p role="alert" className="mt-6 text-sm text-danger">
            {errors.form}
          </p>
        )}

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Button type="submit" disabled={photoBusy}>
            {photoBusy ? "Preparing photo…" : "Save my card"}
          </Button>
          <Button variant="ghost" onClick={onBack}>
            Back
          </Button>
        </div>
      </form>

      <aside className="order-1 lg:sticky lg:top-8 lg:order-2">
        <p className="mb-3 text-sm font-bold tracking-[0.12em] text-muted uppercase">
          Live preview
        </p>
        <ConnectionCard
          fullName={fullName}
          jobTitle={jobTitle}
          yearJoined={yearJoined}
          hobbies={previewHobbies}
          photoDataUrl={photoDataUrl}
          department={department}
        />
        <p className="mt-3 text-sm leading-relaxed text-muted">
          {department
            ? `${department} keeps this color for every person on the team, whatever their role.`
            : "Choose a department and the card color will match your team."}
        </p>
      </aside>
    </div>
  );
}
