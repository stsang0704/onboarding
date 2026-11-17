import { ArrowRight, Pencil } from "lucide-react";
import { useRef } from "react";
import { DEPARTMENTS } from "../lib/departments.ts";
import type { EmployeeProfile } from "../types.ts";
import { Button } from "./Button.tsx";
import { ConnectionCard } from "./ConnectionCard.tsx";
import { DownloadCardButton } from "./DownloadCardButton.tsx";

type WelcomePageProps = {
  profile: EmployeeProfile | null;
  onContinue: () => void;
};

export function WelcomePage({ profile, onContinue }: WelcomePageProps) {
  const cardRef = useRef<HTMLElement>(null);

  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center pt-4 text-center sm:pt-8">
      <p className="text-sm font-bold tracking-[0.16em] text-muted uppercase">
        Office community wall
      </p>
      <h1 className="mt-4 font-serif text-5xl leading-[0.95] font-bold tracking-[-0.04em] text-balance sm:text-6xl">
        Your Connection Card
      </h1>
      <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted text-pretty">
        Make a Connection Card for the office community wall. Share your name,
        role, and the things you enjoy, and take your place among the people
        you work with.
      </p>

      {profile ? (
        <div className="mt-10 w-full max-w-xl text-left">
          <p className="mb-4 text-center text-sm font-semibold text-muted">
            Your card is saved on this browser. You can edit it anytime.
          </p>
          <ConnectionCard
            ref={cardRef}
            fullName={profile.fullName}
            jobTitle={profile.jobTitle}
            yearJoined={String(profile.yearJoined)}
            hobbies={profile.hobbies}
            photoDataUrl={profile.photoDataUrl}
            department={profile.department}
          />
          <div className="mt-6 flex flex-wrap items-start justify-center gap-3">
            <DownloadCardButton
              cardRef={cardRef}
              fullName={profile.fullName}
              variant="primary"
            />
            <Button onClick={onContinue} variant="secondary">
              <Pencil className="size-4" aria-hidden="true" />
              Edit my Connection Card
            </Button>
          </div>
        </div>
      ) : (
        <Button className="mt-8" onClick={onContinue}>
          Create My Connection Card
          <ArrowRight className="size-5" aria-hidden="true" />
        </Button>
      )}

      <ul className="mt-12 flex max-w-lg flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-muted">
        {DEPARTMENTS.map((department) => (
          <li key={department.id} className="inline-flex items-center gap-2">
            <span
              className="size-3 rounded-full ring-1 ring-black/10"
              style={{ backgroundColor: department.color }}
              aria-hidden="true"
            />
            {department.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
