import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { ValidatePassword } from 'src/app/shared-validators/password-validator';
import { ValidateEmail } from 'src/app/shared-validators/email-validator';
import { DialogCreatorService } from 'src/app/shared-modules/dialogs/services/dialog-creator.service';
import { AuthenticationService } from 'src/app/services/firebase/authentication.service';
import { Subscription } from 'rxjs';
import { ValidateUsername } from 'src/app/shared-validators/username-validator';
import { UserProfile } from '../../../../../../../shared/classes/user-profile';
import { RoutesService } from 'src/app/services/constants/routes.service';
import { UserCreateData } from '../../../../../../../shared/classes/user-create-data';
import { TimeService } from 'src/app/services/util/time-constant.service';
import { UserService } from 'src/app/services/firebase/user.service';
import { TextService } from 'src/app/services/constants/text.service';
import { ActivatedRoute } from '@angular/router';
import { SnackBarService } from 'src/app/shared-modules/material/snack-bar-manager.service';
import { ApiResponse } from '../../../../../../../shared/classes/api-response';

/**
 * This component is the register form for users.
 *
 * The register button is disabled as long as the form is invalid. The requirements
 * for what makes a control invalid are described in detail within the files of the
 * validators that are applied to those controls.
 *
 * While the majority of the controls have validators that can make the control invalid,
 * a subset of the controls are required and the register button will remain disabled until
 * all have a valid value. The required controls are username, password, password confirmation,
 * email and agreeing to the terms.
 *
 * If no form controls are invalid and the required form controls have values, the register
 * form can be submitted. On a successful submission, the user will be redirected to the
 * verify email page. On an unsuccessful submission, an error will be returned from
 * firebase and displayed to the user.
 *
 * Last edited by: Ryan Lefebvre 9/30/2020
 */
@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
})
export class SignUpComponent implements OnInit {
  /**
   * Key for username form control.
   */
  FORM_CONTROL_USERNAME = 'username';

  /**
   * Key for password form control.
   */
  FORM_CONTROL_PASSWORD = 'password';

  /**
   * Key for password confirmation form control.
   */
  FORM_CONTROL_PASSWORD_CONFIRMATION = 'passwordConfirmation';

  /**
   * Key for email form control.
   */
  FORM_CONTROL_EMAIL = 'email';

  /**
   * Key for terms agreement form control.
   */
  FORM_CONTROL_AGREE_TO_TERMS = 'agreeToTerms';

  /**
   * Key for statement saying how they heard about us.
   */
  FORM_CONTROL_HEARD_ABOUT = 'heardAboutUs';

  /**
   * Constant that indicates the user has not yet agreed to the terms and conditions.
   */
  DOES_NOT_AGREE_YET: string = null;

  /**
   * Group of form controls that are necessary to populate user's profile
   * and create a unique UID that is linked to their email to reference
   * on authentication.
   */
  registerForm: FormGroup = this.fb.group({
    [this.FORM_CONTROL_USERNAME]: [
      null,
      [Validators.required, ValidateUsername],
    ],
    [this.FORM_CONTROL_PASSWORD]: [
      null,
      [Validators.required, ValidatePassword],
    ],
    [this.FORM_CONTROL_PASSWORD_CONFIRMATION]: [
      null,
      [Validators.required, ValidatePassword],
    ],
    [this.FORM_CONTROL_EMAIL]: [null, [Validators.required, ValidateEmail]],
    [this.FORM_CONTROL_AGREE_TO_TERMS]: [
      this.DOES_NOT_AGREE_YET,
      [Validators.required],
    ],
    [this.FORM_CONTROL_HEARD_ABOUT]: [null],
  });

  /**
   * Displays an error message from firebase if a register operation is denied.
   */
  errorMessage = '';

  /**
   * true if the spinner should be shown. Indicating an ongoing register operation.
   */
  showSpinner = false;

  /**
   * Message displayed underneath the mat-spinner in the spinner-wheel component.
   */
  spinnerMessage: string = this.textService.text.creatingAccountSpinngerMessage;

  /**
   * Reference to the subscription to the activated route that controls query params
   */
  myRouteSub: Subscription = null;

  /**
   * @ignore
   */
  constructor(
    public dialogService: DialogCreatorService,
    private fb: FormBuilder,
    public authManager: AuthenticationService,
    public route: ActivatedRoute,
    public routesService: RoutesService,
    public textService: TextService,
    public timeService: TimeService,
    public userServiceService: UserService,
    public snackbar: SnackBarService
  ) {}

