import { Download } from "lucide-react";
import { useState, type RefObject } from "react";
import { downloadConnectionCard } from "../lib/downloadCard.ts";
import { Button } from "./Button.tsx";

type DownloadCardButtonProps = {
  cardRef: RefObject<HTMLElement | null>;
  fullName: string;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
};

export function DownloadCardButton({
  cardRef,
  fullName,
  variant = "secondary",
  className = "",
}: DownloadCardButtonProps) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function onDownload() {
    const card = cardRef.current;
    if (!card || busy) return;

    setBusy(true);
    setError("");
    setMessage("");

    try {
      const result = await downloadConnectionCard(card, fullName);
      setMessage(
        result === "shared"
          ? "Share sheet opened. Save the image to Downloads or Photos."
          : "Card image saved to your downloads.",
      );
    } catch (caught) {
      if (caught instanceof DOMException && caught.name === "AbortError") {
        return;
      }
      setError("Could not download the card. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={className}>
      <Button
        type="button"
        variant={variant}
        onClick={onDownload}
        disabled={busy}
        aria-describedby={
          error ? "download-card-error" : message ? "download-card-status" : undefined
        }
      >
        <Download className="size-4" aria-hidden="true" />
        {busy ? "Preparing…" : "Download card"}
      </Button>
      {message && (
        <p id="download-card-status" className="mt-2 text-sm text-muted" role="status">
          {message}
        </p>
      )}
      {error && (
        <p id="download-card-error" className="mt-2 text-sm text-danger" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
