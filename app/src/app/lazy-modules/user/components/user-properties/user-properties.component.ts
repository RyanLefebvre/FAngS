import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/services/firebase/authentication.service';
import { UserService } from 'src/app/services/firebase/user.service';
import { ProfileService } from 'src/app/services/util/profile.service';
import { SnackBarService } from 'src/app/shared-modules/material/snack-bar-manager.service';
import { DialogCreatorService } from 'src/app/shared-modules/dialogs/services/dialog-creator.service';
import { ValidateEmail } from 'src/app/shared-validators/email-validator';
import { ValidateUsername } from 'src/app/shared-validators/username-validator';
import { UserProfile } from '../../../../../../../shared/classes/user-profile';
import { UserEditData } from '../../../../../../../shared/classes/user-edit-data';
import { TextService } from 'src/app/services/constants/text.service';
import { TimeService } from 'src/app/services/util/time-constant.service';

/**
 * Component responsible for viewing and editing user profile property information.
 *
 * Also has controls for profile management like updating password, changing email
 * and deleting account.
 *
 * Last edited by: Ryan Lefebvre 7/29/2020
 */
@Component({
  selector: 'app-user-properties',
  templateUrl: './user-properties.component.html',
  styleUrls: ['./user-properties.component.css'],
})
export class UserPropertiesComponent implements OnInit, OnChanges {
  /**
   * The user to display information for.
   */
  @Input()
  user: UserProfile;

  /**
   * Key for username form control.
   */
  FORM_CONTROL_USERNAME = 'username';

  /**
   * Key for username display form control.
   */
  FORM_CONTROL_DISPLAY_USERNAME = 'displayUsername';

  /**
   * Key for email form control.
   */
  FORM_CONTROL_EMAIL = 'email';

  /**
   * Key for email display form control.
   */
  FORM_CONTROL_DISPLAY_EMAIL = 'displayEmail';

  /**
   * Form control for profile visibility.
   */
  FORM_CONTROL_PROF_VISIBILITY = 'profileAccess';

  /**
   * Key for profile visibility form control.
   */
  FORM_CONTROL_DISPLAY_PROF_VISIBILITY = 'displayProfileAccess';

  /**
   * True if the spinner indicating a loading operation should be displayed. False otherwise.
   */
  showSpinner = false;

  /**
   * Flag for displaying user email change success message.
   */
  showEmailChangeSuccess = false;

  /**
   * Flag for displaying user email change failure message. Informs
   * the user that the email they entered must already be in use or
   * that the request failed.
   */
  showEmailChangeFailure = false;

  /**
   * Form group for the user profile.
   */
  profileEditForm: FormGroup;

  /**
   * True if the user is being edited. i.e. the form is open. False otherwise.
   */
  isEditing = false;

  /**
   * @ignore
   */
  constructor(
    public auth: AuthenticationService,
    public fb: FormBuilder,
    public dialog: DialogCreatorService,
    public userService: UserService,
    public snackBar: SnackBarService,
    public prof: ProfileService,
    public textService: TextService,
    public timeService: TimeService
  ) {}

  /**
   * @ignore
   */
  ngOnInit(): void {}

  /**
   * @ignore
   */
  ngOnChanges(): void {
    this.isEditing = false;
    if (this.user) {
      this.profileEditForm = this.generateNewProfileEditForm(this.user);
    }
  }

  /**
   * Returns true if the user can edit the profile that
   * they are viewing, false otherwise.
   */
  canEdit(): boolean {
    return this.user.uid === this.auth.getCurrentUserID();
  }

  /**
   * Returns true if the confirmation and close buttons should be displayed.
   * False otherwise. These buttons should be displayed if the profile form
   * is being edited and it is not in the middle of a submission, i.e. the
   * spinner is displayed.
   */
  showConfirmationAndCloseButton(): boolean {
    const submittingForm: boolean = this.showSpinner;
    const editingProfileForm: boolean = this.isEditing;
    const showConfirmationAndClose: boolean =
      !submittingForm && editingProfileForm;
    return showConfirmationAndClose;
  }

  /**
   * Returns true is the delete button should be disabled. False
   * otherwise. This button should be disabled if any form is being
   * edited.
   */
  disableDeleteButton(): boolean {
    return this.isEditing || this.showSpinner;
  }

  /**
   * True if the profile edit form is not currently being edited or is
   * being submitted. False otherwise.
   */
  disableUserProfileFormControls(): boolean {
    const submitting: boolean = this.showSpinner;
    const profileFormNotBeingEdited = !this.isEditing;
    const shouldBeDisabled: boolean = submitting || profileFormNotBeingEdited;
    return shouldBeDisabled;
  }

  /**
   * Helper function for opening password reset dialog. Automatically opens
   * the dialog with the current user's email.
   */
  async openPasswordReset(): Promise<void> {
    const authenticatedUserEmail: string = this.auth.getCurrentUserEmail();
    this.dialog.openPasswordResetDialog(authenticatedUserEmail);
  }

  /**
   * Click handler for 'edit profile' button and close button. If the profile
   * edit form is not being edited, this function will switch the form into
   * edit mode.
   */
  toggleProfileFormEdit(): void {
    this.isEditing = !this.isEditing;
    this.showEmailChangeFailure = this.showEmailChangeSuccess = false;
  }

