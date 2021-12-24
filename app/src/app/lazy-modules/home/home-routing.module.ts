import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HOME_MODULE_BASE_ROUTE, HOME_ROUTE } from 'src/app/constants/routes';
import { HomePageComponent } from './components/home-page/home-page.component';

const routes: Routes = [
  { path: HOME_MODULE_BASE_ROUTE, component: HomePageComponent },
];

HOME_ROUTE;
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule {}
