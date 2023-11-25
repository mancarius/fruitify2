import { Observable } from 'rxjs';

export enum MediaType {
  PHOTO = 'photo',
  VIDEO = 'video',
}

export enum MediaSize {
  ORIGINAL = 'original',
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
  alt: string|null,
  avgColor: string|null,
};

export type MediaVideo = Media & {
  picture: string,
  fileType: string,
};

/**
 * Represents the options for media queries.
 */
export interface MediaOptions {
  /** The page number to return. */
  page: number;
  /** The maximum number of results to return. */
  limit: number;
  /** Size of the media. */
  size: MediaSize;
  /** The orientation of the media. */
  orientation: MediaOrientation;
}


/**
 * Represents a media service that provides methods for finding multimedia content.
 */
/**
 * Represents a media finder that can be used to search for photos and videos.
 */
export interface IMediaFinder {
  /**
   * The default query options.
   */
  defaultQueryOptions: MediaOptions;

  /**
   * Finds a photo based on the specified query and options.
   * @param query The search query.
   * @param options The optional query options.
   * @returns An Observable that emits the found photo.
   */
  findPhoto(query: string, options?: Partial<MediaOptions>): Observable<MediaPhoto>;

  /**
   * Finds a video based on the specified query and options.
   * @param query The search query.
   * @param options The optional query options.
   * @returns An Observable that emits the found video.
   */
  findVideo(query: string, options?: Partial<MediaOptions>): Observable<MediaVideo>;
}