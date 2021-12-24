import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { WaitForOperationDialog } from '../components/wait-for-operation-dialog/wait-for-operation-dialog.component';
import { UserProfile } from '../../../../../../shared/classes/user-profile';
import { ReauthenticateDialogComponent } from '../components/reauthenticate-dialog/reauthenticate-dialog.component';
import { ConfirmationDialogComponent } from '../components/confirmation-dialog/confirmation-dialog.component';
import { ResetPasswordComponent } from '../components/reset-password-dialog/reset-password.component';
import { UserService } from 'src/app/services/firebase/user.service';
import { ApiResponse } from '../../../../../../shared/classes/api-response';
import { TermsDialogComponent } from '../components/terms-dialog/terms-dialog.component';
import { TextService } from 'src/app/services/constants/text.service';
import { AuthenticationService } from 'src/app/services/firebase/authentication.service';

/**
 * This service is responsible for opening any dialogs in the web application. If there
 * is any logic that needs to be performed when the dialog is closing, it should be done
 * in the component for the dialog. The only logic besides opening dialogs that should
 * be implemented in this service should be logic that absolutely
 * needs to happen in the 'onClose' callback of the dialog.
 *
 * Last edited by: Matt Lefebvre 3/9/2020
 */
@Injectable({
  providedIn: 'root',
})
export class DialogCreatorService {
  /**
   * @ignore
   */
  constructor(
    public dialog: MatDialog,
    public userService: UserService,
    public textService: TextService,
    public authService: AuthenticationService
  ) {}

  /**
   * Default options used to create a dialog, sets basic constraints on the
   * width and height so that the dialog appears normal and is responsive.
   */
  getDefaultDialogOptions(): Record<string, unknown> {
    const NO_DATA = null;
    return this.getDialogDataOptions(NO_DATA);
  }

  /**
   * Returns default options but adds data to the options. The data param of the
   * options is used within dialogs to access data that is passed in from functions
   * that open them. If data is null, it is replaced with an empty object.
   *
   * @param data Data to be passed into dialog through options.
   */
  getDialogDataOptions(
    data: Record<string, unknown>,
    fullBleed?: boolean
  ): Record<string, unknown> {
    const dataIsEmpty = !data;
    if (dataIsEmpty) {
      data = {};
    }
    const options = {
      width: '95%',
      maxWidth: '575px',
      minWidth: '290px',
      maxHeight: '550px',
      data: data,
    };
    if (fullBleed) {
      options['panelClass'] = 'app-full-bleed-dialog';
    }
    return options;
  }

  /**
   * This function returns a promise that resolves to the value of
   * what ever the returned promise from the logic function resolves to.
   */
  openWaitForOperationDialog<T>(
    logic: Function,
    operationName: string,
    matIcon: string,
    spinnerMessage: string
  ): Promise<T> {
    return new Promise<T>((resolve) => {
      const dialogRef: MatDialogRef<
        WaitForOperationDialog,
        Record<string, unknown>
      > = this.dialog.open(
        WaitForOperationDialog,
        this.getDialogDataOptions({
          logic: logic,
          operationName: operationName,
          matIcon: matIcon,
          spinnerMessage: spinnerMessage,
        })
      );
      dialogRef.afterClosed().subscribe((response) => {
        resolve(response as T);
      });
    });
  }

  /**
   * Opens a password reset dialog prompting the user to reset their password
   * if the dialog confirms the users wishes to rest then a reset email is sent to
   * the email passed as a param. It is assumed that the email passed in is a valid
   * email for a fangs user.
   *
   * @param email Email address to send the password reset to.
   */
  openPasswordResetDialog(email: string): void {
    const passwordResetData = { email: email };
    const passwordResetOptions = this.getDialogDataOptions(passwordResetData);
    this.dialog.open(ResetPasswordComponent, passwordResetOptions);
  }

  /**
   * This function returns a boolean promise that on complete will be true
   * if the user successfully reauthenticated and will be false if they
   * failed to authenticate.
   */
  openReauthDialog(operationMessage: string): Promise<boolean> {
    const context = this;
    const AUTH_FAILURE = false;
    const AUTH_SUCCESS = true;
    const authData = { operationMessage: operationMessage };
    return new Promise<boolean>((resolve) => {
      try {
        const dialogRef = context.dialog.open(
          ReauthenticateDialogComponent,
          this.getDialogDataOptions(authData)
        );
        dialogRef.afterClosed().subscribe((userSuccessfullyReauthenticated) => {
          if (userSuccessfullyReauthenticated) {
            resolve(AUTH_SUCCESS);
          } else {
            resolve(AUTH_FAILURE);
          }
        });
      } catch (error) {
        resolve(AUTH_FAILURE);
      }
    });
  }

  /**
   * Opens a dialog prompting the user if they truly want to perform an action or not.
   * This is used for sensitive operations like deletion. As a parameter the dialog
   * takes a title a message to display as a prompt for the action, some logic to perform
   * if the action is confirmed and a spinner message for the confirmed action.
   */
  openConfirmationDialog(
    title: string,
    messageToDisplay: string,
    logic: Function,
    spinMsg: string,
    onClose?: Function
  ): void {
    const confirmationDialogData = {
      title: title,
      message: messageToDisplay,
      confirmationLogic: logic,
      spinnerMessage: spinMsg,
    };
    const ref = this.dialog.open(
      ConfirmationDialogComponent,
      this.getDialogDataOptions(confirmationDialogData)
    );
    if (onClose) {
      ref.afterClosed().subscribe((ret: Record<string, unknown>) => {
        onClose(ret);
      });
    }
  }

  /**
   * Opens a dialog asking the user to confirm whether or not if they want to delete their profile.
   */
  openDeleteProfileDialog(user: UserProfile): void {
    const context = this;
    const DELETE_PROF_LOGIC: Function = async function (): Promise<
      ApiResponse<void>
    > {
      return context.userService.deleteUserProfile(user.uid);
    };
    const onClose = () =>
      this.authService.logOutGoHome(this.textService.text.deletedProfile);
    this.openConfirmationDialog(
      this.textService.text.deleteProfTitle,
      this.textService.text.deleteProfileMessage,
      DELETE_PROF_LOGIC,
      this.textService.text.deleteProfSpinnerMessage,
      onClose
    );
  }

  /**
   * Opens the terms of service dialog. The terms dialog has no logic so no callback function
   * needs to be defined and it can just be opened with the basic dialog options.
   */
  openTermsDialog(): void {
    this.dialog.open(TermsDialogComponent, this.getDefaultDialogOptions());
  }
}
