import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserRoutingModule } from './user-routing.module';
import { UserPropertiesComponent } from './components/user-properties/user-properties.component';
import { MaterialModule } from 'src/app/shared-modules/material/material.module';
import { DirectivesModule } from 'src/app/shared-modules/directives/directives.module';
import { UserProfilePageComponent } from './components/user-profile-page/user-profile-page.component';
import { FetchersModule } from 'src/app/shared-modules/fetcher/fetchers.module';

@NgModule({
  declarations: [UserPropertiesComponent, UserProfilePageComponent],
  imports: [
    CommonModule,
    UserRoutingModule,
    MaterialModule,
    DirectivesModule,
    FetchersModule,
  ],
})
export class UserModule {}
