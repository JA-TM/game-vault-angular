export interface RawgGameListItem {
  id: number;
  name: string;
  released: string | null;
  background_image: string | null;
  metacritic: number | null;
  rating: number;
  playtime: number;
  platforms?: { platform: { name: string } }[];
  genres?: { name: string }[];
  developers?: { name: string }[];
  stores?: { store: { name: string }; url: string }[];
}

export interface RawgGameDetail extends RawgGameListItem {
  movies?: { data: { max: string } }[];
  clip?: { clip: string } | null;
}

export interface RawgReview {
  id: number;
  text: string;
  rating: number;
  username: string;
  created: string;
}

export interface RawgSearchResponse {
  results: RawgGameListItem[];
}

export interface RawgReviewsResponse {
  results: RawgReview[];
}