  /**
   * @ignore
   */
  ngOnInit(): void {}

  /**
   * True if there is an error message to display, false otherwise.
   * !! syntax returns true if the error message is not null or empty.
   */
  hasErrorMessage(): boolean {
    return !!this.errorMessage;
  }

  /**
   * Handles submission of the register form. Validation has already been performed on most controls.
   * The last thing that needs to be checked is that the password matches the password confirmation.
   * If this check passes, then the results of the register form are converted into a user profile.
   * This function then waits for the results of an attempted register. If the user is registered,
   * successfully, they will be re-routed from the page. If they fail, an error mesage is displayed.
   */
  async handleSubmit(): Promise<void> {
    const theyMatch: boolean = this.checkThatPassWordsMatch();
    const context = this;
    if (theyMatch) {
      try {
        context.showSpinner = true;
        const email: string =
          this.registerForm.controls[this.FORM_CONTROL_EMAIL].value.trim();
        const password: string =
          this.registerForm.controls[this.FORM_CONTROL_PASSWORD].value.trim();
        const user: UserProfile = this.convertResultsToModel();
        const logicToWaitFor = async () => {
          const userCreateData: UserCreateData = {
            uid: null,
            username: user.username,
            email: email,
            password: password,
            dateCreated: this.timeService.getTimeStamp(),
            heardAboutUs: user.heardAboutUs,
          };
          return await this.userServiceService.createUserProfile(
            userCreateData
          );
        };
        const registerResponse: ApiResponse<UserProfile> =
          await this.dialogService.openWaitForOperationDialog(
            logicToWaitFor,
            this.textService.text.signUp,
            'touch_app',
            this.textService.text.creatingAccountSpinngerMessage
          );
        if (registerResponse.error) {
          this.updateUiForRegisterError(registerResponse.error.message);
        } else {
          this.authManager.logOutGoVerify(
            this.textService.text.successfulSignOut
          );
        }
      } catch (err) {
        this.updateUiForRegisterError(err.message);
      }
    }
  }

  /**
   * Updates the user interface to display an error message if an error
   * occured during the register process.
   *
   * @param errorMessage
   */
  updateUiForRegisterError(errorMessage: string): void {
    this.errorMessage = errorMessage;
    this.showSpinner = false;
    this.snackbar.showFailureMessage(
      this.textService.text.failedToCreateAccount
    );
  }

  /**
   * Returns true if the value of the password and password confirmation
   * form controls match. If they do not then an error message is displayed
   * and false is returned.
   */
  checkThatPassWordsMatch(): boolean {
    const password: string =
      this.registerForm.controls[this.FORM_CONTROL_PASSWORD].value;
    const passwordConfirmation =
      this.registerForm.controls[this.FORM_CONTROL_PASSWORD_CONFIRMATION].value;
    const allowSubmit: boolean = password == passwordConfirmation;
    if (!allowSubmit) {
      this.errorMessage = this.textService.text.passwordsMustMatchErrorMessage;
    }
    return allowSubmit;
  }

  /**
   * Converts the current values of the register form into a user profile that will be stored as the
   * initial data for a user in firebase.
   */
  convertResultsToModel(): UserProfile {
    const newUser: UserProfile = new UserProfile();
    newUser.username =
      this.registerForm.controls[this.FORM_CONTROL_USERNAME].value;
    if (newUser.username) {
      newUser.username = newUser.username.trim();
    }
    newUser.heardAboutUs =
      this.registerForm.controls[this.FORM_CONTROL_HEARD_ABOUT].value;
    if (newUser.heardAboutUs) {
      newUser.heardAboutUs = newUser.heardAboutUs.trim();
    }
    newUser.email = this.registerForm.controls[this.FORM_CONTROL_EMAIL].value;
    if (newUser.email) {
      newUser.email = newUser.email.trim();
    }
    return newUser;
  }

  /**
   * Helper function for opening the terms of service dialog.
   */
  openTerms(): void {
    this.dialogService.openTermsDialog();
  }

  /**
   * Returns true if the user agrees to the terms of service. False otherwise.
   */
  userAgreesToTerms(): boolean {
    return (
      this.registerForm.controls[this.FORM_CONTROL_AGREE_TO_TERMS].value == true
    );
  }
}
