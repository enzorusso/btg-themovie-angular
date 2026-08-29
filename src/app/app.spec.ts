import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { App } from './app';

describe('App', () => {
  let queryParamMap$: BehaviorSubject<ReturnType<typeof convertToParamMap>>;

  async function setup(params: Record<string, string> = {}) {
    queryParamMap$ = new BehaviorSubject(convertToParamMap(params));

    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideRouter([]),
        { provide: ActivatedRoute, useValue: { queryParamMap: queryParamMap$.asObservable() } },
      ],
    }).compileComponents();
  }

  it('should create the app', async () => {
    await setup();
    const fixture = TestBed.createComponent(App);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('feeds the search bar with the current "title" query param', async () => {
    await setup({ title: 'matrix' });
    const fixture: ComponentFixture<App> = TestBed.createComponent(App);

    expect(fixture.componentInstance.searchQuery()).toBe('matrix');
  });

  it('leaves the search bar empty when there are no query params, e.g. on the home page', async () => {
    await setup();
    const fixture: ComponentFixture<App> = TestBed.createComponent(App);

    expect(fixture.componentInstance.searchQuery()).toBe('');
  });
});
