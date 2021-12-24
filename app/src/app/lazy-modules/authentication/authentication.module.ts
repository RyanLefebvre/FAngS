import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthenticationRoutingModule } from './authentication-routing.module';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { VerifyEmailComponent } from './components/verify-email/verify-email.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { MaterialModule } from 'src/app/shared-modules/material/material.module';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [SignUpComponent, VerifyEmailComponent, SignInComponent],
  imports: [
    CommonModule,
    MaterialModule,
    AuthenticationRoutingModule,
    RouterModule,
  ],
  entryComponents: [],
})
export class AuthenticationModule {}
