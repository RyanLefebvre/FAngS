import { NgModule } from '@angular/core';
import { MaterialModule } from '../material/material.module';
import { CommonModule } from '@angular/common';
import { TextModule } from '../text/text.module';
import { WaitForOperationDialog } from './components/wait-for-operation-dialog/wait-for-operation-dialog.component';
import { ReauthenticateDialogComponent } from './components/reauthenticate-dialog/reauthenticate-dialog.component';
import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component';
import { ResetPasswordComponent } from './components/reset-password-dialog/reset-password.component';
import { DialogWrapperComponent } from './components/dialog-wrapper/dialog-wrapper.component';
import { TermsDialogComponent } from './components/terms-dialog/terms-dialog.component';

@NgModule({
  declarations: [
    WaitForOperationDialog,
    ReauthenticateDialogComponent,
    ConfirmationDialogComponent,
    ResetPasswordComponent,
    DialogWrapperComponent,
    TermsDialogComponent,
  ],
  imports: [CommonModule, MaterialModule, TextModule],
  exports: [
    WaitForOperationDialog,
    ReauthenticateDialogComponent,
    ConfirmationDialogComponent,
    ResetPasswordComponent,
    DialogWrapperComponent,
  ],
  entryComponents: [
    WaitForOperationDialog,
    ReauthenticateDialogComponent,
    ConfirmationDialogComponent,
    ResetPasswordComponent,
    DialogWrapperComponent,
    TermsDialogComponent,
  ],
})
export class DialogsModule {}
