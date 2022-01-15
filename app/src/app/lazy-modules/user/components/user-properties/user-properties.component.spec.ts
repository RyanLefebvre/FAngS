/* eslint-disable @typescript-eslint/no-explicit-any */
import { AuthenticationService } from 'src/app/services/firebase/authentication.service';
import { FormBuilder } from '@angular/forms';
import { DialogCreatorService } from 'src/app/shared-modules/dialogs/services/dialog-creator.service';
import { UserService } from 'src/app/services/firebase/user.service';
import { SnackBarService } from 'src/app/shared-modules/material/snack-bar-manager.service';
import { ProfileService } from 'src/app/services/util/profile.service';
import { TextService } from 'src/app/services/constants/text.service';
import { TimeService } from 'src/app/services/util/time-constant.service';
import { UserPropertiesComponent } from './user-properties.component';
import { autoSpy } from 'autoSpy';
import { UserProfile } from '../../../../../../../shared/classes/user-profile';
import { ApiResponse } from '../../../../../../../shared/classes/api-response';
import { StorageService } from 'src/app/services/firebase/storage.service';
import { ReadVarExpr } from '@angular/compiler';

describe('UserViewEditComponent', () => {
  let component: UserPropertiesComponent;

  beforeEach(() => {
    const { build } = setup().default();
    component = build();
  });

  it('should not crash when ngOnInit() is called', () => {
    let crashed = false;
    try {
      component.ngOnInit();
    } catch (error) {
      crashed = true;
    }
    expect(crashed).toBe(false);
  });

  it('should set editMode to false when ngOnChanges is called', () => {
    component.isEditing = true;
    component.ngOnChanges();
    expect(component.isEditing).toBe(false);
  });

  it('should NOT generate a new form if the user input is null when ngOnChanges() is called', () => {
    component.user = null;
    component.generateNewProfileEditForm = jasmine.createSpy();
    component.ngOnChanges();
    expect(component.generateNewProfileEditForm).not.toHaveBeenCalled();
  });

  it('should generate a new form if the user is truthy when ngOnChanges() is called', () => {
    component.user = new UserProfile();
    component.generateNewProfileEditForm = jasmine.createSpy();
    component.ngOnChanges();
    expect(component.generateNewProfileEditForm).toHaveBeenCalled();
  });

  it('should return true when canEdit called if the current user is viewing their own profile', () => {
    const curUserUid = 'someUid';
    component.auth.getCurrentUserID = () => curUserUid;
    component.user = {
      uid: curUserUid,
    } as any;
    expect(component.canEdit()).toBe(true);
  });

  it('should return false when canEdit called if the current user is NOT viewing their own profile', () => {
    const curUserUid = 'someUid';
    component.auth.getCurrentUserID = () => curUserUid;
    component.user = {
      uid: 'someOtherUID',
    } as any;
    expect(component.canEdit()).toBe(false);
  });

  it('should should show the confirmation adn close button if the form is not being submitted and the user is editing the form', () => {
    component.isEditing = true;
    component.showSpinner = false;
    expect(component.showConfirmationAndCloseButton()).toBe(true);
  });

  it('should should NOT show the confirmation adn close button if the form is being submitted or the user is editing the form', () => {
    component.isEditing = false;
    component.showSpinner = true;
    expect(component.showConfirmationAndCloseButton()).toBe(false);
  });

  it('should disable the delete button if the spinner is showing or the component is in edit mode', () => {
    component.isEditing = true;
    component.showSpinner = true;
    expect(component.disableDeleteButton()).toBe(true);
  });

  it('should NOT disable the delete button if the spinner is NOT showing and the component is NOT in edit mode', () => {
    component.isEditing = false;
    component.showSpinner = false;
    expect(component.disableDeleteButton()).toBe(false);
  });

  it('should disable the profile form controls if the form is submitting or the not being edited', () => {
    component.showSpinner = true;
    component.isEditing = false;
    expect(component.disableUserProfileFormControls()).toBe(true);
  });

  it('should NOT disable the profile form controls if the form is not being submitting and is being edited', () => {
    component.showSpinner = false;
    component.isEditing = true;
    expect(component.disableUserProfileFormControls()).toBe(false);
  });

  it('should open the password reset dialog with the current users email when openPasswordReset is called', () => {
    const expectedEmail = 'hb@burisma.com';
    component.auth.getCurrentUserEmail = () => expectedEmail;
    component.openPasswordReset();
    expect(component.dialog.openPasswordResetDialog).toHaveBeenCalledWith(
      expectedEmail
    );
  });

  it('should toggle isEditing and hide the email errors when toggleProfileFormEdit is called', () => {
    component.isEditing =
      component.showEmailChangeFailure =
      component.showEmailChangeSuccess =
        true;
    component.toggleProfileFormEdit();
    expect(component.showEmailChangeSuccess).toBe(false);
    expect(component.showEmailChangeFailure).toBe(false);
    expect(component.isEditing).toBe(false);
  });

  it('should submit the user when handleSubmit is called and update the properties that were edited', async () => {
    component.timeService = new TimeService();
    component.prof = new ProfileService();
    component.user = {
      uid: 'someUid',
      username: 'some username',
      email: 'someemail',
      dateCreated: component.timeService.getTimeStamp(),
      heardAboutUs: 'idk',
      lastEdit: component.timeService.getTimeStamp(),
      wasDeleted: false,
      isPublic: true,
    } as UserProfile;
    component.profileEditForm = {
      controls: {
        [component.FORM_CONTROL_USERNAME]: {
          value: component.user.username + 'someOtherChars',
        },
        [component.FORM_CONTROL_EMAIL]: { value: component.user.email },
        [component.FORM_CONTROL_PROF_VISIBILITY]: {
          value: component.prof.PROF_VIS_PRIVATE,
        },
        [component.FORM_CONTROL_PHONE_NUMBER]: {
          value: '',
        },
        [component.FORM_CONTROL_FIRST_NAME]: {
          value: '',
        },
        [component.FORM_CONTROL_LAST_NAME]: {
          value: '',
        },
        [component.FORM_CONTROL_WEBSITE]: {
          value: '',
        },
        [component.FORM_CONTROL_WEBSITE_URL]: {
          value: '',
        },
        [component.FORM_CONTROL_LOCATION]: {
          value: '',
        },
        [component.FORM_CONTROL_BIO]: {
          value: '',
        },
        [component.FORM_CONTROL_PHONE_NUMBER]: {
          value: '',
        },
      },
    } as any;
    component.userService.editUserProfile = (user): any => {
      return { data: user };
    };
    component.generateNewProfileEditForm = jasmine.createSpy();
    await component.handleSubmit();
    expect(component.user.username).toBe('some username' + 'someOtherChars');
    expect(component.isEditing).toBe(false);
    expect(component.showSpinner).toBe(false);
  });

  it('should show a failure message and return early if the new profile picture from the user is too big', async () => {
    component.storageService.MAX_PROFILE_IMAGE_SIZE = 10;
    component.textService = {
      text: { profilePictureTooBigMessage: 'too big to upload!' } as any,
    };
    component.newProfilePicture = {
      size: 11,
    } as any;
    await component.handleSubmit();
    expect(component.snackBar.showFailureMessage).toHaveBeenCalled();
  });

  it('should still set isEditing and showSpinner to false even if the request errors out', async () => {
    component.timeService = new TimeService();
    component.prof = new ProfileService();
    component.user = {
      uid: 'someUid',
      username: 'some username',
      email: 'someemail',
      dateCreated: component.timeService.getTimeStamp(),
      heardAboutUs: 'idk',
      lastEdit: component.timeService.getTimeStamp(),
      wasDeleted: false,
      isPublic: true,
    } as UserProfile;
    component.getUpdatedProfileURL = jasmine.createSpy();
    component.profileEditForm = {
      controls: {
        [component.FORM_CONTROL_USERNAME]: {
          value: component.user.username + 'someOtherChars',
        },
        [component.FORM_CONTROL_EMAIL]: { value: component.user.email },
        [component.FORM_CONTROL_PROF_VISIBILITY]: {
          value: component.prof.PROF_VIS_PUBLIC,
        },
        [component.FORM_CONTROL_PHONE_NUMBER]: {
          value: '',
        },
        [component.FORM_CONTROL_FIRST_NAME]: {
          value: '',
        },
        [component.FORM_CONTROL_LAST_NAME]: {
          value: '',
        },
        [component.FORM_CONTROL_WEBSITE]: {
          value: '',
        },
        [component.FORM_CONTROL_WEBSITE_URL]: {
          value: '',
        },
        [component.FORM_CONTROL_LOCATION]: {
          value: '',
        },
        [component.FORM_CONTROL_BIO]: {
          value: '',
        },
        [component.FORM_CONTROL_PHONE_NUMBER]: {
          value: '',
        },
      },
    } as any;
    component.userService.editUserProfile = (): any => {
      return { code: 500, error: {} } as ApiResponse<UserProfile>;
    };
    component.generateNewProfileEditForm = jasmine.createSpy();
    await component.handleSubmit();
    expect(component.isEditing).toBe(false);
    expect(component.showSpinner).toBe(false);
  });

  it('should not update the users email and show a failure message if they fail to reauthenticate when handleSubmit is called but still update other properties', async () => {
    component.timeService = new TimeService();
    component.prof = new ProfileService();
    component.textService = { text: {} as any };
    const initialEmail = 'someEmail';
    component.user = {
      uid: 'someUid',
      username: 'some username',
      email: initialEmail,
      dateCreated: component.timeService.getTimeStamp(),
      heardAboutUs: 'idk',
      lastEdit: component.timeService.getTimeStamp(),
      wasDeleted: false,
      isPublic: true,
    } as UserProfile;
    component.profileEditForm = {
      controls: {
        [component.FORM_CONTROL_USERNAME]: {
          value: component.user.username + 'someOtherChars',
        },
        [component.FORM_CONTROL_EMAIL]: { value: 'someOtherEmail@gmail.com' },
        [component.FORM_CONTROL_PROF_VISIBILITY]: {
          value: component.prof.PROF_VIS_PRIVATE,
        },
        [component.FORM_CONTROL_PHONE_NUMBER]: {
          value: '',
        },
        [component.FORM_CONTROL_FIRST_NAME]: {
          value: '',
        },
        [component.FORM_CONTROL_LAST_NAME]: {
          value: '',
        },
        [component.FORM_CONTROL_WEBSITE]: {
          value: '',
        },
        [component.FORM_CONTROL_WEBSITE_URL]: {
          value: '',
        },
        [component.FORM_CONTROL_LOCATION]: {
          value: '',
        },
        [component.FORM_CONTROL_BIO]: {
          value: '',
        },
        [component.FORM_CONTROL_PHONE_NUMBER]: {
          value: '',
        },
      },
    } as any;
    component.userService.editUserProfile = (user): any => {
      return { data: user };
    };
    component.generateNewProfileEditForm = jasmine.createSpy();
    component.dialog.openReauthDialog = async () => false;
    component.sendEmailVerificationIfNecessary = async () =>
      component.user.email;
    await component.handleSubmit();
    expect(component.user.username).toBe('some username' + 'someOtherChars');
    expect(component.isEditing).toBe(false);
    expect(component.showSpinner).toBe(false);
    expect(component.showEmailChangeFailure).toBe(true);
    expect(component.user.email).toBe(initialEmail);
  });

  it('should update the users email and show a success message if they reauthenticate when handleSubmit', async () => {
    component.timeService = new TimeService();
    component.prof = new ProfileService();
    component.textService = { text: {} as any };
    const initialEmail = 'someEmail';
    component.user = {
      uid: 'someUid',
      username: 'some username',
      email: initialEmail,
      dateCreated: component.timeService.getTimeStamp(),
      heardAboutUs: 'idk',
      lastEdit: component.timeService.getTimeStamp(),
      wasDeleted: false,
      isPublic: true,
    } as UserProfile;
    const changedEmail = 'someOtherEmail@gmail.com';
    component.profileEditForm = {
      controls: {
        [component.FORM_CONTROL_USERNAME]: {
          value: component.user.username + 'someOtherChars',
        },
        [component.FORM_CONTROL_EMAIL]: { value: changedEmail },
        [component.FORM_CONTROL_PROF_VISIBILITY]: {
          value: component.prof.PROF_VIS_PRIVATE,
        },
        [component.FORM_CONTROL_PHONE_NUMBER]: {
          value: '',
        },
        [component.FORM_CONTROL_FIRST_NAME]: {
          value: '',
        },
        [component.FORM_CONTROL_LAST_NAME]: {
          value: '',
        },
        [component.FORM_CONTROL_WEBSITE]: {
          value: '',
        },
        [component.FORM_CONTROL_WEBSITE_URL]: {
          value: '',
        },
        [component.FORM_CONTROL_LOCATION]: {
          value: '',
        },
        [component.FORM_CONTROL_BIO]: {
          value: '',
        },
        [component.FORM_CONTROL_PHONE_NUMBER]: {
          value: '',
        },
      },
    } as any;
    component.userService.editUserProfile = (user): any => {
      return { data: user };
    };
    component.generateNewProfileEditForm = jasmine.createSpy();
    component.dialog.openReauthDialog = async () => true;
    component.sendEmailVerificationIfNecessary = async () => changedEmail;
    await component.handleSubmit();
    expect(component.user.username).toBe('some username' + 'someOtherChars');
    expect(component.showEmailChangeSuccess).toBe(true);
    expect(component.user.email).toBe(changedEmail);
  });

  it('should show an error message that the email could not be changed when sendemailVerification is called and they arent different', async () => {
    component.textService = { text: {} as any };
    const initialEmail = 'someEmail';
    component.user = {
      uid: 'someUid',
      username: 'some username',
      email: initialEmail,
      dateCreated: component.timeService.getTimeStamp(),
      heardAboutUs: 'idk',
      lastEdit: component.timeService.getTimeStamp(),
      wasDeleted: false,
      isPublic: true,
    } as UserProfile;
    const otherUser = {
      uid: 'someUid',
      username: 'some username',
      email: 'someOtherEmail',
      dateCreated: component.timeService.getTimeStamp(),
      heardAboutUs: 'idk',
      lastEdit: component.timeService.getTimeStamp(),
      wasDeleted: false,
      isPublic: true,
    } as UserProfile;
    const returnedEmail = await component.sendEmailVerificationIfNecessary(
      otherUser
    );
    expect(component.snackBar.showFailureMessage).toHaveBeenCalled();
    expect(returnedEmail).toBe(initialEmail);
  });

  it('should show an error message that the email could not be changed when sendEmailVerification is called and errors out and return the current email', async () => {
    component.textService = { text: {} as any };
    const initialEmail = 'someEmail';
    const uid = 'someUid';
    component.user = {
      uid: uid,
      username: 'some username',
      email: initialEmail,
      dateCreated: component.timeService.getTimeStamp(),
      heardAboutUs: 'idk',
      lastEdit: component.timeService.getTimeStamp(),
      wasDeleted: false,
      isPublic: true,
    } as UserProfile;
    const otherUser = {
      uid: uid,
      username: 'some username',
      email: 'someOtherEmail',
      dateCreated: component.timeService.getTimeStamp(),
      heardAboutUs: 'idk',
      lastEdit: component.timeService.getTimeStamp(),
      wasDeleted: false,
      isPublic: true,
    } as UserProfile;
    component.auth = {
      getCurrentUserID: () => uid,
    } as any;
    const returnedEmail = await component.sendEmailVerificationIfNecessary(
      otherUser
    );
    expect(component.snackBar.showFailureMessage).toHaveBeenCalled();
    expect(returnedEmail).toBe(initialEmail);
  });

  it('should update the email, send a verification email and sign out when the email is different and it is the current user', async () => {
    component.textService = { text: {} as any };
    const initialEmail = 'someEmail';
    const uid = 'someUid';
    component.user = {
      uid: uid,
      username: 'some username',
      email: initialEmail,
      dateCreated: component.timeService.getTimeStamp(),
      heardAboutUs: 'idk',
      lastEdit: component.timeService.getTimeStamp(),
      wasDeleted: false,
      isPublic: true,
    } as UserProfile;
    const changedEmail = 'someOtherEmail@gmail.com';
    const otherUser = {
      uid: uid,
      username: 'some username',
      email: changedEmail,
      dateCreated: component.timeService.getTimeStamp(),
      heardAboutUs: 'idk',
      lastEdit: component.timeService.getTimeStamp(),
      wasDeleted: false,
      isPublic: true,
    } as UserProfile;
    component.auth = {
      currentUser: {
        sendEmailVerification: jasmine.createSpy(),
        updateEmail: jasmine.createSpy(),
      },
      getCurrentUserID: () => uid,
      logOutGoVerify: jasmine.createSpy(),
    } as any;
    const returnedEmail = await component.sendEmailVerificationIfNecessary(
      otherUser
    );
    expect(component.auth.currentUser.updateEmail).toHaveBeenCalled();
    expect(component.auth.currentUser.sendEmailVerification).toHaveBeenCalled();
    expect(component.snackBar.showSuccessMessage).toHaveBeenCalled();
    expect(component.auth.logOutGoVerify).toHaveBeenCalled();
    expect(returnedEmail).toBe(changedEmail);
  });

  it('should NOT open the delete profile dialog if the user fails to reauthenticate when handleDelete() is called', async () => {
    component.textService = { text: {} } as any;
    component.dialog.openReauthDialog = async () => false;
    await component.handleDelete();
    expect(component.dialog.openDeleteProfileDialog).not.toHaveBeenCalled();
  });

  it('should open the delete profile dialog if the user  reauthenticates when handleDelete() is called', async () => {
    component.textService = { text: {} } as any;
    component.dialog.openReauthDialog = async () => true;
    await component.handleDelete();
    expect(component.dialog.openDeleteProfileDialog).toHaveBeenCalled();
  });

  it('should set the values of the form controls to the values of the user passed in when generateNewProfileForm is called', () => {
    const user = {
      uid: 'uid',
      username: 'some username',
      email: 'email',
      dateCreated: component.timeService.getTimeStamp(),
      heardAboutUs: 'idk',
      lastEdit: component.timeService.getTimeStamp(),
      wasDeleted: false,
      isPublic: true,
    } as UserProfile;
    component.prof = new ProfileService();
    component.fb.group = (input): any => input;
    const group = component.generateNewProfileEditForm(user);
    expect(group[component.FORM_CONTROL_USERNAME][0].value).toBe(user.username);
    expect(group[component.FORM_CONTROL_EMAIL][0].value).toBe(user.email);
    expect(group[component.FORM_CONTROL_PROF_VISIBILITY].value).toBe(
      component.prof.PROF_VIS_PUBLIC
    );
  });

  it('should set the values of the display form controls to a dash if they are null', () => {
    const user = {
      uid: 'uid',
      username: null,
      email: 'email',
      dateCreated: component.timeService.getTimeStamp(),
      heardAboutUs: 'idk',
      lastEdit: component.timeService.getTimeStamp(),
      wasDeleted: false,
      isPublic: false,
    } as UserProfile;
    component.prof = new ProfileService();
    component.fb.group = (input): any => input;
    const group = component.generateNewProfileEditForm(user);
    expect(group[component.FORM_CONTROL_DISPLAY_USERNAME].value).toBe('-');
  });

  it('should set the profile picture state variables to null if the event is null when onImageChange is called', () => {
    component.profPreviewURL = component.newProfilePicture =
      'somethingThatIsnNull' as any;
    component.onImageInputChange({
      target: {
        files: [],
      },
    });
    expect(component.profPreviewURL).toBe(null);
    expect(component.newProfilePicture).toBe(null);
  });

  it('should set the profile picture state variables to the reader result when onImageChange is called with a valid event', () => {
    component.profPreviewURL = component.newProfilePicture =
      'somethingThatIsnNull' as any;
    const fakeReader = {
      readAsDataURL: jasmine.createSpy(),
      result: 'someResult',
    } as any;
    spyOn(window, 'FileReader').and.returnValue(fakeReader);
    component.onImageInputChange({
      target: {
        files: [{}],
      },
    });
    fakeReader.onload();
    expect(fakeReader.readAsDataURL).toHaveBeenCalled();
    expect(component.profPreviewURL).toBe(fakeReader.result);
    expect(component.removeCurrentProfilePicture).toBe(false);
  });

  it('should return the default profile URL when isEditing and removeCurrentProfile picture are true', () => {
    component.isEditing = component.removeCurrentProfilePicture = true;
    expect(component.getProfileImageURL()).toBe(component.defaultProfileURL);
  });

  it('should return the profile preview URL when isEditing is true, removeCurrentProfile picture is false and the preview URL exists', () => {
    component.profPreviewURL = 'someValidValue';
    component.isEditing = true;
    component.removeCurrentProfilePicture = false;
    expect(component.getProfileImageURL()).toBe(component.profPreviewURL);
  });

  it('should return the users profile picture URL when isEditing is true, removeCurrentProfile picture is false and the preview URL doesnt exist but the user has a profile picture', () => {
    component.profPreviewURL = null;
    component.user = {
      profilePictureURL: 'someValidURL',
    } as any;
    component.isEditing = true;
    component.removeCurrentProfilePicture = false;
    expect(component.getProfileImageURL()).toBe(
      component.user.profilePictureURL
    );
  });

  it('should return the default picture URL when isEditing is true, removeCurrentProfile picture is false and the preview URL doesnt exist and user has no profile picture', () => {
    component.profPreviewURL = null;
    component.user = {} as any;
    component.isEditing = true;
    component.removeCurrentProfilePicture = false;
    expect(component.getProfileImageURL()).toBe(component.defaultProfileURL);
  });

  it('should return the users profile picture URL when isEditing is false, removeCurrentProfile picture is false and the preview URL doesnt exist but the user has a profile picture', () => {
    component.profPreviewURL = null;
    component.user = {
      profilePictureURL: 'someValidURL',
    } as any;
    component.isEditing = false;
    component.removeCurrentProfilePicture = false;
    expect(component.getProfileImageURL()).toBe(
      component.user.profilePictureURL
    );
  });

  it('should return the default picture URL when isEditing is false, removeCurrentProfile picture is false and the preview URL doesnt exist and user has no profile picture', () => {
    component.profPreviewURL = null;
    component.user = {} as any;
    component.isEditing = false;
    component.removeCurrentProfilePicture = false;
    expect(component.getProfileImageURL()).toBe(component.defaultProfileURL);
  });

  it('should set the remove flag when removeProfile is called', () => {
    component.removeCurrentProfilePicture = false;
    component.removeProfile();
    expect(component.removeCurrentProfilePicture).toBe(true);
  });

  it('should disable the remove flag when undoRemoveProfile is called', () => {
    component.removeCurrentProfilePicture = true;
    component.undoRemoveProfile();
    expect(component.removeCurrentProfilePicture).toBe(false);
  });

  it('should return null when getUpdatedProfileURL() is called if the removeCurrentProfile pciture condition is the first truthy', async () => {
    component.newProfilePicture = null;
    component.removeCurrentProfilePicture = true;
    expect(await component.getUpdatedProfileURL()).toBe(null);
  });

  it('should return the result of the storageServices upload when removeCurrentProfilePicture() is called and a new picture is submitted', async () => {
    component.newProfilePicture = 'somePicture';
    component.removeCurrentProfilePicture = false;
    component.storageService.uploadProfilePicture = async () => 'someValue';
    expect(await component.getUpdatedProfileURL()).toBe(
      await component.storageService.uploadProfilePicture(
        component.newProfilePicture
      )
    );
  });

  it('should return the users current profile picture if they are not removing it or selecting a new one', async () => {
    component.newProfilePicture = null;
    component.removeCurrentProfilePicture = false;
    component.user = { profilePictureURL: 'someURL' } as any;
    expect(await component.getUpdatedProfileURL()).toBe(
      component.user.profilePictureURL
    );
  });
});

function setup() {
  const auth = autoSpy(AuthenticationService);
  const fb = autoSpy(FormBuilder);
  const dialog = autoSpy(DialogCreatorService);
  const userService = autoSpy(UserService);
  const snackBar = autoSpy(SnackBarService);
  const prof = autoSpy(ProfileService);
  const textService = autoSpy(TextService);
  const timeService = autoSpy(TimeService);
  const storageService = autoSpy(StorageService);
  const builder = {
    auth,
    fb,
    dialog,
    userService,
    snackBar,
    prof,
    textService,
    timeService,
    default() {
      return builder;
    },
    build() {
      return new UserPropertiesComponent(
        auth,
        fb,
        dialog,
        userService,
        snackBar,
        prof,
        textService,
        timeService,
        storageService
      );
    },
  };

  return builder;
}
