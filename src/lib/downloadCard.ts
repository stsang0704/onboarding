import { toPng } from "html-to-image";

const EXPORT_WIDTH = 1400;

export function cardFileName(fullName: string): string {
  const slug = fullName
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return `${slug || "connection-card"}-connection-card.png`;
}

function dataUrlToBlob(dataUrl: string): Blob {
  const [header, data] = dataUrl.split(",");
  const mime = header.match(/:(.*?);/)?.[1] ?? "image/png";
  const binary = atob(data);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return new Blob([bytes], { type: mime });
}

async function triggerDownload(blob: Blob, fileName: string): Promise<void> {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.rel = "noopener";
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1500);
}

export async function downloadConnectionCard(
  element: HTMLElement,
  fullName: string,
): Promise<"shared" | "downloaded"> {
  await document.fonts.ready;

  const previousInlineWidth = element.style.width;
  const previousInlineMaxWidth = element.style.maxWidth;
  element.style.width = `${EXPORT_WIDTH}px`;
  element.style.maxWidth = `${EXPORT_WIDTH}px`;

  // Let layout settle at the export size before capturing.
  await new Promise((resolve) => requestAnimationFrame(() => resolve(undefined)));
  await new Promise((resolve) => requestAnimationFrame(() => resolve(undefined)));

  try {
    const dataUrl = await toPng(element, {
      cacheBust: true,
      pixelRatio: 2,
      backgroundColor: undefined,
      style: {
        transform: "none",
      },
    });

    const blob = dataUrlToBlob(dataUrl);
    const fileName = cardFileName(fullName);
    const file = new File([blob], fileName, { type: "image/png" });

    const canShareFiles =
      typeof navigator.canShare === "function" &&
      navigator.canShare({ files: [file] });

    if (canShareFiles && typeof navigator.share === "function") {
      try {
        await navigator.share({
          files: [file],
          title: "Connection Card",
          text: `${fullName.trim() || "My"} Connection Card`,
        });
        return "shared";
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          throw error;
        }
      }
    }

    await triggerDownload(blob, fileName);
    return "downloaded";
  } finally {
    element.style.width = previousInlineWidth;
    element.style.maxWidth = previousInlineMaxWidth;
  }
}
