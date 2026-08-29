import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared-module';
import { SearchRoutingModule } from './search-routing-module';
import { Search } from './pages/search/search';

@NgModule({
  declarations: [Search],
  imports: [CommonModule, SharedModule, SearchRoutingModule],
})
export class SearchModule {}
