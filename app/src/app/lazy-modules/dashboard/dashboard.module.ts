import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/shared-modules/material/material.module';
import { DashboardComponent } from './components/dashboard/dashboard.component';

const routes: Routes = [{ path: '', component: DashboardComponent }];

@NgModule({
  declarations: [DashboardComponent],
  imports: [CommonModule, MaterialModule, RouterModule.forChild(routes)],
})
export class DashboardModule {}
