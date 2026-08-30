import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router, Routes } from '@angular/router';
import { App } from './app';

@Component({ template: '', standalone: true })
class DummyComponent {}

const testRoutes: Routes = [
  { path: '', component: DummyComponent },
  { path: 'search', component: DummyComponent },
  { path: 'movie/:id', component: DummyComponent },
];

describe('App', () => {
  let fixture: ComponentFixture<App>;
  let component: App;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter(testRoutes)],
    }).compileComponents();

    fixture = TestBed.createComponent(App);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('starts with an empty search query', () => {
    expect(component.searchQuery()).toBe('');
  });

  it('feeds the search bar with the "title" query param while on the search page', async () => {
    await router.navigateByUrl('/search?title=matrix');

    expect(component.searchQuery()).toBe('matrix');
  });

  it('clears the search query when navigating to the home page', async () => {
    await router.navigateByUrl('/search?title=matrix');
    expect(component.searchQuery()).toBe('matrix');

    await router.navigateByUrl('/');

    expect(component.searchQuery()).toBe('');
  });

  it('keeps the current search query when navigating to a movie details page', async () => {
    await router.navigateByUrl('/search?title=matrix');
    expect(component.searchQuery()).toBe('matrix');

    await router.navigateByUrl('/movie/550');

    expect(component.searchQuery()).toBe('matrix');
  });

  it('links the "Catálogo" logo to the home page', () => {
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const logo = compiled.querySelector('a');

    expect(logo?.getAttribute('href')).toBe('/');
    expect(logo?.textContent).toContain('Catálogo');
  });
});
