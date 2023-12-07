import { Observable } from 'rxjs';
import { Nullable } from '.';

export enum MediaType {
  PHOTO = 'photo'
}

export enum MediaSize {
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large',
}

export enum MediaOrientation {
  LANDSCAPE = 'landscape',
  PORTRAIT = 'portrait',
  SQUARE = 'square',
}

/**
 * Represents the result of a media query.
 */
export type Media = {
  url: string,
};

export type MediaPhoto = Media & {
  alt: Nullable<string>,
  avgColor: Nullable<string>,
};

export type MediaVideo = Media & {
  picture: string,
  fileType: string,
};

/**
 * Represents the options for media queries.
 */
export type MediaOptions = {
  /** The page number to return. */
  page: number;
  /** The number of results per page. */
  per_page: number;
  /** The maximum number of results to return. */
  limit: number;
  /** Size of the media. */
  size: MediaSize;
  /** The orientation of the media. */
  orientation: MediaOrientation;
}



/**
 * Represents a photo finder interface.
 */
export interface PhotoFinder {
  /**
   * Finds a photo based on the specified query and options.
   * @param query The search query.
   * @param options The optional query options.
   * @returns An Observable that emits the found photo.
   */
  findPhoto(query: string, options?: Partial<MediaOptions>): Observable<MediaPhoto>;
}