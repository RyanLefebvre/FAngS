import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpService } from 'src/app/services/constants/http-service';
import { TextService } from 'src/app/services/constants/text.service';
import { AuthenticationService } from 'src/app/services/firebase/authentication.service';
import { SnackBarService } from 'src/app/shared-modules/material/snack-bar-manager.service';

/**
 * Prompts the user as to whether or not they would like to send a password reset email to the
 * email passed into this component as a parameter. If the user presses the confirm button,
 * then an attempt is made to send the reset email. If they press the close button, then
 * the dialog is closed.
 *
 * Last edited by: Ryan Lefebvre 7/27/2020
 */
@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
})
export class ResetPasswordComponent implements OnInit {
  /**
   * True if the spinner is being shown indicating a password reset operation. False otherwise.
   */
  showSpinner = false;

  /**
   * @ignore
   */
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Record<string, string>,
    public dialogRef: MatDialogRef<ResetPasswordComponent>,
    public auth: AuthenticationService,
    public snackbar: SnackBarService,
    public textService: TextService,
    public http: HttpService
  ) {}

  /**
   * @ignore
   */
  ngOnInit(): void {}

  /**
   * Attempts to send a password reset email to the email passed in as a param
   * to this dialog. If the request to send the reset email is successful, then
   * a snackbar notification indicating a success is displayed and the dialog is
   * closed. If the request to send the email fails, then an error message is
   * displayed.
   */
  async attemptToSendResetEmail(): Promise<void> {
    this.dialogRef.disableClose = true;
    this.showSpinner = true;
    try {
      const emailToSendResetTo: string = this.data.email;
      await this.auth.afAuth.sendPasswordResetEmail(emailToSendResetTo);
      this.snackbar.showSuccessMessage(
        this.textService.text.sendPasswordResetSuccess
      );
    } catch (error) {
      const prettyErrorResponse = this.http.getFormattedErrorResponse(error);
      this.snackbar.showFailureMessage(prettyErrorResponse.error.message);
    }
    this.showSpinner = false;
    this.dialogRef.close();
  }
}
