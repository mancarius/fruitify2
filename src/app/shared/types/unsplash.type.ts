export namespace Unsplash {
  export type Photo = {
    id: string;
    description: string;
    urls: {
      raw: string;
      full: string;
      regular: string;
      small: string;
      thumb: string;
    };
    color: string;
  };

  export type Photos = {
    total: number;
    total_pages: number;
    results: Photo[];
  };
}