import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  standalone: false,
  templateUrl: './pagination.html',
  styleUrl: './pagination.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Pagination {
  @Input() page = 1;
  @Input() totalPages = 0;
  @Output() readonly pageChange = new EventEmitter<number>();

  onPrevious(): void {
    if (this.page > 1) {
      this.pageChange.emit(this.page - 1);
    }
  }

  onNext(): void {
    if (this.page < this.totalPages) {
      this.pageChange.emit(this.page + 1);
    }
  }
}
