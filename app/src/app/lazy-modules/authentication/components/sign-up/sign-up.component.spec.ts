/* eslint-disable @typescript-eslint/no-explicit-any */
import { DialogCreatorService } from 'src/app/shared-modules/dialogs/services/dialog-creator.service';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from 'src/app/services/firebase/authentication.service';
import { SignUpComponent } from './sign-up.component';
import { autoSpy } from 'autoSpy';
import { RoutesService } from 'src/app/services/constants/routes.service';
import { TextService } from 'src/app/services/constants/text.service';
import { TimeService } from 'src/app/services/util/time-constant.service';
import { UserService } from 'src/app/services/firebase/user.service';
import { SnackBarService } from 'src/app/shared-modules/material/snack-bar-manager.service';

describe('SignUpComponent', () => {
  let component: SignUpComponent;

  beforeEach(() => {
    component = setup().default().build();
    component.registerForm = {
      controls: {
        [component.FORM_CONTROL_USERNAME]: { value: null },
        [component.FORM_CONTROL_PASSWORD]: { value: null },
        [component.FORM_CONTROL_PASSWORD_CONFIRMATION]: { value: null },
        [component.FORM_CONTROL_EMAIL]: { value: null },
        [component.FORM_CONTROL_AGREE_TO_TERMS]: { value: null },
        [component.FORM_CONTROL_HEARD_ABOUT]: { value: null },
      },
    } as any;
  });

  it('should not crash when ngOnInit is called', () => {
    let crashed = false;
    try {
      component.ngOnInit();
    } catch {
      crashed = true;
    }
    expect(crashed).toBe(false);
  });

  it('should successfully create a new user when handleSubmit is called and checkThatPassWordsMatch returns true', async () => {
    const createUserSpy: jasmine.Spy<(user) => void> = spyOn(
      component.userServiceService,
      'createUserProfile'
    );
    spyOn(component, 'checkThatPassWordsMatch').and.returnValue(true);
    component.registerForm = {
      controls: {
        [component.FORM_CONTROL_USERNAME]: { value: 'someName' },
        [component.FORM_CONTROL_PASSWORD]: { value: 'password' },
        [component.FORM_CONTROL_PASSWORD_CONFIRMATION]: { value: 'password' },
        [component.FORM_CONTROL_EMAIL]: { value: 'test@example.com' },
        [component.FORM_CONTROL_AGREE_TO_TERMS]: { value: true },
        [component.FORM_CONTROL_HEARD_ABOUT]: { value: "some way I've heard" },
      },
    } as any;
    component.showSpinner = false;
    let logicRef;
    component.dialogService.openWaitForOperationDialog = async (someLamda) => {
      logicRef = someLamda;
      return true as any;
    };
    component.timeService.getTimeStamp = () => 1;
    await component.handleSubmit();
    await logicRef();
    expect(component.showSpinner).toBe(true);
    expect(createUserSpy).toHaveBeenCalledWith({
      uid: null,
      username: 'someName',
      email: 'test@example.com',
      password: 'password',
      dateCreated: 1,
      heardAboutUs: "some way I've heard",
    });
  });

  it('should show an error if there is not a successful sign up after the dialog is opened', async () => {
    spyOn(component.userServiceService, 'createUserProfile');
    spyOn(component, 'checkThatPassWordsMatch').and.returnValue(true);
    spyOn(component, 'updateUiForRegisterError');
    component.registerForm = {
      controls: {
        [component.FORM_CONTROL_USERNAME]: { value: 'someName' },
        [component.FORM_CONTROL_PASSWORD]: { value: 'password' },
        [component.FORM_CONTROL_PASSWORD_CONFIRMATION]: { value: 'password' },
        [component.FORM_CONTROL_EMAIL]: { value: 'test@example.com' },
        [component.FORM_CONTROL_AGREE_TO_TERMS]: { value: true },
        [component.FORM_CONTROL_HEARD_ABOUT]: { value: "some way I've heard" },
      },
    } as any;
    let logicRef;
    component.dialogService.openWaitForOperationDialog = async (someLamda) => {
      logicRef = someLamda;
      return {
        error: {
          message: 'Oh no something bad happened!',
        },
        code: 500,
      } as any;
    };
    await component.handleSubmit();
    await logicRef();
    expect(component.updateUiForRegisterError).toHaveBeenCalled();
  });

  it('should show an error if there is not a successful sign up after the dialog is opened because of a reaky errir', async () => {
    spyOn(component.userServiceService, 'createUserProfile');
    spyOn(component, 'checkThatPassWordsMatch').and.returnValue(true);
    spyOn(component, 'updateUiForRegisterError');
    component.registerForm = {
      controls: {
        [component.FORM_CONTROL_USERNAME]: { value: 'someName' },
        [component.FORM_CONTROL_PASSWORD]: { value: 'password' },
        [component.FORM_CONTROL_PASSWORD_CONFIRMATION]: { value: 'password' },
        [component.FORM_CONTROL_EMAIL]: { value: 'test@example.com' },
        [component.FORM_CONTROL_AGREE_TO_TERMS]: { value: true },
        [component.FORM_CONTROL_HEARD_ABOUT]: { value: "some way I've heard" },
      },
    } as any;
    component.dialogService.openWaitForOperationDialog = async (
      someLamda
    ): Promise<any> => {
      (someLamda as any)()(); // curry lambda will cause real error since it doesn't return a function
    };
    await component.handleSubmit();
    expect(component.updateUiForRegisterError).toHaveBeenCalled();
  });

  it('should not submit the register form if the passwords do not match', async () => {
    spyOn(component, 'checkThatPassWordsMatch').and.returnValue(false);
    const createUserSpy: jasmine.Spy<(user) => void> = spyOn(
      component.userServiceService,
      'createUserProfile'
    );
    await component.handleSubmit();
    expect(createUserSpy).not.toHaveBeenCalled();
  });

  it('should create and return a UserProfile with the information from the form when convertResultsToModel() is called ', () => {
    const heardAboutUs = 'some way that they heard about us';
    component.registerForm = {
      controls: {
        [component.FORM_CONTROL_USERNAME]: { value: 'username' },
        [component.FORM_CONTROL_PASSWORD]: { value: 'password' },
        [component.FORM_CONTROL_PASSWORD_CONFIRMATION]: { value: 'password' },
        [component.FORM_CONTROL_EMAIL]: { value: 'test@example.com' },
        [component.FORM_CONTROL_AGREE_TO_TERMS]: { value: null },
        [component.FORM_CONTROL_HEARD_ABOUT]: { value: heardAboutUs },
      },
    } as any;
    const newUser = component.convertResultsToModel();
    expect(newUser.username).toBe('username');
    expect(newUser.email).toBe('test@example.com');
    expect(newUser.heardAboutUs).toBe(heardAboutUs);
  });

  it('should create and return a UserProfile with the information from the form even if all the values are null when convertResultsToModel() is called ', () => {
    component.registerForm = {
      controls: {
        [component.FORM_CONTROL_USERNAME]: { value: null },
        [component.FORM_CONTROL_PASSWORD]: { value: null },
        [component.FORM_CONTROL_PASSWORD_CONFIRMATION]: { value: null },
        [component.FORM_CONTROL_EMAIL]: { value: null },
        [component.FORM_CONTROL_AGREE_TO_TERMS]: { value: null },
        [component.FORM_CONTROL_HEARD_ABOUT]: { value: null },
      },
    } as any;
    const newUser = component.convertResultsToModel();
    expect(newUser.username).toBe(null);
    expect(newUser.email).toBe(null);
    expect(newUser.heardAboutUs).toBe(null);
  });

  it('should return true if the value of the password and password confirmation forms match', () => {
    component.registerForm = {
      controls: {
        [component.FORM_CONTROL_USERNAME]: { value: null },
        [component.FORM_CONTROL_PASSWORD]: { value: 'password' },
        [component.FORM_CONTROL_PASSWORD_CONFIRMATION]: { value: 'password' },
        [component.FORM_CONTROL_EMAIL]: { value: 'test@example.com' },
        [component.FORM_CONTROL_AGREE_TO_TERMS]: { value: null },
        [component.FORM_CONTROL_HEARD_ABOUT]: { value: null },
      },
    } as any;
    expect(component.checkThatPassWordsMatch()).toBe(true);
  });

  it('should return false if the value of the password and password confirmation forms match', () => {
    component.registerForm = {
      controls: {
        [component.FORM_CONTROL_USERNAME]: { value: null },
        [component.FORM_CONTROL_PASSWORD]: { value: 'password' },
        [component.FORM_CONTROL_PASSWORD_CONFIRMATION]: {
          value: 'password123',
        },
        [component.FORM_CONTROL_EMAIL]: { value: 'test@example.com' },
        [component.FORM_CONTROL_AGREE_TO_TERMS]: { value: null },
        [component.FORM_CONTROL_HEARD_ABOUT]: { value: null },
      },
    } as any;
    expect(component.checkThatPassWordsMatch()).toBe(false);
  });

  it('should open the terms dialog when open terms is called', () => {
    component.openTerms();
    expect(component.dialogService.openTermsDialog).toHaveBeenCalled();
  });

  it('should return true when userAgreesToTerms is called and the user agreed to the terms', () => {
    component.registerForm = {
      controls: {
        [component.FORM_CONTROL_USERNAME]: { value: null },
        [component.FORM_CONTROL_PASSWORD]: { value: 'password' },
        [component.FORM_CONTROL_PASSWORD_CONFIRMATION]: { value: 'password' },
        [component.FORM_CONTROL_EMAIL]: { value: 'test@example.com' },
        [component.FORM_CONTROL_AGREE_TO_TERMS]: { value: true },
        [component.FORM_CONTROL_HEARD_ABOUT]: { value: null },
      },
    } as any;
    expect(component.userAgreesToTerms()).toBe(true);
  });

  it('should return false when userAgreesToTerms is called and the user did not agree to the terms', () => {
    component.registerForm = {
      controls: {
        [component.FORM_CONTROL_USERNAME]: { value: null },
        [component.FORM_CONTROL_PASSWORD]: { value: 'password' },
        [component.FORM_CONTROL_PASSWORD_CONFIRMATION]: { value: 'password' },
        [component.FORM_CONTROL_EMAIL]: { value: 'test@example.com' },
        [component.FORM_CONTROL_AGREE_TO_TERMS]: { value: false },
        [component.FORM_CONTROL_HEARD_ABOUT]: { value: null },
      },
    } as any;
    expect(component.userAgreesToTerms()).toBe(false);
  });

  it('should return true when hasErrorMessage is called if the errorMessage is not an empty string or null, false otherwise', () => {
    component.errorMessage = 'someValidMessage';
    expect(component.hasErrorMessage()).toBe(true);
    component.errorMessage = '';
    expect(component.hasErrorMessage()).toBe(false);
    component.errorMessage = null;
    expect(component.hasErrorMessage()).toBe(false);
  });

  it("should set the error message to the passed in error message, set the spinner to false and show the 'failed to create account' message when updateUiForRegisterError", () => {
    component.errorMessage = 'old';
    component.showSpinner = true;
    component.updateUiForRegisterError('new');
    expect(component.errorMessage).toBe('new');
    expect(component.showSpinner).toBe(false);
    expect(component.snackbar.showFailureMessage).toHaveBeenCalledWith(
      component.textService.text.failedToCreateAccount
    );
  });
});

function setup() {
  const dialogService = autoSpy(DialogCreatorService);
  const fb = autoSpy(FormBuilder);
  const authManager = autoSpy(AuthenticationService);
  const route = autoSpy(ActivatedRoute);
  const routesService = autoSpy(RoutesService);
  // easier not to mock
  const textService = new TextService();
  const timeService = autoSpy(TimeService);
  const userService = autoSpy(UserService);
  const snackbar = autoSpy(SnackBarService);
  const builder = {
    dialogService,
    fb,
    authManager,
    route,
    routesService,
    textService,
    timeService,
    userService,
    snackbar,
    default() {
      return builder;
    },
    build() {
      return new SignUpComponent(
        dialogService,
        fb,
        authManager,
        route,
        routesService,
        textService,
        timeService,
        userService,
        snackbar
      );
    },
  };
  jasmine.getEnv().allowRespy(true);
  return builder;
}
