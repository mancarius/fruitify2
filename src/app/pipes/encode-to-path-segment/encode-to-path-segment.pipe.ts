import { Pipe, PipeTransform } from '@angular/core';

/**
 * Encodes a string to be used as a path segment
 */
@Pipe({
  name: 'encodeToPathSegment',
  standalone: true
})
export class EncodeToPathSegmentPipe implements PipeTransform {

  transform(value: string): string {

    if (!value) {
      return '';
    }

    return encodeURIComponent(value.toLocaleLowerCase())
      .replace(/%20/g, '-');
  }

}
