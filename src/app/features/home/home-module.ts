import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared-module';
import { HomeRoutingModule } from './home-routing-module';
import { BannerCarousel } from './components/banner-carousel/banner-carousel';
import { PopularMoviesCarousel } from './components/popular-movies-carousel/popular-movies-carousel';
import { Home } from './pages/home/home';

@NgModule({
  declarations: [BannerCarousel, PopularMoviesCarousel, Home],
  imports: [CommonModule, SharedModule, HomeRoutingModule],
})
export class HomeModule {}
