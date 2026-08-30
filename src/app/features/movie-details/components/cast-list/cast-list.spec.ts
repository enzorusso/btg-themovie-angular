import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CastMember } from '../../../../core/models/credits';
import { MovieDetailsModule } from '../../movie-details-module';
import { CastList } from './cast-list';

describe('CastList', () => {
  let fixture: ComponentFixture<CastList>;
  let component: CastList;

  const castWithPhoto: CastMember = {
    id: 1,
    name: 'Keanu Reeves',
    character: 'Neo',
    profile_path: '/keanu.jpg',
    order: 0,
  };

  const castWithoutPhoto: CastMember = {
    id: 2,
    name: 'Carrie-Anne Moss',
    character: 'Trinity',
    profile_path: null,
    order: 1,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MovieDetailsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(CastList);
    component = fixture.componentInstance;
    component.cast = [castWithPhoto, castWithoutPhoto];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders each cast member name', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Keanu Reeves');
    expect(compiled.textContent).toContain('Carrie-Anne Moss');
  });

  it('renders a photo for a cast member with a profile_path', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const img = compiled.querySelector('img');
    expect(img?.getAttribute('src')).toContain('/keanu.jpg');
    expect(img?.getAttribute('alt')).toBe('Keanu Reeves');
  });

  it('renders a fallback initials avatar for a cast member without a profile_path, independently of the one with a photo', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const images = compiled.querySelectorAll('img');
    const fallbackAvatars = compiled.querySelectorAll('div.bg-gray-700');

    // exactly one member has a photo, one doesn't — each renders its own branch independently
    expect(images.length).toBe(1);
    expect(fallbackAvatars.length).toBe(1);
    expect(fallbackAvatars[0].textContent?.trim()).toBe('CM');
  });
});
