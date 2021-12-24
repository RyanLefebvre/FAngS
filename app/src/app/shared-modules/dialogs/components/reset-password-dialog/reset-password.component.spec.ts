/* eslint-disable @typescript-eslint/no-explicit-any */
import { AuthenticationService } from 'src/app/services/firebase/authentication.service';
import { SnackBarService } from 'src/app/shared-modules/material/snack-bar-manager.service';
import { autoSpy } from 'autoSpy';
import { TextService } from 'src/app/services/constants/text.service';
import { HttpService } from 'src/app/services/constants/http-service';
import { ResetPasswordComponent } from './reset-password.component';

describe('ResetPasswordComponent', () => {
  let component: ResetPasswordComponent;

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

  it('should send an email to the email passed in as data when attemptToSendResetEmail() is called', async () => {
    component.data['email'] = 'JeffNippard@kiwi.com';
    component.auth.afAuth = {
      sendPasswordResetEmail: (someEmail) => {
        expect(someEmail).toBe(component.data.email);
      },
    } as any;
    await component.attemptToSendResetEmail();
    expect(component.snackbar.showSuccessMessage).toHaveBeenCalled();
  });

  it('should show an error message if a call to attemptToSendResetEmail() errors out and the error has no code', async () => {
    component.data['email'] = 'LexFridman@mit.edu';
    component.auth.afAuth = {
      auth: {
        sendPasswordResetEmail: jasmine.createSpy().and.throwError('someError'),
      },
    } as any;
    await component.attemptToSendResetEmail();
    expect(component.snackbar.showFailureMessage).toHaveBeenCalled();
  });

  it('should show an error message if a call to attemptToSendResetEmail() errors out and the user email is not found', async () => {
    component.data['email'] = 'Spongebob@krusty.krab';
    component.auth.afAuth = {
      auth: {
        sendPasswordResetEmail: jasmine.createSpy().and.callFake(() => {
          throw {
            name: 'User not found',
            code: 'auth/user-not-found',
            message: 'no message here',
          };
        }),
      },
    } as any;
    await component.attemptToSendResetEmail();
    expect(component.snackbar.showFailureMessage).toHaveBeenCalled();
  });

  it('should show an error message if a call to attemptToSendResetEmail() errors out and the user email is invalid', async () => {
    component.data['email'] = 'HB@Burisma.org';
    component.auth.afAuth = {
      auth: {
        sendPasswordResetEmail: jasmine.createSpy().and.callFake(() => {
          throw {
            name: 'User email invalid',
            code: 'auth/invalid-email',
            message: 'no message here',
          };
        }),
      },
    } as any;
    await component.attemptToSendResetEmail();
    expect(component.snackbar.showFailureMessage).toHaveBeenCalled();
  });
});

function setup() {
  const data = {};
  const dialogRef = {
    disableClose: false,
    close: jasmine.createSpy(),
  } as any;
  const auth = autoSpy(AuthenticationService);
  const snackbar = autoSpy(SnackBarService);
  const textService = new TextService();
  const http = new HttpService();
  const builder = {
    data,
    dialogRef,
    auth,
    snackbar,
    textService,
    http,
    default() {
      return builder;
    },
    build() {
      return new ResetPasswordComponent(
        data,
        dialogRef,
        auth,
        snackbar,
        textService,
        http
      );
    },
  };

  return builder;
}
