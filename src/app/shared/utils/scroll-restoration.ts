import { ViewportScroller } from '@angular/common';

/**
 * Restores scroll to `position` once the page is actually tall enough to
 * reach it. Needed on pages whose content loads asynchronously: Angular's
 * router restores scroll as soon as navigation ends, which can be before the
 * page has grown to its final height, landing short. Polls (capped by
 * `maxAttempts`) instead of guessing a fixed delay.
 */
export function restoreScrollPositionWhenReady(
  position: [number, number],
  viewportScroller: ViewportScroller,
  maxAttempts = 60, // ~1s at 60fps
): void {
  const [, targetY] = position;
  let attempts = 0;

  const tryScroll = (): void => {
    const maxScrollY = document.documentElement.scrollHeight - window.innerHeight;
    attempts++;

    if (maxScrollY >= targetY || attempts >= maxAttempts) {
      viewportScroller.scrollToPosition(position);
      return;
    }

    requestAnimationFrame(tryScroll);
  };

  requestAnimationFrame(tryScroll);
}
