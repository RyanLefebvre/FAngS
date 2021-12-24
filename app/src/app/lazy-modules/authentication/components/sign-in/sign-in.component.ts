import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthenticationService } from 'src/app/services/firebase/authentication.service';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ValidateEmail } from '../../../../shared-validators/email-validator';
import { DialogCreatorService } from 'src/app/shared-modules/dialogs/services/dialog-creator.service';
import { RoutesService } from 'src/app/services/constants/routes.service';
import { TextService } from 'src/app/services/constants/text.service';

/**
 * Wrapper around a form that contains two controls, one for email and one for password. The component has
 * a 'sign-in' at the bottom to submit the form. This button is followed by a message that says 'click here
 * to register' which will renavigate users without accounts to the register form. If the user's authentication
 * attempt is successful, they will be redirected to the dahboard.
 *
 * If the user's authentication attempt is unsuccesful, an error message from firebase is displayed and the user
 * is prompted with an additional "forgot your password? click here" message. If pressed, the message will open
 * the reset password dialog and send an email to whatever email is entered in the form controls.
 *
 * The 'sign in' button should be disabled if the user is not authenticated or the authentication
 * form is not valid. The form can only be invalid if a username or password is missing.
 *
 * The 'click here to register' link should always be visible and when clicked will
 * navigate the user to the register form.
 *
 * The 'click here to reset password' link will be visible indefinitely after one authentication
 * error. This goes for the error message from firebase as well. If pressed, this button will open
 * the reset password dialog. This dialog will always be given the email that is entered as the
 * current value of the 'username' form control. If this email does not pass the basic validation
 * done by the EmailValidator used in the register and profile edit form, an error message is displayed
 * instead of opening the dialog. After one unsuccessful attempt, the error message is visible until an attempt succeeds.
 *
 * Last edited by: Ryan Lefebvre 6/26/2020
 */
@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css'],
})
export class SignInComponent implements OnInit, OnDestroy {
  /**
   * Key used for authentication form username control.
   */
  FORM_CONTROL_USERNAME = 'username';

  /**
   * Key used for authentication form password control.
   */
  FORM_CONTROL_PASSWORD = 'password';

  /**
   * Form that contains controls for handling user input of password and email.
   */
  authenticateForm: FormGroup = this.fb.group({
    [this.FORM_CONTROL_USERNAME]: ['', Validators.required],
    [this.FORM_CONTROL_PASSWORD]: ['', Validators.required],
  });

  /**
   * True if the reset password link should be shown. False otherwise.
   */
  showReset = false;

  /**
   * True if the spinner should be shown indicating an ongoing authentication attempt.
   */
  showSpinner = false;

  /**
   * Error message from firebase. Value is reset in error subscription.
   */
  errorMessage: string = this.textService.text.noIdeaWhatWentWrongErrorMessage;

  /**
   * True if the error message from firebase should be shown. false otherwise.
   */
  showErrorMessage: boolean = null;

  /**
   * Reference to any authentication errors returned from firebase.
   */
  myErrorSubscription: Subscription = null;

  /**
   * Message displayed underneath the mat-spinner in the spinner-wheel component.
   */
  spinnerMessage: string = this.textService.text.signingIn;

  /**
   *@ignore
   */
  constructor(
    public authService: AuthenticationService,
    public fb: FormBuilder,
    public dialogManager: DialogCreatorService,
    public routesService: RoutesService,
    public textService: TextService
  ) {}

  /**
   * @ignore
   */
  ngOnInit(): void {
    this.errorSubscription();
  }

  /**
   * @ignore kills subscriptions.
   */
  ngOnDestroy(): void {
    if (this.myErrorSubscription) {
      this.myErrorSubscription.unsubscribe();
    }
  }

  /**
   * Subscribes to errors from firebase.
   */
  errorSubscription(): void {
    this.myErrorSubscription = this.authService.eventAuthError.subscribe(
      (errorMSG: string) => {
        this.showSpinner = false;
        this.errorMessage = errorMSG;
        this.showErrorMessage = true;
        this.showReset = true;
      }
    );
  }

  /**
   * Extracts email and username from form controls and tries to authenticate user.
   */
  handleSubmit(): void {
    this.showSpinner = true;
    let email: string =
      this.authenticateForm.controls[this.FORM_CONTROL_USERNAME].value;
    if (email) {
      email = email.trim();
    }
    let password: string =
      this.authenticateForm.controls[this.FORM_CONTROL_PASSWORD].value;
    if (password) {
      password = password.trim();
    }
    this.authService.login(email, password);
  }

  /**
   * Opens up a dialog that will always be given the email that is entered as the
   *  current value of the 'username' form control. If this email does not pass the
   *  basic validation done by the EmailValidator used in the register and profile edit form,
   *  an error message is displayed instead of opening the dialog. After one unsuccessful
   * attempt, the error message is visible until an attempt succeeds.
   */
  resetPassword(): void {
    const email: string =
      this.authenticateForm.controls[this.FORM_CONTROL_USERNAME].value;
    const emailIsValid: {} =
      ValidateEmail(
        this.authenticateForm.controls[this.FORM_CONTROL_USERNAME]
      ) == null;
    if (emailIsValid) {
      this.dialogManager.openPasswordResetDialog(email);
    } else {
      this.errorMessage = this.textService.text.enterValidEmailToReset;
    }
  }
}
