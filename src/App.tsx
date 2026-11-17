import { useEffect, useState } from "react";
import { OnboardingForm } from "./components/OnboardingForm.tsx";
import { SavedCard } from "./components/SavedCard.tsx";
import { WelcomePage } from "./components/WelcomePage.tsx";
import { loadProfile, saveProfile } from "./lib/storage.ts";
import type { EmployeeProfile } from "./types.ts";

type Screen = "welcome" | "form" | "saved";

export default function App() {
  const [screen, setScreen] = useState<Screen>("welcome");
  const [profile, setProfile] = useState<EmployeeProfile | null>(() =>
    loadProfile(),
  );

  useEffect(() => {
    const titles: Record<Screen, string> = {
      welcome: "Your Connection Card",
      form: profile ? "Edit your Connection Card" : "Create your Connection Card",
      saved: "Your Connection Card",
    };
    document.title = titles[screen];
  }, [screen, profile]);

  function handleSave(next: EmployeeProfile) {
    saveProfile(next);
    setProfile(next);
    setScreen("saved");
  }

  return (
    <div className="min-h-dvh bg-cream text-ink">
      <main className="mx-auto w-full max-w-6xl px-5 pt-8 pb-20 sm:px-8 sm:pt-12">
        {screen === "welcome" && (
          <WelcomePage
            profile={profile}
            onContinue={() => setScreen("form")}
          />
        )}
        {screen === "form" && (
          <OnboardingForm
            initialProfile={profile}
            onSave={handleSave}
            onBack={() => setScreen(profile ? "saved" : "welcome")}
          />
        )}
        {screen === "saved" && profile && (
          <SavedCard
            profile={profile}
            onEdit={() => setScreen("form")}
            onHome={() => setScreen("welcome")}
          />
        )}
      </main>
    </div>
  );
}
