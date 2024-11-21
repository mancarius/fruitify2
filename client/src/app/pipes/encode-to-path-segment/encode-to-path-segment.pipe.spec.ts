import { EncodeToPathSegmentPipe } from './encode-to-path-segment.pipe';

describe('EncodeToPathSegmentPipe', () => {
  let pipe: EncodeToPathSegmentPipe;

  beforeEach(() => {
    pipe = new EncodeToPathSegmentPipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should encode a string to be used as a path segment', () => {
    expect(pipe.transform('This is a test')).toBe('this-is-a-test');
  });
});
