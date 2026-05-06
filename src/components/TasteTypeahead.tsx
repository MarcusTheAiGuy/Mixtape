"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { SearchKind, SearchResult } from "@/lib/music-search";
import { searchMusic } from "@/lib/music-search";

type Props = {
  kind: SearchKind;
  placeholder?: string;
  value: SearchResult | null;
  onSelect: (result: SearchResult) => void;
  onClear?: () => void;
};

export function TasteTypeahead({ kind, placeholder, value, onSelect, onClear }: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const listboxId = useId();

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    // Debounced search — these setStates drive the typeahead loading/results UI.
    if (!query || query.length < 2) {
      setResults([]);
      return;
    }
    const ctrl = new AbortController();
    setLoading(true);
    const t = setTimeout(async () => {
      const r = await searchMusic(query, kind, ctrl.signal);
      setResults(r);
      setLoading(false);
    }, 250);
    return () => {
      clearTimeout(t);
      ctrl.abort();
      setLoading(false);
    };
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [query, kind]);

  if (value) {
    return (
      <div className="flex items-center gap-3 p-3 rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-card)]/60">
        <Thumb result={value} />
        <div className="flex-1 min-w-0">
          <p className="font-medium truncate">{value.name}</p>
          {value.subtitle && (
            <p className="text-sm text-[color:var(--color-muted)] truncate">
              {kind === "song" || kind === "album" ? `By ${value.subtitle}` : value.subtitle}
            </p>
          )}
        </div>
        {onClear && (
          <button
            type="button"
            onClick={onClear}
            aria-label="Remove selection"
            className="text-[color:var(--color-muted)] hover:text-[color:var(--color-foreground)] text-xl leading-none px-1"
          >
            ×
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        role="combobox"
        aria-expanded={open}
        aria-controls={listboxId}
        autoComplete="off"
        spellCheck={false}
        value={query}
        placeholder={placeholder ?? `Search a ${kind}…`}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        className="w-full px-4 py-3 rounded-xl bg-[color:var(--color-card)]/60 border border-[color:var(--color-border)] focus:outline-none focus:border-pink-400/60 placeholder:text-[color:var(--color-muted)]"
      />
      {open && query.length >= 2 && (
        <ul
          id={listboxId}
          role="listbox"
          className="absolute z-20 mt-2 w-full max-h-96 overflow-auto rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-card)] shadow-xl"
        >
          {loading && results.length === 0 && (
            <li className="px-4 py-3 text-sm text-[color:var(--color-muted)]">Searching…</li>
          )}
          {!loading && results.length === 0 && (
            <li className="px-4 py-3 text-sm text-[color:var(--color-muted)]">
              No results. Keep typing or try a different spelling.
            </li>
          )}
          {results.map((r) => (
            <li key={r.id}>
              <button
                type="button"
                role="option"
                aria-selected={false}
                onClick={() => {
                  onSelect(r);
                  setQuery("");
                  setResults([]);
                  setOpen(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-2 hover:bg-white/5 text-left"
              >
                <Thumb result={r} />
                <div className="flex-1 min-w-0">
                  <p className="truncate">{r.name}</p>
                  {r.subtitle && (
                    <p className="text-xs text-[color:var(--color-muted)] truncate">
                      {kind === "song" || kind === "album" ? `By ${r.subtitle}` : r.subtitle}
                    </p>
                  )}
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Thumb({ result }: { result: SearchResult }) {
  const initial = result.name.charAt(0).toUpperCase();
  const round = result.kind === "artist" ? "rounded-full" : "rounded-md";

  if (!result.imageUrl) {
    return (
      <div
        className={`shrink-0 w-10 h-10 ${round} bg-gradient-to-br from-pink-400/40 to-indigo-400/40 flex items-center justify-center text-sm font-semibold`}
        aria-hidden
      >
        {initial}
      </div>
    );
  }

  return (
    // MusicBrainz cover art redirects to archive.org subdomains we can't enumerate,
    // so plain <img> is simpler than next/image here.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={result.imageUrl}
      alt=""
      width={40}
      height={40}
      className={`shrink-0 w-10 h-10 ${round} object-cover bg-[color:var(--color-border)]`}
      onError={(e) => {
        e.currentTarget.style.visibility = "hidden";
      }}
    />
  );
}
