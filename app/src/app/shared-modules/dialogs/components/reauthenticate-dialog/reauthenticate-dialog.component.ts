import { Component, OnInit, Inject } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AuthenticationService } from 'src/app/services/firebase/authentication.service';
import { SnackBarService } from 'src/app/shared-modules/material/snack-bar-manager.service';
import { TextService } from 'src/app/services/constants/text.service';
import { HttpService } from 'src/app/services/constants/http-service';
import firebase from 'firebase/compat/app';

/**
 * This dialog is essentially the same as the sign in form except it is used in situations
 * when the user needs to reauthenticate before a sensitive operation. For example a user
 * may need to sign in again before changing their email address or password. This component
 * has a form with two fields for email and password. Above the form is a message to the
 * user about why they have to authenticate again. Below the form are two buttons a
 * authenticate button and a close button. The close button will close the dialog if
 * pressed and the authenticate button will make a sign in request to firebase when the user
 * enters their authentication credentials. If the request fails then the error message
 * for the failure is displayed, otherwise the component is closed. While the authentication
 * request is being waited upon a spinner should be shown with a message indicating that the
 * request is being made and the dialog should not be able to be closed by clicking outside
 * of it.
 *
 * Last edited by: Ryan Lefebvre 7/28/2020
 */
@Component({
  selector: 'app-reauthenticate-dialog',
  templateUrl: './reauthenticate-dialog.component.html',
  styleUrls: ['./reauthenticate-dialog.component.css'],
})
export class ReauthenticateDialogComponent implements OnInit {
  /**
   * True if the spinner should be shown. False otherwise.
   */
  showSpinner = false;

  /**
   * True if the error message should be shown. False otherwise.
   */
  showErrorMessage = false;

  /**
   * Default value for an authentication error message.
   */
  DEFAULT_ERROR_MESSAGE = 'An error occured';

  /**
   * Value of the error message to be displayed.
   */
  errorMessage: string = this.DEFAULT_ERROR_MESSAGE;

  /**
   * Key used for authentication form username control.
   */
  FORM_CONTROL_USERNAME = 'username';

  /**
   * Key used for authentication form password control.
   */
  FORM_CONTROL_PASSWORD = 'password';

  /**
   * Value used for return value for a successful authentication.
   */
  AUTH_SUCCESS = true;

  /**
   * Value used for a return value for an unsuccessful authentication.
   */
  AUTH_FAILURE = false;

  /**
   * Form that contains controls for handling user input of password and email.
   */
  authenticateForm: FormGroup = this.fb.group({
    [this.FORM_CONTROL_USERNAME]: ['', Validators.required],
    [this.FORM_CONTROL_PASSWORD]: ['', Validators.required],
  });

  /**
   * Message to be passed to dialog wrapper
   */
  wrapperMessage = `${this.data.operationMessage} ${this.textService.text.thisIsSensitvieOperation}`;

  /**
   * @ignore
   */
  constructor(
    public authService: AuthenticationService,
    public fb: FormBuilder,
    public snackbar: SnackBarService,
    @Inject(MAT_DIALOG_DATA) public data: Record<string, unknown>,
    public dialogRef: MatDialogRef<ReauthenticateDialogComponent>,
    public textService: TextService,
    public http: HttpService
  ) {}

  /**
   * @ignore
   */
  ngOnInit(): void {}

  /**
   * Handles submission of the reauthentication form. Displays a spinner and locks
   * down the dialog from being closed. If the authentication request is successful,
   * then the dialog is closed. If it fails then an error message is displayed and the
   * spinner is hidden and the dialog can be closed again.
   */
  async handleSubmit(): Promise<void> {
    this.showErrorMessage = false;
    this.dialogRef.disableClose = true;
    this.showSpinner = true;
    const email: string =
      this.authenticateForm.controls[this.FORM_CONTROL_USERNAME].value;
    const password: string =
      this.authenticateForm.controls[this.FORM_CONTROL_PASSWORD].value;
    const currentUser = await this.authService.afAuth.currentUser;
    const credentials = firebase.auth.EmailAuthProvider.credential(
      email,
      password
    );
    try {
      await currentUser.reauthenticateWithCredential(credentials);
      this.snackbar.showSuccessMessage(
        this.textService.text.reauthenticationSuccess
      );
      this.closeDialog(true);
    } catch (error) {
      const context = this;
      setTimeout(() => {
        const prettyErrorResponse = this.http.getFormattedErrorResponse(error);
        context.errorMessage = prettyErrorResponse.error.message;
        context.showErrorMessage = true;
        context.showSpinner = false;
        context.dialogRef.disableClose = false;
        context.snackbar.showFailureMessage(
          this.textService.text.reauthenticationFailure
        );
      }, 600);
    }
  }

  /**
   * Closes the dialog and passes the result of the authentication request to the dialogs creators
   * on close callback which will return it to the calling component or service.
   *
   * @param userSuccessfullyReauthenticated True if the authentication was successful. False otherwise.
   */
  closeDialog(userSuccessfullyReauthenticated: boolean): void {
    this.dialogRef.close(userSuccessfullyReauthenticated);
  }
}
