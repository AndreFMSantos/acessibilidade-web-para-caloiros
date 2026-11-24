export interface Game {
  id: string;
  title: string;
  platform: string;
  genre: string;
  price: number;
  image: string;
  description: string;
  edition: string;
}
export interface CartItem { id: string; gameId: string }

