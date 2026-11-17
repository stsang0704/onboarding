import { UserRound } from "lucide-react";
import { forwardRef } from "react";
import type { Department } from "../lib/departments.ts";
import { departmentColor } from "../lib/departments.ts";

export type ConnectionCardProps = {
  fullName: string;
  jobTitle: string;
  yearJoined: string;
  hobbies: string[];
  photoDataUrl: string | null;
  department: Department | "";
};

function nameSizeClass(name: string): string {
  if (name.length > 24) return "text-[5.3cqw]";
  if (name.length > 16) return "text-[6.2cqw]";
  return "text-[7.3cqw]";
}

export const ConnectionCard = forwardRef<HTMLElement, ConnectionCardProps>(
  function ConnectionCard(
    {
      fullName,
      jobTitle,
      yearJoined,
      hobbies,
      photoDataUrl,
      department,
    },
    ref,
  ) {
    const trimmedName = fullName.trim();
    const trimmedRole = jobTitle.trim();
    const trimmedYear = yearJoined.trim();
    const visibleHobbies = hobbies.map((hobby) => hobby.trim()).filter(Boolean);
    const displayName = trimmedName || "Your name";
    const displayRole = trimmedRole || "Your role";
    const displaySince = trimmedYear ? `since ${trimmedYear}` : "since —";
    const hobbySize =
      visibleHobbies.length > 5 ? "text-[3cqw]" : "text-[3.55cqw]";

    return (
      <article
        ref={ref}
        id="connection-card"
        aria-label={
          trimmedName
            ? `${trimmedName}'s connection card`
            : "Connection card preview"
        }
        className="@container relative aspect-[7/4] w-full overflow-hidden rounded-[2.2cqw] text-ink shadow-[0_18px_40px_-20px_rgba(42,36,28,0.45)] ring-1 ring-black/5"
        style={{ backgroundColor: departmentColor(department) }}
        data-department={department || "unset"}
      >
        <div className="absolute top-[7%] left-[5.5%] flex w-[89%] items-center gap-[3.5%]">
          <div className="size-[22cqw] shrink-0 overflow-hidden rounded-full border-[0.7cqw] border-white bg-white">
            {photoDataUrl ? (
              <img
                src={photoDataUrl}
                alt={
                  trimmedName ? `${trimmedName} profile photo` : "Profile photo"
                }
                className="size-full object-cover"
              />
            ) : (
              <div className="flex size-full items-center justify-center text-ink/35">
                <UserRound
                  className="size-[9cqw]"
                  strokeWidth={1.6}
                  aria-hidden="true"
                />
              </div>
            )}
          </div>

          <div className="min-w-0 pr-[8%]">
            <h2
              className={`font-serif leading-[0.92] font-bold tracking-[-0.035em] [overflow-wrap:anywhere] ${nameSizeClass(displayName)} ${trimmedName ? "" : "opacity-45"}`}
            >
              {displayName}
            </h2>
            <p
              className={`mt-[1.5cqw] text-[3.25cqw] leading-tight font-semibold [overflow-wrap:anywhere] ${trimmedRole ? "" : "opacity-50"}`}
            >
              {displayRole}
            </p>
            <p
              className={`mt-[0.55cqw] text-[3cqw] leading-tight font-medium ${trimmedYear ? "opacity-80" : "opacity-50"}`}
            >
              {displaySince}
            </p>
          </div>
        </div>

        <p
          className={`absolute bottom-[9%] left-[5.5%] line-clamp-3 w-[60%] leading-snug font-semibold [overflow-wrap:anywhere] ${hobbySize} ${visibleHobbies.length ? "" : "font-medium opacity-50"}`}
        >
          {visibleHobbies.length === 0
            ? "Your hobbies"
            : visibleHobbies.map((hobby, index) => (
                <span key={hobby}>
                  {index > 0 && <span className="sr-only">, </span>}
                  {index > 0 && (
                    <span className="px-[0.4em] opacity-70" aria-hidden="true">
                      •
                    </span>
                  )}
                  {hobby}
                </span>
              ))}
        </p>

        <div
          className="absolute right-[5%] bottom-[6.5%] size-[27cqw] rounded-full bg-white shadow-[0_0_0_1px_rgba(42,36,28,0.06)]"
          aria-hidden="true"
        />
      </article>
    );
  },
);
