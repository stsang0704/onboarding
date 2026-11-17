import { Check, Pencil } from "lucide-react";
import { useRef } from "react";
import type { EmployeeProfile } from "../types.ts";
import { Button } from "./Button.tsx";
import { ConnectionCard } from "./ConnectionCard.tsx";
import { DownloadCardButton } from "./DownloadCardButton.tsx";

type SavedCardProps = {
  profile: EmployeeProfile;
  onEdit: () => void;
  onHome: () => void;
};

export function SavedCard({ profile, onEdit, onHome }: SavedCardProps) {
  const cardRef = useRef<HTMLElement>(null);

  return (
    <div className="mx-auto max-w-2xl pt-4 sm:pt-8">
      <p className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-sm font-semibold ring-1 ring-black/5">
        <Check className="size-4" aria-hidden="true" />
        Saved on this browser
      </p>
      <h1 className="mt-5 font-serif text-4xl leading-tight font-bold tracking-[-0.03em] sm:text-5xl">
        Your Connection Card
      </h1>
      <p className="mt-3 max-w-lg text-base leading-relaxed text-muted">
        This card is ready for the community wall. Download a PNG for printing,
        or edit your details anytime on this device.
      </p>

      <div className="mt-8">
        <ConnectionCard
          ref={cardRef}
          fullName={profile.fullName}
          jobTitle={profile.jobTitle}
          yearJoined={String(profile.yearJoined)}
          hobbies={profile.hobbies}
          photoDataUrl={profile.photoDataUrl}
          department={profile.department}
        />
      </div>
      <p className="mt-3 text-sm text-muted">
        {profile.department} cards share this color.
      </p>

      <div className="mt-8 flex flex-wrap items-start gap-3">
        <DownloadCardButton
          cardRef={cardRef}
          fullName={profile.fullName}
          variant="primary"
        />
        <Button onClick={onEdit} variant="secondary">
          <Pencil className="size-4" aria-hidden="true" />
          Edit my card
        </Button>
        <Button variant="ghost" onClick={onHome}>
          Back to welcome
        </Button>
      </div>
    </div>
  );
}
