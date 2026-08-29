import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CastMember } from '../../../../core/models/credits';

@Component({
  selector: 'app-cast-list',
  standalone: false,
  templateUrl: './cast-list.html',
  styleUrl: './cast-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CastList {
  @Input() cast: CastMember[] = [];

  getInitials(name: string): string {
    return name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((word) => word[0])
      .join('')
      .toUpperCase();
  }
}
