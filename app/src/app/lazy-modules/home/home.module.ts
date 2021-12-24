import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomePageComponent } from './components/home-page/home-page.component';
import { MaterialModule } from 'src/app/shared-modules/material/material.module';
import { HomeRoutingModule } from './home-routing.module';

@NgModule({
  declarations: [HomePageComponent],
  imports: [CommonModule, MaterialModule, HomeRoutingModule],
})
export class HomeModule {}
