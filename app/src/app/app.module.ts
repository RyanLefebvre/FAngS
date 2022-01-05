import { DialogsModule } from './shared-modules/dialogs/dialogs.module';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { OnlyLoggedInUsersGuard } from './services/route-guards/only-logged-in-users-guard.service';
import { AuthenticationService } from './services/firebase/authentication.service';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { OnlyNotLoggedInUsersGuard } from './services/route-guards/only-not-logged-in-users-guard.service';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { NavBarComponent } from './app-level-components/navbar/navbar.component';
import { FooterComponent } from './app-level-components/footer/footer.component';
import { DirectivesModule } from './shared-modules/directives/directives.module';
import { MaterialModule } from './shared-modules/material/material.module';
import { AngularFireFunctionsModule } from '@angular/fire/compat/functions';
import { environment } from '../environments/environment';
import {
  AUTHENTICATION_MODULE_BASE_ROUTE,
  DASHBOARD_MODULE_BASE_ROUTE,
  ERROR_MODULE_BASE_ROUTE,
  HOME_MODULE_BASE_ROUTE,
  INFO_MODULE_BASE_ROUTE,
  USER_MODULE_BASE_ROUTE,
} from './constants/routes';

/**
 * Top level of the applications routing hierarchy. Controls permissions to certain routes.
 */
const routes = [
  {
    path: HOME_MODULE_BASE_ROUTE,
    loadChildren: () =>
      import('./lazy-modules/home/home.module').then((m) => m.HomeModule),
  },
  {
    path: AUTHENTICATION_MODULE_BASE_ROUTE,
    loadChildren: () =>
      import('./lazy-modules/authentication/authentication.module').then(
        (m) => m.AuthenticationModule
      ),
  },
  {
    path: DASHBOARD_MODULE_BASE_ROUTE,
    canActivate: [OnlyLoggedInUsersGuard],
    loadChildren: () =>
      import('./lazy-modules/dashboard/dashboard.module').then(
        (m) => m.DashboardModule
      ),
  },
  {
    path: USER_MODULE_BASE_ROUTE,
    canActivate: [OnlyLoggedInUsersGuard],
    loadChildren: () =>
      import('./lazy-modules/user/user.module').then((m) => m.UserModule),
  },
  {
    path: INFO_MODULE_BASE_ROUTE,
    loadChildren: () =>
      import('./lazy-modules/info/info.module').then((m) => m.InfoModule),
  },
  {
    path: ERROR_MODULE_BASE_ROUTE,
    loadChildren: () =>
      import('./lazy-modules/error/error.module').then((m) => m.ErrorModule),
  },
  {
    path: '**',
    redirectTo: ERROR_MODULE_BASE_ROUTE,
    pathMatch: 'full',
  },
];

@NgModule({
  declarations: [AppComponent, NavBarComponent, FooterComponent],
  imports: [
    RouterModule.forRoot(routes, {
      useHash: true,
      onSameUrlNavigation: 'reload',
      scrollPositionRestoration: 'top',
    }),
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule.enablePersistence(),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireFunctionsModule,
    AngularFireStorageModule,
    MaterialModule,
    DirectivesModule,
    BrowserModule,
    BrowserAnimationsModule,
    DialogsModule,
  ],
  providers: [
    OnlyNotLoggedInUsersGuard,
    OnlyLoggedInUsersGuard,
    AuthenticationService,
  ],
  bootstrap: [AppComponent],
  entryComponents: [],
})
export class AppModule {}
