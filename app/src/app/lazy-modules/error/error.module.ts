import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorPageComponent } from './components/error-page/error-page.component';
import { MaterialModule } from 'src/app/shared-modules/material/material.module';
import { ErrorRoutingModule } from './error-routing.module';

@NgModule({
  declarations: [ErrorPageComponent],
  imports: [CommonModule, MaterialModule, ErrorRoutingModule],
  exports: [ErrorPageComponent],
})
export class ErrorModule {}
