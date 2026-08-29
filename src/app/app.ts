import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { map } from 'rxjs';
import { SharedModule } from './shared/shared-module';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SharedModule],
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  private readonly route = inject(ActivatedRoute);

  readonly searchQuery = toSignal(
    this.route.queryParamMap.pipe(map((params) => params.get('title') ?? '')),
    { initialValue: '' },
  );
}
