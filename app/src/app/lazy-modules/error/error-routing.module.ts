import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ERROR_PAGE_PATH } from 'src/app/constants/routes';
import { ErrorPageComponent } from './components/error-page/error-page.component';

const routes: Routes = [
  { path: ERROR_PAGE_PATH, component: ErrorPageComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ErrorRoutingModule {}
