import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { SharedModule } from '../../shared-module';
import { SearchBar } from './search-bar';

describe('SearchBar', () => {
  let fixture: ComponentFixture<SearchBar>;
  let component: SearchBar;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedModule],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchBar);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('navigates to /search with the trimmed query on submit', () => {
    const navigateSpy = vi.spyOn(router, 'navigate');

    component.onSubmit(new Event('submit'), '  matrix  ');

    expect(navigateSpy).toHaveBeenCalledWith(['/search'], {
      queryParams: { title: 'matrix' },
    });
  });

  it('does not navigate when the query is empty', () => {
    const navigateSpy = vi.spyOn(router, 'navigate');

    component.onSubmit(new Event('submit'), '   ');

    expect(navigateSpy).not.toHaveBeenCalled();
  });

  it('submits through the rendered form and navigates with the typed query', () => {
    const navigateSpy = vi.spyOn(router, 'navigate');
    const compiled = fixture.nativeElement as HTMLElement;
    const input = compiled.querySelector('input') as HTMLInputElement;
    const form = compiled.querySelector('form') as HTMLFormElement;

    input.value = 'inception';
    input.dispatchEvent(new Event('input'));
    form.dispatchEvent(new Event('submit', { cancelable: true }));

    expect(navigateSpy).toHaveBeenCalledWith(['/search'], {
      queryParams: { title: 'inception' },
    });
  });

  it('renders a clickable "Buscar" button, separate from the decorative search icon', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const button = compiled.querySelector('button');

    expect(button?.textContent?.trim()).toBe('Buscar');
    expect(button?.getAttribute('type')).toBe('submit');
    expect(button?.querySelector('mat-icon')).toBeNull();
  });

  it('navigates when the "Buscar" button is clicked', () => {
    const navigateSpy = vi.spyOn(router, 'navigate');
    const compiled = fixture.nativeElement as HTMLElement;
    const input = compiled.querySelector('input') as HTMLInputElement;
    const button = compiled.querySelector('button') as HTMLButtonElement;

    input.value = 'dune';
    input.dispatchEvent(new Event('input'));
    button.click();

    expect(navigateSpy).toHaveBeenCalledWith(['/search'], {
      queryParams: { title: 'dune' },
    });
  });
});
