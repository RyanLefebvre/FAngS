/* eslint-disable @typescript-eslint/no-explicit-any */
import { MatDialog } from '@angular/material/dialog';
import { autoSpy } from 'autoSpy';
import { TextService } from 'src/app/services/constants/text.service';
import { AuthenticationService } from 'src/app/services/firebase/authentication.service';
import { UserService } from 'src/app/services/firebase/user.service';
import { UserProfile } from '../../../../../../shared/classes/user-profile';
import { ConfirmationDialogComponent } from '../components/confirmation-dialog/confirmation-dialog.component';
import { ReauthenticateDialogComponent } from '../components/reauthenticate-dialog/reauthenticate-dialog.component';
import { ResetPasswordComponent } from '../components/reset-password-dialog/reset-password.component';
import { TermsDialogComponent } from '../components/terms-dialog/terms-dialog.component';
import { WaitForOperationDialog } from '../components/wait-for-operation-dialog/wait-for-operation-dialog.component';
import { DialogCreatorService } from './dialog-creator.service';

describe('DialogCreatorService', () => {
  let dialogCreator: DialogCreatorService;

  beforeEach(() => {
    const { build } = setup().default();
    dialogCreator = build();
  });

  it('should return getDialogDataOptions(null) if getDefaultDialogOptions() is called ', () => {
    const expectedRetVal: any = 'someRandomValue';
    dialogCreator.getDialogDataOptions = (someVal): any => {
      if (someVal == null) {
        return expectedRetVal;
      } else {
        return 'someValueWeArentExpecting';
      }
    };
    const actualRetVal = dialogCreator.getDefaultDialogOptions();
    expect(actualRetVal).toBe(expectedRetVal);
  });

  it('should make the class full bleed in getDialogDataOptions() if fullBleed is true ', () => {
    const actualRetVal = dialogCreator.getDialogDataOptions({}, true);
    expect(actualRetVal.panelClass).toBe('app-full-bleed-dialog');
  });

  it('should NOT make the class full bleed in getDialogDataOptions() if fullBleed is falsy ', () => {
    const actualRetVal = dialogCreator.getDialogDataOptions({});
    expect(actualRetVal.panelClass).not.toBe('app-full-bleed-dialog');
  });

  it('should return anobject with an empty data property if getDefaultDialogOptions() is called ', () => {
    expect(dialogCreator.getDefaultDialogOptions().data).toEqual({});
  });

  it('should open the terms dialog with the default options when openTermsDialog() is called ', () => {
    const defaultOpts: any = { someVal: 'someProp' };
    dialogCreator.getDefaultDialogOptions = () => defaultOpts;
    dialogCreator.dialog = {
      open: jasmine.createSpy(),
    } as any;
    dialogCreator.openTermsDialog();
    expect(dialogCreator.dialog.open).toHaveBeenCalledWith(
      TermsDialogComponent,
      defaultOpts
    );
  });

  it('should open the password reset dialog with whatever email is passed in when openPasswordResetDialog() is called ', () => {
    const expectedEmail = 'JoeRogan@ChimpsDoingDMT.com';
    const expectedOpts: any = { email: expectedEmail };
    dialogCreator.getDialogDataOptions = (someData) => {
      if (someData.email && someData.email == expectedEmail) {
        return expectedOpts;
      } else {
        return null;
      }
    };
    dialogCreator.dialog = { open: jasmine.createSpy() } as any;
    dialogCreator.openPasswordResetDialog(expectedEmail);
    expect(dialogCreator.dialog.open).toHaveBeenCalledWith(
      ResetPasswordComponent,
      expectedOpts
    );
  });

  it('should open the reAuthenticationDialog with the passed in operation message when openReauthDialog() is called  ', () => {
    dialogCreator.dialog.open = jasmine.createSpy().and.callFake(() => {
      return {
        afterClosed: () => {
          return {
            subscribe: () => {},
          };
        },
      };
    });

    const expectedData = 'someExpectedData' as any;
    dialogCreator.getDialogDataOptions = (someData) => {
      if (someData && someData.operationMessage == expectedData) {
        return expectedData;
      } else {
        return null;
      }
    };
    dialogCreator.openReauthDialog(expectedData);
    expect(dialogCreator.dialog.open).toHaveBeenCalledWith(
      ReauthenticateDialogComponent,
      expectedData
    );
  });

  it('should resolve to true when openReAuthDialog is called if the user reauthenticates successfully  ', async () => {
    let callBackRef: (someVal: boolean) => void = null;
    dialogCreator.dialog.open = jasmine.createSpy().and.callFake(() => {
      return {
        afterClosed: () => {
          return {
            subscribe: (subBody) => {
              callBackRef = subBody;
            },
          };
        },
      };
    });

    const expectedData = 'someExpectedData' as any;
    dialogCreator.getDialogDataOptions = (someData) => {
      if (someData && someData.operationMessage == expectedData) {
        return expectedData;
      } else {
        return null;
      }
    };
    const refToPromise = dialogCreator.openReauthDialog(expectedData);
    callBackRef(true);
    refToPromise.then((authenticated) => {
      expect(authenticated).toBe(true);
    });
  });

  it('should resolve to false when openReAuthDialog is called if the user DOES NOT reauthenticates successfully  ', async () => {
    let callBackRef: (someVal: boolean) => void = null;
    dialogCreator.dialog.open = jasmine.createSpy().and.callFake(() => {
      return {
        afterClosed: () => {
          return {
            subscribe: (subBody) => {
              callBackRef = subBody;
            },
          };
        },
      };
    });

    const expectedData = 'someExpectedData' as any;
    dialogCreator.getDialogDataOptions = (someData) => {
      if (someData && someData.operationMessage == expectedData) {
        return expectedData;
      } else {
        return null;
      }
    };
    const refToPromise = dialogCreator.openReauthDialog(expectedData);
    callBackRef(false);
    refToPromise.then((authenticated) => {
      expect(authenticated).toBe(false);
    });
  });

  it('should resolve to false when openReAuthDialog is called if there is an error  ', async () => {
    dialogCreator.dialog.open = jasmine
      .createSpy()
      .and.throwError('some error');
    const refToPromise = dialogCreator.openReauthDialog(null);
    refToPromise.then((authenticated) => {
      expect(authenticated).toBe(false);
    });
  });

  it('should open the confirmation dialog with the params passed in when openConfirmationDialog() is called ', () => {
    const title = 'someRandomTitle';
    const message = 'someRandomMessage';
    const confLogic = 'someVal' as any;
    const spinMsg = 'someMessage';
    const expectedOpts = 'someExpectedOpts' as any;
    dialogCreator.getDialogDataOptions = (params) => {
      const hasTitle = params.title && params.title == title;
      const hasMessage = params.message && params.message == message;
      const hasLogic =
        params.confirmationLogic && params.confirmationLogic == confLogic;
      const hasSpinMsg =
        params.spinnerMessage && params.spinnerMessage == spinMsg;
      const passedInCorrectly =
        hasTitle && hasMessage && hasLogic && hasSpinMsg;
      if (passedInCorrectly) {
        return expectedOpts;
      } else {
        return null;
      }
    };
    dialogCreator.dialog = { open: jasmine.createSpy() } as any;
    dialogCreator.openConfirmationDialog(title, message, confLogic, spinMsg);
    expect(dialogCreator.dialog.open).toHaveBeenCalledWith(
      ConfirmationDialogComponent,
      expectedOpts
    );
  });

  it('should open the confirmation dialog with the params passed in when openConfirmationDialog() is called and call OnClose if its defined ', () => {
    const title = 'someRandomTitle';
    const message = 'someRandomMessage';
    const confLogic = 'someVal' as any;
    const spinMsg = 'someMessage';
    const expectedOpts = 'someExpectedOpts' as any;
    const onClose = jasmine.createSpy();
    dialogCreator.getDialogDataOptions = (params) => {
      const hasTitle = params.title && params.title == title;
      const hasMessage = params.message && params.message == message;
      const hasLogic =
        params.confirmationLogic && params.confirmationLogic == confLogic;
      const hasSpinMsg =
        params.spinnerMessage && params.spinnerMessage == spinMsg;
      const passedInCorrectly =
        hasTitle && hasMessage && hasLogic && hasSpinMsg;
      if (passedInCorrectly) {
        return expectedOpts;
      } else {
        return null;
      }
    };
    dialogCreator.dialog = {
      open: jasmine.createSpy().and.returnValue({
        afterClosed: () => {
          return {
            subscribe: (lam) => lam(),
          };
        },
      }),
    } as any;
    dialogCreator.openConfirmationDialog(
      title,
      message,
      confLogic,
      spinMsg,
      onClose
    );
    expect(dialogCreator.dialog.open).toHaveBeenCalledWith(
      ConfirmationDialogComponent,
      expectedOpts
    );
    expect(onClose).toHaveBeenCalled();
  });

  it('should open the waitForOperationDialog when openWaitForOperationDialog() is called ', async () => {
    let subBodyRef = null;
    dialogCreator.dialog.open = jasmine.createSpy().and.callFake(() => {
      return {
        afterClosed: () => {
          return {
            subscribe: (lambda) => {
              subBodyRef = lambda;
            },
          };
        },
      };
    });
    const fakeDataOptions = 'someRandomValue' as any;
    const expectedLogic: () => any = () => 'something';
    const expectedOperationName = 'myFunction';
    const expectedIcon = 'someIcon';
    const expectedMessage = 'my spinner message';
    dialogCreator.getDialogDataOptions = (someObj: any) => {
      expect(someObj.logic).toBe(expectedLogic);
      expect(someObj.operationName).toBe(expectedOperationName);
      expect(someObj.matIcon).toBe(expectedIcon);
      expect(someObj.spinnerMessage).toBe(expectedMessage);
      return fakeDataOptions;
    };
    const returnPromise = dialogCreator.openWaitForOperationDialog(
      expectedLogic,
      expectedOperationName,
      expectedIcon,
      expectedMessage
    );
    subBodyRef(expectedLogic());
    const successfulReturn = await returnPromise;
    expect(successfulReturn).toBe('something' as any);
    expect(dialogCreator.dialog.open).toHaveBeenCalledWith(
      WaitForOperationDialog,
      fakeDataOptions
    );
  });

  it('should open the confirmation dialog and pass in a lambda that will delete the user profile when openDeleteProfileDialog is called ', async () => {
    let shouldWaitForLogic;
    let onCloseLogic;
    dialogCreator.openConfirmationDialog = (
      title,
      message,
      lam,
      spinnerMessage,
      onClose
    ) => {
      shouldWaitForLogic = lam;
      onCloseLogic = onClose;
    };
    const fakeUser = {
      uid: 'someUid',
    } as UserProfile;
    dialogCreator.openDeleteProfileDialog(fakeUser);
    await shouldWaitForLogic();
    expect(dialogCreator.userService.deleteUserProfile).toHaveBeenCalledWith(
      fakeUser.uid
    );
    await onCloseLogic();
    expect(dialogCreator.authService.logOutGoHome).toHaveBeenCalled();
  });
});

function setup() {
  const dialog = autoSpy(MatDialog);
  const userService = autoSpy(UserService);
  const textService = new TextService();
  const auth = autoSpy(AuthenticationService);
  const builder = {
    dialog,
    userService,
    textService,
    default() {
      return builder;
    },
    build() {
      return new DialogCreatorService(dialog, userService, textService, auth);
    },
  };

  return builder;
}
