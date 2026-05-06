import type { Profile } from "@/lib/profile";
import type { TasteEntry } from "@/lib/taste";

export type SampleUser = {
  profile: Profile;
  taste: TasteEntry[];
};

// A handful of fictional people so /discover and /u/[username] have life
// before any real users sign up. Replace with prisma.user.findMany() once
// the DB is wired in.
export const SAMPLE_USERS: SampleUser[] = [
  {
    profile: {
      displayName: "Marcus",
      username: "marcus",
      bio: "Always chasing the next gig. Big into shoegaze right now.",
      location: "London",
      avatarDataUrl: null,
      accentHex: "#f472b6",
    },
    taste: [
      { category: "ALBUM", position: 1, name: "Loveless", subtitle: "My Bloody Valentine" },
      { category: "ALBUM", position: 2, name: "In Rainbows", subtitle: "Radiohead" },
      { category: "ALBUM", position: 3, name: "Dragon New Warm Mountain", subtitle: "Big Thief" },
      { category: "ARTIST", position: 1, name: "Big Thief" },
      { category: "ARTIST", position: 2, name: "Caroline Polachek" },
      { category: "ARTIST", position: 3, name: "Slowdive" },
      { category: "GENRE", position: 1, name: "Shoegaze" },
      { category: "GENRE", position: 2, name: "Indie folk" },
      { category: "GENRE", position: 3, name: "Dream pop" },
      { category: "SONG", position: 1, name: "Not", subtitle: "Big Thief" },
      { category: "SONG", position: 2, name: "Sometimes", subtitle: "My Bloody Valentine" },
      { category: "LIVE_SHOW", position: 1, name: "Big Thief", subtitle: "Roundhouse · 2023" },
      { category: "LIVE_SHOW", position: 2, name: "Slowdive", subtitle: "Brixton Academy · 2024" },
    ],
  },
  {
    profile: {
      displayName: "Alex",
      username: "alex",
      bio: "Folk singer. Loves a quiet room and a loud chorus.",
      location: "Brighton",
      avatarDataUrl: null,
      accentHex: "#84cc16",
    },
    taste: [
      { category: "ALBUM", position: 1, name: "For Emma, Forever Ago", subtitle: "Bon Iver" },
      { category: "ALBUM", position: 2, name: "Two Hands", subtitle: "Big Thief" },
      { category: "ALBUM", position: 3, name: "Carrie & Lowell", subtitle: "Sufjan Stevens" },
      { category: "ARTIST", position: 1, name: "Big Thief" },
      { category: "ARTIST", position: 2, name: "Bon Iver" },
      { category: "ARTIST", position: 3, name: "Phoebe Bridgers" },
      { category: "GENRE", position: 1, name: "Indie folk" },
      { category: "GENRE", position: 2, name: "Folk" },
      { category: "GENRE", position: 3, name: "Singer-songwriter" },
      { category: "SONG", position: 1, name: "Skinny Love", subtitle: "Bon Iver" },
      { category: "LIVE_SHOW", position: 1, name: "Big Thief", subtitle: "Eventim Apollo · 2022" },
    ],
  },
  {
    profile: {
      displayName: "Jamie",
      username: "jamie",
      bio: "House heads, after-hours, sun-up endings.",
      location: "Berlin",
      avatarDataUrl: null,
      accentHex: "#06b6d4",
    },
    taste: [
      { category: "ARTIST", position: 1, name: "Floating Points" },
      { category: "ARTIST", position: 2, name: "Caribou" },
      { category: "ARTIST", position: 3, name: "Four Tet" },
      { category: "GENRE", position: 1, name: "House" },
      { category: "GENRE", position: 2, name: "Electronic" },
      { category: "GENRE", position: 3, name: "Techno" },
      { category: "ALBUM", position: 1, name: "Promises", subtitle: "Floating Points" },
      { category: "SONG", position: 1, name: "Suddenly", subtitle: "Caribou" },
      { category: "LIVE_SHOW", position: 1, name: "Floating Points", subtitle: "Printworks · 2023" },
    ],
  },
  {
    profile: {
      displayName: "Riley",
      username: "riley",
      bio: "Soul + jazz, smoky rooms, late-night radio.",
      location: "Manchester",
      avatarDataUrl: null,
      accentHex: "#a855f7",
    },
    taste: [
      { category: "ARTIST", position: 1, name: "Erykah Badu" },
      { category: "ARTIST", position: 2, name: "D'Angelo" },
      { category: "ARTIST", position: 3, name: "Solange" },
      { category: "GENRE", position: 1, name: "Neo-soul" },
      { category: "GENRE", position: 2, name: "Soul" },
      { category: "GENRE", position: 3, name: "Jazz" },
      { category: "ALBUM", position: 1, name: "Voodoo", subtitle: "D'Angelo" },
      { category: "ALBUM", position: 2, name: "A Seat at the Table", subtitle: "Solange" },
      { category: "SONG", position: 1, name: "Untitled (How Does It Feel)", subtitle: "D'Angelo" },
    ],
  },
  {
    profile: {
      displayName: "Sam",
      username: "sam",
      bio: "Punk shows, zines, basements with bad PA.",
      location: "Leeds",
      avatarDataUrl: null,
      accentHex: "#ef4444",
    },
    taste: [
      { category: "ARTIST", position: 1, name: "IDLES" },
      { category: "ARTIST", position: 2, name: "Fontaines D.C." },
      { category: "ARTIST", position: 3, name: "Sleaford Mods" },
      { category: "GENRE", position: 1, name: "Post-punk" },
      { category: "GENRE", position: 2, name: "Punk" },
      { category: "GENRE", position: 3, name: "Indie rock" },
      { category: "ALBUM", position: 1, name: "Joy as an Act of Resistance", subtitle: "IDLES" },
      { category: "LIVE_SHOW", position: 1, name: "IDLES", subtitle: "Brudenell · 2024" },
    ],
  },
  {
    profile: {
      displayName: "Noor",
      username: "noor",
      bio: "Pop maximalist. Hooks > everything.",
      location: "Glasgow",
      avatarDataUrl: null,
      accentHex: "#f59e0b",
    },
    taste: [
      { category: "ARTIST", position: 1, name: "Charli XCX" },
      { category: "ARTIST", position: 2, name: "Caroline Polachek" },
      { category: "ARTIST", position: 3, name: "FKA twigs" },
      { category: "GENRE", position: 1, name: "Pop" },
      { category: "GENRE", position: 2, name: "Synth-pop" },
      { category: "GENRE", position: 3, name: "Dream pop" },
      { category: "ALBUM", position: 1, name: "Brat", subtitle: "Charli XCX" },
      { category: "ALBUM", position: 2, name: "Desire, I Want to Turn Into You", subtitle: "Caroline Polachek" },
      { category: "SONG", position: 1, name: "360", subtitle: "Charli XCX" },
    ],
  },
];

export const SAMPLE_USERS_BY_USERNAME: Record<string, SampleUser> = Object.fromEntries(
  SAMPLE_USERS.map((u) => [u.profile.username.toLowerCase(), u]),
);
