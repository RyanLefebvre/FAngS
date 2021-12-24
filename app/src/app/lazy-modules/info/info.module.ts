import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfoRoutingModule } from './info-routing.module';
import { TermsComponent } from './components/terms/terms.component';
import { PrivacyComponent } from './components/privacy/privacy.component';
import { MaterialModule } from 'src/app/shared-modules/material/material.module';
import { TextModule } from 'src/app/shared-modules/text/text.module';

@NgModule({
  declarations: [TermsComponent, PrivacyComponent],
  imports: [CommonModule, InfoRoutingModule, MaterialModule, TextModule],
})
export class InfoModule {}
