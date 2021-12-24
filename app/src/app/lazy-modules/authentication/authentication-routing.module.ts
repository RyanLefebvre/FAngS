import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { VerifyEmailComponent } from './components/verify-email/verify-email.component';
import { OnlyNotLoggedInUsersGuard } from 'src/app/services/route-guards/only-not-logged-in-users-guard.service';
import {
  REGISTER_PATH,
  SIGN_IN_PATH,
  VERIFY_EMAIL_PATH,
} from 'src/app/constants/routes';

const routes: Routes = [
  {
    path: SIGN_IN_PATH,
    component: SignInComponent,
    canActivate: [OnlyNotLoggedInUsersGuard],
  },
  {
    path: REGISTER_PATH,
    component: SignUpComponent,
    canActivate: [OnlyNotLoggedInUsersGuard],
  },
  { path: VERIFY_EMAIL_PATH, component: VerifyEmailComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthenticationRoutingModule {}
