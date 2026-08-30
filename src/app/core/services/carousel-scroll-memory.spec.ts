import { TestBed } from '@angular/core/testing';
import { CarouselScrollMemory } from './carousel-scroll-memory';

describe('CarouselScrollMemory', () => {
  let service: CarouselScrollMemory;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CarouselScrollMemory);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('returns undefined for an id that was never saved', () => {
    expect(service.get('populares')).toBeUndefined();
  });

  it('returns the last saved position for an id', () => {
    service.save('populares', 320);
    expect(service.get('populares')).toBe(320);

    service.save('populares', 480);
    expect(service.get('populares')).toBe(480);
  });

  it('keeps positions for different ids independent', () => {
    service.save('populares', 320);
    service.save('acao', 640);

    expect(service.get('populares')).toBe(320);
    expect(service.get('acao')).toBe(640);
  });

  it('forgets every saved position after clear()', () => {
    service.save('populares', 320);
    service.save('acao', 640);

    service.clear();

    expect(service.get('populares')).toBeUndefined();
    expect(service.get('acao')).toBeUndefined();
  });
});
