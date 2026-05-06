"use client";

import { AvatarPreview, AvatarUploader } from "@/components/AvatarUploader";
import { Card } from "@/components/ui/Card";
import { Field, TextArea, TextInput } from "@/components/ui/Field";
import {
  ACCENT_PRESETS,
  PROFILE_LIMITS,
  sanitizeUsername,
  type Profile,
} from "@/lib/profile";

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
    <Card tone="soft" padded={false} className="p-6 mb-8">
      <div className="grid gap-6 md:grid-cols-[auto_1fr]">
        <AvatarUploader
          value={profile.avatarDataUrl}
          displayName={profile.displayName}
          onChange={(v) => update("avatarDataUrl", v)}
        />

        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Display name">
            <TextInput
              type="text"
              value={profile.displayName}
              onChange={(e) =>
                update("displayName", e.target.value.slice(0, PROFILE_LIMITS.displayName))
              }
              placeholder="Your name"
              maxLength={PROFILE_LIMITS.displayName}
            />
          </Field>
          <Field label="Username">
            <div className="flex">
              <span className="px-3 py-2 rounded-l-lg bg-[color:var(--color-background)] border border-r-0 border-[color:var(--color-border)] text-[color:var(--color-muted)]">
                @
              </span>
              <TextInput
                type="text"
                value={profile.username}
                onChange={(e) => update("username", sanitizeUsername(e.target.value))}
                placeholder="username"
                maxLength={PROFILE_LIMITS.username}
                className="rounded-l-none"
              />
            </div>
          </Field>
          <Field label="Location" wide>
            <TextInput
              type="text"
              value={profile.location}
              onChange={(e) =>
                update("location", e.target.value.slice(0, PROFILE_LIMITS.location))
              }
              placeholder="Where you're based"
              maxLength={PROFILE_LIMITS.location}
            />
          </Field>
          <Field
            label="Bio"
            wide
            hint={`${PROFILE_LIMITS.bio - profile.bio.length} characters left`}
          >
            <TextArea
              value={profile.bio}
              onChange={(e) => update("bio", e.target.value.slice(0, PROFILE_LIMITS.bio))}
              placeholder="A few words on what you're into."
              rows={2}
              maxLength={PROFILE_LIMITS.bio}
            />
          </Field>
          <Field label="Accent" wide>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => update("accentHex", null)}
                aria-label="Default accent"
                aria-pressed={!profile.accentHex}
                className={`w-7 h-7 rounded-full border-2 transition-colors ${
                  !profile.accentHex
                    ? "border-[color:var(--color-foreground)]"
                    : "border-transparent"
                }`}
                style={{
                  background:
                    "linear-gradient(135deg, #f472b6 0%, #818cf8 100%)",
                }}
              />
              {ACCENT_PRESETS.map((preset) => {
                const active = profile.accentHex === preset.hex;
                return (
                  <button
                    key={preset.hex}
                    type="button"
                    onClick={() => update("accentHex", preset.hex)}
                    aria-label={preset.name}
                    aria-pressed={active}
                    className={`w-7 h-7 rounded-full border-2 transition-colors ${
                      active
                        ? "border-[color:var(--color-foreground)]"
                        : "border-transparent"
                    }`}
                    style={{ background: preset.hex }}
                  />
                );
              })}
            </div>
          </Field>
        </div>
      </div>
    </Card>
  );
}
