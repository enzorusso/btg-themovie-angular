import { ViewportScroller } from '@angular/common';
import { restoreScrollPositionWhenReady } from './scroll-restoration';

describe('restoreScrollPositionWhenReady', () => {
  let scrollToPosition: ReturnType<typeof vi.fn>;
  let rafCallbacks: FrameRequestCallback[];
  let viewportScroller: ViewportScroller;

  beforeEach(() => {
    scrollToPosition = vi.fn();
    viewportScroller = { scrollToPosition } as unknown as ViewportScroller;

    rafCallbacks = [];
    vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
      rafCallbacks.push(cb);
      return rafCallbacks.length;
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  function flushFrames(count: number): void {
    for (let i = 0; i < count; i++) {
      const cb = rafCallbacks.shift();
      cb?.(0);
    }
  }

  function stubPageHeight(scrollHeight: number, innerHeight = 800): void {
    Object.defineProperty(document.documentElement, 'scrollHeight', {
      value: scrollHeight,
      configurable: true,
    });
    Object.defineProperty(window, 'innerHeight', { value: innerHeight, configurable: true });
  }

  it('scrolls immediately once the page is already tall enough', () => {
    stubPageHeight(2000); // maxScrollY = 1200

    restoreScrollPositionWhenReady([0, 1000], viewportScroller);
    flushFrames(1);

    expect(scrollToPosition).toHaveBeenCalledWith([0, 1000]);
  });

  it('waits until the page grows tall enough before scrolling', () => {
    stubPageHeight(900); // maxScrollY = 100, not enough for target 1000

    restoreScrollPositionWhenReady([0, 1000], viewportScroller);
    flushFrames(1);
    expect(scrollToPosition).not.toHaveBeenCalled();

    stubPageHeight(2000); // now maxScrollY = 1200, enough
    flushFrames(1);
    expect(scrollToPosition).toHaveBeenCalledWith([0, 1000]);
  });

  it('gives up and scrolls anyway after the max attempts', () => {
    stubPageHeight(900); // never grows tall enough

    restoreScrollPositionWhenReady([0, 1000], viewportScroller, 3);
    flushFrames(3);

    expect(scrollToPosition).toHaveBeenCalledWith([0, 1000]);
  });

  it('does not scroll before the max attempts are exhausted', () => {
    stubPageHeight(900);

    restoreScrollPositionWhenReady([0, 1000], viewportScroller, 3);
    flushFrames(2);

    expect(scrollToPosition).not.toHaveBeenCalled();
  });
});
