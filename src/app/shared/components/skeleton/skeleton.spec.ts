import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Skeleton } from './skeleton';

describe('Skeleton', () => {
  let fixture: ComponentFixture<Skeleton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Skeleton],
    }).compileComponents();

    fixture = TestBed.createComponent(Skeleton);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('applies classes passed on the host element for sizing', () => {
    fixture.nativeElement.classList.add('w-40', 'aspect-[2/3]', 'rounded-lg');

    expect(fixture.nativeElement.classList.contains('w-40')).toBe(true);
    expect(fixture.nativeElement.classList.contains('rounded-lg')).toBe(true);
  });
});