  /**
   * Handles submission of the user profile edit form.
   * Turns on the spinner to indicate a  request is being made
   * and to lock down the profile edit form. Then waits for
   * a request to update the users email if it changed. Regardless
   * of whether the user's email was changed and if the change request
   * complete successfully, the state of the form controls are copied
   * into the properties of a user pofile. Then a request is made to
   * firebase to edit the use profile. The user's profile has to be edited
   * on the backend to avoid any read only data from being updated. Once the
   * request to edit the user's profile returns. The form is marked as not being
   * edited and the spinner is hidden. If the user's email did change, then they are signed
   * out to make sure that their new email gets verified.
   */
  async handleSubmit(): Promise<void> {
    this.showSpinner = true;
    this.showEmailChangeFailure = this.showEmailChangeSuccess = false;
    const userData: UserEditData = {
      username: this.profileEditForm.controls[this.FORM_CONTROL_USERNAME].value,
      email:
        this.profileEditForm.controls[this.FORM_CONTROL_EMAIL].value.trim(),
      isPublic:
        this.profileEditForm.controls[this.FORM_CONTROL_PROF_VISIBILITY]
          .value === this.prof.PROF_VIS_PUBLIC
          ? true
          : false,
      lastEdit: this.timeService.getTimeStamp(),
      uid: this.user.uid,
    };
    const emailDifferentBeforeRequest: boolean =
      this.user.email != userData.email;
    if (emailDifferentBeforeRequest) {
      const successfulAuthentication = await this.dialog.openReauthDialog(
        this.textService.text.changingEmailHeader
      );
      if (!successfulAuthentication) {
        userData.email = this.user.email;
        this.snackBar.showFailureMessage(
          this.textService.text.emailChangeFailure
        );
      }
    }
    const updatedUserResponse = await this.userService.editUserProfile(
      userData
    );
    const updatedUser: UserProfile = updatedUserResponse.data;
    if (updatedUser) {
      let updatedEmail = this.user.email;
      if (emailDifferentBeforeRequest) {
        updatedEmail = await this.sendEmailVerificationIfNecessary(updatedUser);
        if (updatedEmail === this.user.email) {
          this.showEmailChangeFailure = true;
        } else {
          this.showEmailChangeSuccess = true;
        }
      }
      this.user = {
        ...updatedUser,
        email: updatedEmail,
      };
      this.profileEditForm = this.generateNewProfileEditForm(this.user);
    }
    this.showSpinner = this.isEditing = false;
  }

  /**
   * Sends a verification email to the user but only if it is necessary. The email
   * will only be sent if the email was different before the form was submitted and
   * this is the current user being edited.
   */
  async sendEmailVerificationIfNecessary(
    userEditResult: UserProfile
  ): Promise<string> {
    let updatedEmail = this.user.email;
    const emailDifferentAfterEdit: boolean =
      userEditResult.email != this.user.email;
    const isCurrentUser: boolean =
      this.auth.getCurrentUserID() === userEditResult.uid;
    if (emailDifferentAfterEdit && isCurrentUser) {
      try {
        await this.auth.currentUser.updateEmail(userEditResult.email);
        await this.auth.currentUser.sendEmailVerification();
        await this.auth.logOutGoVerify(
          this.textService.text.verifyEmailMessage
        );
        this.snackBar.showSuccessMessage(
          this.textService.text.emailChangeSuccess
        );
        updatedEmail = userEditResult.email;
      } catch (error) {
        this.snackBar.showFailureMessage(
          this.textService.text.emailChangeFailure
        );
      }
    } else {
      this.snackBar.showFailureMessage(
        this.textService.text.emailChangeFailure
      );
    }
    return updatedEmail;
  }

  /**
   * Click handler for delete account button. Opens the reauthentication dialog.
   * If successful, will open the delete profile dialog which will force the user to confirm
   * they want to delete their account.
   */
  async handleDelete(): Promise<void> {
    const successfulAuthentication = await this.dialog.openReauthDialog(
      this.textService.text.deletingProfileHeader
    );
    if (successfulAuthentication) {
      this.dialog.openDeleteProfileDialog(this.user);
    }
  }

  /**
   * Generates a new profile edit form.
   */
  generateNewProfileEditForm(currentUser: UserProfile): FormGroup {
    const valueOrLine = (value): string => (value === null ? '-' : value);
    const isPublicValue: string = currentUser.isPublic
      ? this.prof.PROF_VIS_PUBLIC
      : this.prof.PROF_VIS_PRIVATE;
    const group = this.fb.group({
      [this.FORM_CONTROL_USERNAME]: [
        {
          value: currentUser.username,
          disabled: this.disableUserProfileFormControls(),
        },
        ValidateUsername,
      ],
      [this.FORM_CONTROL_DISPLAY_USERNAME]: {
        value: valueOrLine(currentUser.username),
        disabled: this.disableUserProfileFormControls(),
      },
      [this.FORM_CONTROL_EMAIL]: [
        {
          value: currentUser.email,
          disabled: this.disableUserProfileFormControls(),
        },
        [Validators.required, ValidateEmail],
      ],
      [this.FORM_CONTROL_DISPLAY_EMAIL]: {
        value: valueOrLine(currentUser.email),
        disabled: this.disableUserProfileFormControls(),
      },
      [this.FORM_CONTROL_PROF_VISIBILITY]: {
        value: isPublicValue,
        disabled: this.disableUserProfileFormControls(),
      },
      [this.FORM_CONTROL_DISPLAY_PROF_VISIBILITY]: {
        value: isPublicValue,
        disabled: this.disableUserProfileFormControls(),
      },
    });
    return group;
  }
}
