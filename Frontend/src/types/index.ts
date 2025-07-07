export interface Item {
  id: number;
  title: string;
  description: string;
  imageUrls?: string[];
  location: string;
  condition: string;
  category: string;
  datePosted: string;
  isReserved: boolean;
  isMyItem: boolean;
}

export interface ItemComment {
  id: number;
  author: string;
  text: string;
  date: string;
}

// Re-export Auth types
export * from "./Auth";
