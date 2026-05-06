"use client";

import { AvatarPreview, AvatarUploader } from "@/components/AvatarUploader";
import type { Profile } from "@/lib/profile";

type EditableProps = {
  mode: "edit";
  profile: Profile;
  onChange: (next: Profile) => void;
};

type ReadProps = {
  mode: "read";
  profile: Profile;
};

export function ProfileHeader(props: EditableProps | ReadProps) {
  if (props.mode === "read") return <ReadOnlyHeader profile={props.profile} />;
  return <EditableHeader profile={props.profile} onChange={props.onChange} />;
}

function ReadOnlyHeader({ profile }: { profile: Profile }) {
  const name = profile.displayName || "Anonymous";
  return (
    <header className="flex flex-col sm:flex-row items-start gap-6 mb-12">
      <AvatarPreview
        value={profile.avatarDataUrl}
        displayName={name}
        size={112}
      />
      <div className="flex-1 min-w-0">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">{name}</h1>
        <p className="text-[color:var(--color-muted)] text-sm mt-1">
          {profile.username && <span>@{profile.username}</span>}
          {profile.username && profile.location && <span> · </span>}
          {profile.location && <span>{profile.location}</span>}
        </p>
        {profile.bio && <p className="mt-4 text-base leading-relaxed">{profile.bio}</p>}
      </div>
    </header>
  );
}

function EditableHeader({
  profile,
  onChange,
}: {
  profile: Profile;
  onChange: (next: Profile) => void;
}) {
  function update<K extends keyof Profile>(key: K, value: Profile[K]) {
    onChange({ ...profile, [key]: value });
  }

  return (
    <section className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-card)]/40 p-6 mb-8">
      <div className="grid gap-6 md:grid-cols-[auto_1fr]">
        <AvatarUploader
          value={profile.avatarDataUrl}
          displayName={profile.displayName}
          onChange={(v) => update("avatarDataUrl", v)}
        />

        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Display name">
            <input
              type="text"
              value={profile.displayName}
              onChange={(e) => update("displayName", e.target.value)}
              placeholder="Your name"
              className="w-full px-3 py-2 rounded-lg bg-[color:var(--color-background)] border border-[color:var(--color-border)] focus:outline-none focus:border-pink-400/60 placeholder:text-[color:var(--color-muted)]"
            />
          </Field>
          <Field label="Username">
            <div className="flex">
              <span className="px-3 py-2 rounded-l-lg bg-[color:var(--color-background)] border border-r-0 border-[color:var(--color-border)] text-[color:var(--color-muted)]">
                @
              </span>
              <input
                type="text"
                value={profile.username}
                onChange={(e) =>
                  update(
                    "username",
                    e.target.value
                      .toLowerCase()
                      .replace(/[^a-z0-9_]/g, "")
                      .slice(0, 20),
                  )
                }
                placeholder="username"
                className="flex-1 min-w-0 px-3 py-2 rounded-r-lg bg-[color:var(--color-background)] border border-[color:var(--color-border)] focus:outline-none focus:border-pink-400/60 placeholder:text-[color:var(--color-muted)]"
              />
            </div>
          </Field>
          <Field label="Location" wide>
            <input
              type="text"
              value={profile.location}
              onChange={(e) => update("location", e.target.value)}
              placeholder="Where you're based"
              className="w-full px-3 py-2 rounded-lg bg-[color:var(--color-background)] border border-[color:var(--color-border)] focus:outline-none focus:border-pink-400/60 placeholder:text-[color:var(--color-muted)]"
            />
          </Field>
          <Field label="Bio" wide>
            <textarea
              value={profile.bio}
              onChange={(e) => update("bio", e.target.value.slice(0, 240))}
              placeholder="A few words on what you're into."
              rows={2}
              className="w-full px-3 py-2 rounded-lg bg-[color:var(--color-background)] border border-[color:var(--color-border)] focus:outline-none focus:border-pink-400/60 placeholder:text-[color:var(--color-muted)] resize-none"
            />
            <p className="text-xs text-[color:var(--color-muted)] mt-1">
              {240 - profile.bio.length} characters left
            </p>
          </Field>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  children,
  wide,
}: {
  label: string;
  children: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <label className={`block ${wide ? "sm:col-span-2" : ""}`}>
      <span className="text-xs uppercase tracking-wider text-[color:var(--color-muted)] mb-1.5 block">
        {label}
      </span>
      {children}
    </label>
  );
}
