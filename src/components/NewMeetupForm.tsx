"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import { Field, TextArea, TextInput } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";

const LIMITS = {
  title: 80,
  venue: 120,
  city: 80,
  description: 500,
  filter: 40,
};
const MAX_FILTERS = 8;

const DRAFT_KEY = "mixtape:meetup:draft";

type Draft = {
  title: string;
  venue: string;
  city: string;
  when: string;
  description: string;
  tasteFilters: string[];
};

const EMPTY: Draft = {
  title: "",
  venue: "",
  city: "",
  when: "",
  description: "",
  tasteFilters: [],
};

export function NewMeetupForm() {
  const router = useRouter();
  const [draft, setDraft] = useState<Draft>(EMPTY);
  const [filterInput, setFilterInput] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function set<K extends keyof Draft>(key: K, value: Draft[K]) {
    setDraft({ ...draft, [key]: value });
  }

  function addFilter() {
    const tag = filterInput.trim().slice(0, LIMITS.filter);
    if (!tag) return;
    if (draft.tasteFilters.includes(tag)) {
      setFilterInput("");
      return;
    }
    if (draft.tasteFilters.length >= MAX_FILTERS) return;
    set("tasteFilters", [...draft.tasteFilters, tag]);
    setFilterInput("");
  }

  function removeFilter(tag: string) {
    set(
      "tasteFilters",
      draft.tasteFilters.filter((t) => t !== tag),
    );
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!draft.title.trim() || !draft.venue.trim() || !draft.city.trim()) return;
    // Persist a draft in localStorage so the user can see what they typed
    // while we don't have a real backend wired up yet. The success view links
    // back to the listing.
    try {
      window.localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    } catch {
      // ignore quota errors
    }
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <Card tone="soft">
        <h2 className="text-xl font-semibold mb-2">Saved as a draft</h2>
        <p className="text-[color:var(--color-muted)] mb-6">
          Real meetup hosting needs sign-in + the database, which aren&apos;t
          live yet. Your draft is safe in this browser for now — flip on auth
          and we&apos;ll publish it to everyone.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button variant="secondary" onClick={() => router.push("/meetups")}>
            Back to meetups
          </Button>
          <Button
            onClick={() => {
              setDraft(EMPTY);
              setSubmitted(false);
            }}
          >
            Start another
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <Field label="Title">
        <TextInput
          required
          maxLength={LIMITS.title}
          value={draft.title}
          onChange={(e) => set("title", e.target.value.slice(0, LIMITS.title))}
          placeholder="Listening party for the new album"
        />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Venue">
          <TextInput
            required
            maxLength={LIMITS.venue}
            value={draft.venue}
            onChange={(e) => set("venue", e.target.value.slice(0, LIMITS.venue))}
            placeholder="The Lock Tavern"
          />
        </Field>
        <Field label="City">
          <TextInput
            required
            maxLength={LIMITS.city}
            value={draft.city}
            onChange={(e) => set("city", e.target.value.slice(0, LIMITS.city))}
            placeholder="London"
          />
        </Field>
      </div>

      <Field label="When" hint="A friendly date string for now (we'll add a picker once auth is wired up).">
        <TextInput
          value={draft.when}
          onChange={(e) => set("when", e.target.value.slice(0, 80))}
          placeholder="Fri, May 9 · 8pm"
        />
      </Field>

      <Field
        label="Description"
        hint={`${LIMITS.description - draft.description.length} characters left`}
      >
        <TextArea
          rows={3}
          maxLength={LIMITS.description}
          value={draft.description}
          onChange={(e) => set("description", e.target.value.slice(0, LIMITS.description))}
          placeholder="What's the vibe? Who is this for?"
        />
      </Field>

      <Field
        label="Taste filters"
        hint={`Up to ${MAX_FILTERS} tags. ${draft.tasteFilters.length}/${MAX_FILTERS} used.`}
      >
        <div className="flex gap-2">
          <TextInput
            value={filterInput}
            onChange={(e) => setFilterInput(e.target.value.slice(0, LIMITS.filter))}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addFilter();
              }
            }}
            placeholder="shoegaze, Big Thief, ..."
          />
          <Button
            type="button"
            variant="secondary"
            onClick={addFilter}
            disabled={!filterInput.trim() || draft.tasteFilters.length >= MAX_FILTERS}
          >
            Add
          </Button>
        </div>
        {draft.tasteFilters.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {draft.tasteFilters.map((tag) => (
              <button
                type="button"
                key={tag}
                onClick={() => removeFilter(tag)}
                aria-label={`Remove ${tag}`}
                className="group"
              >
                <Chip tone="outline" className="group-hover:bg-white/5 cursor-pointer">
                  {tag}
                  <span className="ml-1 text-[color:var(--color-muted)] group-hover:text-[color:var(--color-foreground)]">
                    ×
                  </span>
                </Chip>
              </button>
            ))}
          </div>
        )}
      </Field>

      <div className="pt-4 flex justify-end gap-3">
        <Button type="button" variant="secondary" onClick={() => router.push("/meetups")}>
          Cancel
        </Button>
        <Button type="submit">Publish</Button>
      </div>
    </form>
  );
}
