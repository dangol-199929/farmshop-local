export interface IBlogItem {
  id: number;
  title: string;
  createdBy: string;
  content: string;
  image: string | null;
  createdAt: string;
  slug: string;
  status: string;
  tags: string | null;
}

export interface IBlog {
  data: IBlogContent[];
}

export interface IBlogContent {
  content: string;
  createdAt: string;
  createdBy: string;
  id: number;
  image: string;
  imageAltText: null;
  slug: string;
  status: true;
  thumbnail: string;
  thumbnailAltText: null;
  title: string;
  type: string;
}
