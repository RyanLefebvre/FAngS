import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FetcherComponent } from './components/fetcher/fetcher.component';
import { ErrorModule } from 'src/app/lazy-modules/error/error.module';
import { MaterialModule } from '../material/material.module';

@NgModule({
  declarations: [FetcherComponent],
  imports: [CommonModule, ErrorModule, MaterialModule],
  exports: [FetcherComponent],
})
export class FetchersModule {}
