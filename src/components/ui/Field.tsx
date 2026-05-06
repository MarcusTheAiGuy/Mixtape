import type { ReactNode } from "react";

export type FieldProps = {
  label: string;
  /** Stretch across both columns of a 2-col field grid. */
  wide?: boolean;
  /** Helper / counter text under the input. */
  hint?: ReactNode;
  children: ReactNode;
};

/**
 * Form field wrapper that labels its child input with the standard eyebrow
 * style and an optional hint line underneath.
 */
export function Field({ label, wide, hint, children }: FieldProps) {
  return (
    <label className={`block ${wide ? "sm:col-span-2" : ""}`}>
      <span className="text-xs uppercase tracking-wider text-[color:var(--color-muted)] mb-1.5 block">
        {label}
      </span>
      {children}
      {hint && (
        <span className="text-xs text-[color:var(--color-muted)] mt-1 block">{hint}</span>
      )}
    </label>
  );
}

const INPUT_CLASS =
  "w-full px-3 py-2 rounded-lg bg-[color:var(--color-background)] border border-[color:var(--color-border)] focus:outline-none focus:border-[color:var(--color-accent)] placeholder:text-[color:var(--color-muted)]";

/**
 * Pre-styled input. Matches the look used by ProfileHeader, MoodEditor, etc.
 */
export function TextInput(
  props: React.InputHTMLAttributes<HTMLInputElement>,
) {
  const { className = "", ...rest } = props;
  return <input {...rest} className={`${INPUT_CLASS} ${className}`} />;
}

/**
 * Pre-styled textarea. Matches the look used by ProfileHeader bio + mood note.
 */
export function TextArea(
  props: React.TextareaHTMLAttributes<HTMLTextAreaElement>,
) {
  const { className = "", ...rest } = props;
  return <textarea {...rest} className={`${INPUT_CLASS} resize-none ${className}`} />;
}
