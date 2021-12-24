/* eslint-disable @typescript-eslint/no-explicit-any */
import { AuthenticationService } from 'src/app/services/firebase/authentication.service';
import { FormBuilder } from '@angular/forms';
import { SnackBarService } from 'src/app/shared-modules/material/snack-bar-manager.service';
import { ReauthenticateDialogComponent } from './reauthenticate-dialog.component';
import { autoSpy } from 'autoSpy';
import { TextService } from 'src/app/services/constants/text.service';
import { HttpService } from 'src/app/services/constants/http-service';
import firebase from 'firebase/compat/app';

describe('ReAuthenticateDialogComponent', () => {
  let component: ReauthenticateDialogComponent;

  beforeEach(() => {
    const { build } = setup().default();
    component = build();
    jasmine.clock().install();
  });

  afterEach(() => {
    jasmine.clock().uninstall();
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

  it('should close the dialog with the authentication result whenever closeDialog() is called ', () => {
    const result = 'someResult' as any;
    component.closeDialog(result);
    expect(component.dialogRef.close).toHaveBeenCalledWith(result);
  });

  it('should show a success message and close the dialog with true as the result when the user reauthenticates successfully and handlesubmit() is called ', async () => {
    component.closeDialog = jasmine.createSpy();
    component.authenticateForm = {
      controls: {
        [component.FORM_CONTROL_USERNAME]: { value: 'someUserName' },
        [component.FORM_CONTROL_PASSWORD]: { value: 'somePassword' },
      },
    } as any;
    component.authService.afAuth = {
      currentUser: {
        reauthenticateWithCredential: jasmine.createSpy(),
      },
    } as any;
    firebase.auth = {
      EmailAuthProvider: {
        credential: () => 'someValue',
      },
    } as any;
    await component.handleSubmit();
    expect(component.snackbar.showSuccessMessage).toHaveBeenCalledWith(
      component.textService.text.reauthenticationSuccess
    );
    expect(component.closeDialog).toHaveBeenCalledWith(true);
  });

  it('should show an error message, turn the spinner off, enable closing and show a failure message snackbar after the timeout if handleSubmit() errors out without a code', async () => {
    component.closeDialog = jasmine.createSpy();
    component.authenticateForm = {
      controls: {
        [component.FORM_CONTROL_USERNAME]: { value: 'someUserName' },
        [component.FORM_CONTROL_PASSWORD]: { value: 'somePassword' },
      },
    } as any;
    component.authService.afAuth = {
      currentUser: {
        reauthenticateWithCredential: jasmine.createSpy().and.callFake(() => {
          throw {
            name: 'myError with message',
            message: 'My error message',
          };
        }),
      },
    } as any;
    firebase.auth = {
      EmailAuthProvider: {
        credential: () => 'someValue',
      },
    } as any;
    await component.handleSubmit();
    jasmine.clock().tick(600);
    expect(component.showErrorMessage).toBe(true);
    expect(component.snackbar.showFailureMessage).toHaveBeenCalledWith(
      component.textService.text.reauthenticationFailure
    );
  });
});

function setup() {
  const authService = autoSpy(AuthenticationService);
  const fb = autoSpy(FormBuilder);
  const snackbar = autoSpy(SnackBarService);
  const data = {};
  const dialogRef = {
    disableClose: false,
    close: jasmine.createSpy(),
  } as any;
  const textService = new TextService();
  const httpService = new HttpService();
  const builder = {
    authService,
    fb,
    snackbar,
    data,
    dialogRef,
    textService,
    httpService,
    default() {
      return builder;
    },
    build() {
      return new ReauthenticateDialogComponent(
        authService,
        fb,
        snackbar,
        data,
        dialogRef,
        textService,
        httpService
      );
    },
  };

  return builder;
}
