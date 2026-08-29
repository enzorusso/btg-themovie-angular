import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared-module';
import { HomeRoutingModule } from './home-routing-module';
import { BannerCarousel } from './components/banner-carousel/banner-carousel';
import { MoviesCarousel } from './components/movies-carousel/movies-carousel';
import { Home } from './pages/home/home';

@NgModule({
  declarations: [BannerCarousel, MoviesCarousel, Home],
  imports: [CommonModule, SharedModule, HomeRoutingModule],
})
export class HomeModule {}
