import { Service } from '@angular/core';

/**
 * Remembers each carousel's horizontal scroll position (keyed by an id the
 * caller controls, e.g. a section title) across navigations. In-memory only —
 * resets on a full page reload, which is fine: that's a fresh visit anyway.
 */
@Service()
export class CarouselScrollMemory {
  private readonly positions = new Map<string, number>();

  save(id: string, scrollLeft: number): void {
    this.positions.set(id, scrollLeft);
  }

  get(id: string): number | undefined {
    return this.positions.get(id);
  }
}
