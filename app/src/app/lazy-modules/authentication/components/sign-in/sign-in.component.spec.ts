/* eslint-disable @typescript-eslint/no-explicit-any */
import { AuthenticationService } from 'src/app/services/firebase/authentication.service';
import { FormBuilder } from '@angular/forms';
import { DialogCreatorService } from 'src/app/shared-modules/dialogs/services/dialog-creator.service';
import { RoutesService } from 'src/app/services/constants/routes.service';
import { SignInComponent } from './sign-in.component';
import { autoSpy } from 'autoSpy';
import { Subscription } from 'rxjs';

describe('SignInComponent', () => {
  let component: SignInComponent;
  const email = 'test@example.com';
  const password = 'password';

  beforeEach(() => {
    component = setup().default().build();
    component.authenticateForm = {
      controls: {
        [component.FORM_CONTROL_USERNAME]: { value: email },
        [component.FORM_CONTROL_PASSWORD]: { value: password },
      },
    } as any;
    component.authService = {
      eventAuthError: {
        subscribe: () => {},
      },
      login: () => {},
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

  it('should not crash when ngOnDestroy is called', () => {
    let crashed = false;
    try {
      component.ngOnDestroy();
    } catch {
      crashed = true;
    }
    expect(crashed).toBe(false);
  });

  it('should kill the myErrorSubscription when ngOnDestroy is called', () => {
    component.myErrorSubscription = new Subscription();
    const unsubSpy: jasmine.Spy<() => void> = spyOn(
      component.myErrorSubscription,
      'unsubscribe'
    );
    component.ngOnDestroy();
    expect(unsubSpy).toHaveBeenCalled();
  });

  it('should not unsubscribe from myErrorSubscription if myErrorSubscription is null when ngOnDestroy is called', () => {
    component.myErrorSubscription = new Subscription();
    const unsubSpy: jasmine.Spy<() => void> = spyOn(
      component.myErrorSubscription,
      'unsubscribe'
    );
    component.myErrorSubscription = null;
    let crashed = false;
    try {
      component.ngOnDestroy;
    } catch {
      crashed = true;
    }
    expect(crashed).toBe(false);
    expect(unsubSpy).not.toHaveBeenCalled();
  });

  it('should subscribe to errors from firebase when errorSubscription is called', () => {
    let lambdaRef;
    component.authService.eventAuthError = {
      subscribe: (errorMSG) => {
        lambdaRef = errorMSG;
      },
    } as any;
    component.errorSubscription();
    lambdaRef('error');
    expect(component.showSpinner).toBe(false);
    expect(component.errorMessage).toEqual('error');
    expect(component.showErrorMessage).toBe(true);
    expect(component.showReset).toBe(true);
  });

  it('should extract email and username from form controls and try to authenticate user when handleSubmit is called', () => {
    component.showSpinner = false;
    const logInSpy: jasmine.Spy<(email, password) => void> = spyOn(
      component.authService,
      'login'
    );
    component.handleSubmit();
    expect(component.showSpinner).toBe(true);
    expect(logInSpy).toHaveBeenCalledWith(email, password);
  });

  it('should extract email and username from form controls and try to authenticate user when handleSubmit is called even if they are null', () => {
    component.showSpinner = false;
    const logInSpy: jasmine.Spy<(email, password) => void> = spyOn(
      component.authService,
      'login'
    );
    component.authenticateForm = {
      controls: {
        [component.FORM_CONTROL_USERNAME]: { value: null },
        [component.FORM_CONTROL_PASSWORD]: { value: null },
      },
    } as any;
    component.handleSubmit();
    expect(component.showSpinner).toBe(true);
    expect(logInSpy).toHaveBeenCalledWith(null, null);
  });

  it('should open the password reset dialog if a valid email has been entered into the form when resetPassword is called', () => {
    component.resetPassword();
    expect(
      component.dialogManager.openPasswordResetDialog
    ).toHaveBeenCalledWith(email);
  });

  it('should not open the password reset dialog and instead display an error message if an invalid email has been entered into the form when reset password is called', () => {
    component.authenticateForm = {
      controls: {
        [component.FORM_CONTROL_USERNAME]: { value: 'kdshfodiwhf0we93' },
        [component.FORM_CONTROL_PASSWORD]: { value: password },
      },
    } as any;
    component.resetPassword();
    expect(
      component.dialogManager.openPasswordResetDialog
    ).not.toHaveBeenCalled();
    expect(component.errorMessage).toEqual(
      component.textService.text.enterValidEmailToReset
    );
  });
});

function setup() {
  const authService = autoSpy(AuthenticationService);
  const fb = autoSpy(FormBuilder);
  const dialogManager = autoSpy(DialogCreatorService);
  const routesService = autoSpy(RoutesService);
  const textService = {
    text: {
      // easier to just 'spy/mock' it here since it
      // needs to be available to set state variables
      noIdeaWhatWentWrongErrorMessage: 'someMessage',
      enterValidEmailToReset: 'enterValidEmailtoReset',
    },
  } as any;
  const builder = {
    authService,
    fb,
    dialogManager,
    routesService,
    textService,
    default() {
      return builder;
    },
    build() {
      return new SignInComponent(
        authService,
        fb,
        dialogManager,
        routesService,
        textService
      );
    },
  };

  return builder;
}
