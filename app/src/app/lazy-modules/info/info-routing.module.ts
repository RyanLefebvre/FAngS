import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TermsComponent } from './components/terms/terms.component';
import { PrivacyComponent } from './components/privacy/privacy.component';
import { PRIVACY_PATH, TERMS_PATH } from 'src/app/constants/routes';

const routes: Routes = [
  { path: TERMS_PATH, component: TermsComponent },
  { path: PRIVACY_PATH, component: PrivacyComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InfoRoutingModule {}
