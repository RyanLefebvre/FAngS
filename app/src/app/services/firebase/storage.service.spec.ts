/* eslint-disable @typescript-eslint/no-explicit-any */
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { autoSpy } from 'autoSpy';
import { SnackBarService } from 'src/app/shared-modules/material/snack-bar-manager.service';
import { TextService } from '../constants/text.service';
import { AuthenticationService } from './authentication.service';
import { StorageService } from './storage.service';

describe('StorageService', () => {
  let service: StorageService;

  beforeEach(() => {
    service = setup().default().build();
  });

  it('should upload the picture at the expected path with the authenticated usersID when uploadProfilePicture is called', () => {
    service.uploadImage = jasmine.createSpy();
    service.auth.getCurrentUserID = () => 'someCoolID';
    service.textService.text = {
      profilePicUploadFailed: 'someValue',
    } as any;
    const fakeFile = { someProperty: 'someValueForTheFakeFile' } as any;
    service.uploadProfilePicture(fakeFile);
    expect(service.uploadImage).toHaveBeenCalledWith(
      fakeFile,
      `/users/${service.auth.getCurrentUserID()}/profilePicture`,
      null,
      service.textService.text.profilePicUploadFailed
    );
  });

  it('should show a failure message and resolve to null if uploadImage errors out', async () => {
    const fakePath = 'somePathHere';
    const successMessage = 'someSuccessMessage';
    const failureMessage = 'someFailureMessage';
    const fakeFile = { someProperty: 'someValueForTheFakeFile' } as any;
    service.afStorage.ref = () => {
      return {} as any;
    };
    const resolvedTo = await service.uploadImage(
      fakeFile,
      fakePath,
      successMessage,
      failureMessage
    );
    expect(service.snackbarManager.showFailureMessage).toHaveBeenCalledWith(
      failureMessage
    );
    expect(resolvedTo).toBe(null);
  });

  it('should show a success message and resolve to the uploaded image URL if uploadImage is successful', async () => {
    const fakePath = 'somePathHere';
    const successMessage = 'someSuccessMessage';
    const failureMessage = 'someFailureMessage';
    const fakeFile = { someProperty: 'someValueForTheFakeFile' } as any;
    const expectedURL = 'someURL';
    service.afStorage.ref = () => {
      return {
        put: async () => {},
        getDownloadURL: () => {
          return {
            subscribe: (lam: Function) => {
              lam(expectedURL);
            },
          };
        },
      } as any;
    };
    const resolvedTo = await service.uploadImage(
      fakeFile,
      fakePath,
      successMessage,
      failureMessage
    );
    expect(service.snackbarManager.showSuccessMessage).toHaveBeenCalledWith(
      successMessage
    );
    expect(resolvedTo).toBe(expectedURL);
  });

  it('should NOT show a success message if the param is null and resolve to the uploaded image URL if uploadImage is successful', async () => {
    const fakePath = 'somePathHere';
    const successMessage = null;
    const failureMessage = 'someFailureMessage';
    const fakeFile = { someProperty: 'someValueForTheFakeFile' } as any;
    const expectedURL = 'someURL';
    service.afStorage.ref = () => {
      return {
        put: async () => {},
        getDownloadURL: () => {
          return {
            subscribe: (lam: Function) => {
              lam(expectedURL);
            },
          };
        },
      } as any;
    };
    const resolvedTo = await service.uploadImage(
      fakeFile,
      fakePath,
      successMessage,
      failureMessage
    );
    expect(service.snackbarManager.showSuccessMessage).not.toHaveBeenCalled();
    expect(resolvedTo).toBe(expectedURL);
  });
});

function setup() {
  const afStorage = autoSpy(AngularFireStorage);
  const snackbarManager = autoSpy(SnackBarService);
  const auth = autoSpy(AuthenticationService);
  const textService = autoSpy(TextService);
  const builder = {
    afStorage,
    snackbarManager,
    auth,
    textService,
    default() {
      return builder;
    },
    build() {
      jasmine.getEnv().allowRespy(true);
      return new StorageService(afStorage, snackbarManager, auth, textService);
    },
  };

  return builder;
}
