export const BRAND = {
  name: "CineVerse",
  tagline: "Discover what to watch, worldwide.",
  description:
    "CineVerse is a global movie and television discovery platform. Find titles from every country, see where they are legitimately available, and get honest, rule-based recommendations.",
} as const;

export const NAV_PRIMARY = [
  { href: "/", label: "Home" },
  { href: "/movies", label: "Movies" },
  { href: "/tv", label: "TV Shows" },
  { href: "/anime", label: "Anime" },
  { href: "/discover", label: "Discover" },
] as const;

export const NAV_MORE = [
  { href: "/countries", label: "Countries" },
  { href: "/genres", label: "Genres" },
  { href: "/languages", label: "Languages" },
  { href: "/providers", label: "Networks and Services" },
  { href: "/networks", label: "TV Networks" },
  { href: "/trending", label: "Trending" },
  { href: "/latest", label: "Latest" },
  { href: "/upcoming", label: "Upcoming" },
  { href: "/top-rated", label: "Top rated" },
] as const;

export const FEATURED_PROVIDERS = [
  { id: 8, name: "Netflix", slug: "netflix" },
  { id: 9, name: "Prime Video", slug: "prime-video" },
  { id: 350, name: "Apple TV+", slug: "apple-tv-plus" },
  { id: 337, name: "Disney+", slug: "disney-plus" },
  { id: 1899, name: "Max", slug: "max" },
  { id: 384, name: "HBO Max", slug: "hbo-max" },
  { id: 15, name: "Hulu", slug: "hulu" },
  { id: 531, name: "Paramount+", slug: "paramount-plus" },
  { id: 386, name: "Peacock", slug: "peacock" },
  { id: 283, name: "Crunchyroll", slug: "crunchyroll" },
  { id: 192, name: "YouTube", slug: "youtube" },
  { id: 3, name: "Google Play Movies", slug: "google-play" },
  { id: 11, name: "MUBI", slug: "mubi" },
  { id: 99, name: "Shudder", slug: "shudder" },
  { id: 151, name: "BritBox", slug: "britbox" },
  { id: 35, name: "Rakuten TV", slug: "rakuten-tv" },
  { id: 122, name: "Hotstar", slug: "hotstar" },
  { id: 232, name: "ZEE5", slug: "zee5" },
  { id: 237, name: "SonyLIV", slug: "sonyliv" },
  { id: 315, name: "Hoichoi", slug: "hoichoi" },
  { id: 309, name: "Sun NXT", slug: "sun-nxt" },
] as const;

export const ANIME_KEYWORD = "210024";

export const SORT_OPTIONS = [
  { value: "popularity.desc", label: "Popularity" },
  { value: "vote_average.desc", label: "Rating" },
  { value: "primary_release_date.desc", label: "Newest (movies)" },
  { value: "first_air_date.desc", label: "Newest (TV)" },
  { value: "revenue.desc", label: "Box office" },
] as const;

export const MONETIZATION = [
  { value: "flatrate", label: "Subscription" },
  { value: "free", label: "Free" },
  { value: "ads", label: "Free with ads" },
  { value: "rent", label: "Rent" },
  { value: "buy", label: "Buy" },
] as const;

export const INDIAN_LANGUAGES = [
  { code: "hi", label: "Hindi" },
  { code: "ta", label: "Tamil" },
  { code: "te", label: "Telugu" },
  { code: "ml", label: "Malayalam" },
  { code: "kn", label: "Kannada" },
  { code: "bn", label: "Bengali" },
  { code: "mr", label: "Marathi" },
] as const;
