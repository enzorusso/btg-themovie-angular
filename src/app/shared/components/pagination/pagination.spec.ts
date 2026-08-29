import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedModule } from '../../shared-module';
import { Pagination } from './pagination';

describe('Pagination', () => {
  let fixture: ComponentFixture<Pagination>;
  let component: Pagination;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedModule],
    }).compileComponents();

    fixture = TestBed.createComponent(Pagination);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders nothing when there is only one page', () => {
    component.page = 1;
    component.totalPages = 1;
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('button')).toBeNull();
  });

  it('shows the current page out of the total', () => {
    component.page = 2;
    component.totalPages = 5;
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Página 2 de 5');
  });

  it('emits pageChange with the next page', () => {
    component.page = 2;
    component.totalPages = 5;
    fixture.detectChanges();

    const emitted: number[] = [];
    component.pageChange.subscribe((page) => emitted.push(page));

    component.onNext();
    expect(emitted).toEqual([3]);
  });

  it('emits pageChange with the previous page', () => {
    component.page = 2;
    component.totalPages = 5;
    fixture.detectChanges();

    const emitted: number[] = [];
    component.pageChange.subscribe((page) => emitted.push(page));

    component.onPrevious();
    expect(emitted).toEqual([1]);
  });

  it('does not emit past the boundaries', () => {
    component.page = 1;
    component.totalPages = 5;
    fixture.detectChanges();

    const emitted: number[] = [];
    component.pageChange.subscribe((page) => emitted.push(page));

    component.onPrevious();

    component.page = 5;
    component.onNext();

    expect(emitted).toEqual([]);
  });

  it('disables the previous/next buttons at the boundaries', () => {
    component.page = 1;
    component.totalPages = 3;
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const [previous, next] = Array.from(compiled.querySelectorAll('button'));

    expect(previous.hasAttribute('disabled')).toBe(true);
    expect(next.hasAttribute('disabled')).toBe(false);
  });
});
