import { ViewportScroller } from '@angular/common';

export function restoreScrollPositionWhenReady(
  position: [number, number],
  viewportScroller: ViewportScroller,
  maxAttempts = 60,
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
