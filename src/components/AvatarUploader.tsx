"use client";

import { useCallback, useRef, useState } from "react";
import { useModalA11y } from "@/lib/use-modal-a11y";
import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  type Crop,
  type PixelCrop,
} from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { gradientCss } from "@/lib/avatar-gradient";

type Props = {
  value: string | null;
  displayName?: string;
  onChange: (dataUrl: string | null) => void;
};

const OUTPUT_SIZE = 512;
// 8 MB is plenty for a phone photo before we re-encode it; anything bigger
// suggests something's off (and we don't want the FileReader to choke).
const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;
const ACCEPT_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
]);

export function AvatarUploader({ value, displayName, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
  const [error, setError] = useState<string | null>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  function pickFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    if (file.size > MAX_UPLOAD_BYTES) {
      setError("That image is too big. Try one under 8 MB.");
      return;
    }
    if (file.type && !ACCEPT_TYPES.has(file.type)) {
      setError("Use a JPG, PNG, WebP, or HEIC image.");
      return;
    }

    setError(null);
    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result as string);
      setOpen(true);
    };
    reader.onerror = () => setError("Couldn't read that file.");
    reader.readAsDataURL(file);
  }

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const { width, height } = e.currentTarget;
    const initialCrop = centerCrop(
      makeAspectCrop({ unit: "%", width: 80 }, 1, width, height),
      width,
      height,
    );
    setCrop(initialCrop);
  }

  function save() {
    if (!imageRef.current || !completedCrop) return;
    const dataUrl = cropToDataUrl(imageRef.current, completedCrop);
    if (dataUrl) onChange(dataUrl);
    setOpen(false);
    setImageSrc(null);
  }

  function clear() {
    onChange(null);
    setOpen(false);
    setImageSrc(null);
  }

  const closeModal = useCallback(() => {
    setOpen(false);
    setImageSrc(null);
  }, []);
  const dialogRef = useModalA11y(open, closeModal);

  return (
    <>
      <div className="flex items-center gap-4">
        <AvatarPreview value={value} displayName={displayName} />
        <div className="flex flex-col gap-2">
          <label className="cursor-pointer px-3 py-1.5 rounded-full text-sm border border-[color:var(--color-border)] hover:bg-white/5 transition-colors">
            {value ? "Change photo" : "Upload photo"}
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={pickFile}
            />
          </label>
          {value && (
            <button
              type="button"
              onClick={clear}
              className="px-3 py-1.5 rounded-full text-sm text-[color:var(--color-muted)] hover:text-[color:var(--color-foreground)]"
            >
              Remove
            </button>
          )}
          {error && (
            <p className="text-xs text-red-400" role="alert">
              {error}
            </p>
          )}
        </div>
      </div>

      {open && imageSrc && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="avatar-crop-title"
            tabIndex={-1}
            className="bg-[color:var(--color-card)] border border-[color:var(--color-border)] rounded-2xl p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 id="avatar-crop-title" className="text-lg font-semibold mb-1">Crop your photo</h3>
            <p className="text-sm text-[color:var(--color-muted)] mb-4">
              Drag to reposition. The circle is what people will see.
            </p>
            <div className="rounded-xl overflow-hidden bg-black/40 mb-4 max-h-[60vh] flex items-center justify-center">
              <ReactCrop
                crop={crop}
                onChange={(c) => setCrop(c)}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={1}
                circularCrop
                keepSelection
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  ref={imageRef}
                  src={imageSrc}
                  alt=""
                  onLoad={onImageLoad}
                  style={{ maxHeight: "55vh", maxWidth: "100%" }}
                />
              </ReactCrop>
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="px-4 py-2 rounded-full text-sm border border-[color:var(--color-border)] hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={save}
                disabled={!completedCrop?.width}
                className="px-4 py-2 rounded-full text-sm font-medium bg-[color:var(--color-foreground)] text-[color:var(--color-background)] hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export function AvatarPreview({
  value,
  displayName,
  size = 80,
}: {
  value: string | null;
  displayName?: string;
  size?: number;
}) {
  const initial = (displayName?.trim().charAt(0) || "?").toUpperCase();

  if (!value) {
    return (
      <div
        className="rounded-full flex items-center justify-center font-semibold text-white"
        style={{
          width: size,
          height: size,
          fontSize: size * 0.4,
          background: gradientCss(displayName),
        }}
        aria-hidden
      >
        {initial}
      </div>
    );
  }

  return (
    // Data URL avatars; once we move to remote URLs, swap to next/image.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={value}
      alt={displayName ? `${displayName}'s avatar` : ""}
      width={size}
      height={size}
      style={{ width: size, height: size }}
      className="rounded-full object-cover"
    />
  );
}

function cropToDataUrl(image: HTMLImageElement, crop: PixelCrop): string | null {
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;
  const sx = crop.x * scaleX;
  const sy = crop.y * scaleY;
  const sw = crop.width * scaleX;
  const sh = crop.height * scaleY;
  if (!sw || !sh) return null;

  const canvas = document.createElement("canvas");
  canvas.width = OUTPUT_SIZE;
  canvas.height = OUTPUT_SIZE;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(image, sx, sy, sw, sh, 0, 0, OUTPUT_SIZE, OUTPUT_SIZE);

  // JPEG keeps the data URL small enough for localStorage.
  return canvas.toDataURL("image/jpeg", 0.9);
}

