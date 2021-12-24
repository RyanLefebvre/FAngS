/* eslint-disable @typescript-eslint/no-explicit-any */
import { AngularFireFunctions } from '@angular/fire/compat/functions';
import { CallableWrapperService } from './callable-wrapper.service';
import { autoSpy } from 'autoSpy';
import { SnackBarService } from 'src/app/shared-modules/material/snack-bar-manager.service';
import { HttpService } from '../constants/http-service';

describe('CallableWrapperService', () => {
  let service: CallableWrapperService;

  beforeEach(() => {
    service = setup().default().build();
  });

  it('should show a success message on a successful request for a callable cloud function', async () => {
    service.fireFunc = {
      httpsCallable: () => () => {
        return {
          toPromise: () => {
            return {
              data: {},
              error: null,
              code: 200,
            };
          },
        };
      },
    } as any;
    await service.firebaseCloudFunction(
      'someFunc',
      { someProperty: 'someValue' },
      'success',
      'fail'
    );
    expect(service.snackBarManager.showSuccessMessage).toHaveBeenCalled();
  });

  it('should NOT show a success message on a successful request for a callable cloud function if dontShowMessage is truthy', async () => {
    service.fireFunc = {
      httpsCallable: () => () => {
        return {
          toPromise: () => {
            return {
              data: {},
              error: null,
              code: 200,
            };
          },
        };
      },
    } as any;
    await service.firebaseCloudFunction(
      'someFunc',
      { someProperty: 'someValue' },
      'success',
      'fail',
      true
    );
    expect(service.snackBarManager.showSuccessMessage).not.toHaveBeenCalled();
  });

  it('should show a failure message on a successful request that returns an error for a callable cloud function', async () => {
    service.fireFunc = {
      httpsCallable: () => () => {
        return {
          toPromise: () => {
            return {
              data: null,
              error: {
                message: 'oh no',
              },
              code: 500,
            };
          },
        };
      },
    } as any;
    await service.firebaseCloudFunction(
      'someFunc',
      { someProperty: 'someValue' },
      'success',
      'fail'
    );
    expect(service.snackBarManager.showFailureMessage).toHaveBeenCalled();
  });

  it('should NOT show a failure message on a successful request that returns an error for a callable cloud function if dontShowMessage is truthy', async () => {
    service.fireFunc = {
      httpsCallable: () => () => {
        return {
          toPromise: () => {
            return {
              data: null,
              error: {
                message: 'oh no',
              },
              code: 500,
            };
          },
        };
      },
    } as any;
    await service.firebaseCloudFunction(
      'someFunc',
      { someProperty: 'someValue' },
      'success',
      'fail',
      true
    );
    expect(service.snackBarManager.showFailureMessage).not.toHaveBeenCalled();
  });

  it('should show a failure message on a request that errors out for a callable cloud function with no code', async () => {
    service.fireFunc = {
      httpsCallable: () => {
        return {
          objectWithoutNeededProperties: 'anyValue',
        };
      },
    } as any;
    await service.firebaseCloudFunction(
      'someFunc',
      { someProperty: 'someValue' },
      'success',
      'fail'
    );
    expect(service.snackBarManager.showFailureMessage).toHaveBeenCalled();
  });

  it('should show a failure message on a request that errors out for a callable cloud function with code', async () => {
    service.fireFunc = {
      httpsCallable: () => {
        throw {
          code: 500,
        };
      },
    } as any;
    await service.firebaseCloudFunction(
      'someFunc',
      { someProperty: 'someValue' },
      'success',
      'fail'
    );
    expect(service.snackBarManager.showFailureMessage).toHaveBeenCalled();
  });

  it('should NOT show a failure message on a request that errors out for a callable cloud function if dontShowMessage is truthy', async () => {
    service.fireFunc = {
      httpsCallable: () => {
        return {
          objectWithoutNeededProperties: 'anyValue',
        };
      },
    } as any;
    await service.firebaseCloudFunction(
      'someFunc',
      { someProperty: 'someValue' },
      'success',
      'fail',
      true
    );
    expect(service.snackBarManager.showFailureMessage).not.toHaveBeenCalled();
  });

  //   it('should mock a request to a cloud function when firebaseCloudFunction is called (error)', (done) => {
  //     const fireFuncSpy = spyOn(service.fireFunc, 'httpsCallable');
  //     service.firebaseCloudFunction("func", "body",'success','failure').then(value => {
  //       expect(value).toBe(service.ERROR)
  //       expect(fireFuncSpy).toHaveBeenCalled();
  //       done();
  //     });
  //   });

  //   it('should mock a request to a cloud function when firebaseCloudFunction is called (error internal)', (done) => {
  //     const fireFuncSpy = spyOn(service.fireFunc, 'httpsCallable').and.callFake(() => { throw { code: "internal" } });
  //     service.firebaseCloudFunction("func", "body",'success','failure').then(value => {
  //       expect(value).toBe({ code: "internal" });
  //       expect(fireFuncSpy).toHaveBeenCalled();
  //       expect(service.snackBarManager.showWarningMessage).toHaveBeenCalled();
  //       done();
  //     });
  //   });
});

function setup() {
  const fireFunc = autoSpy(AngularFireFunctions);
  const snackbar = autoSpy(SnackBarService);
  const http = new HttpService();
  const builder = {
    fireFunc,
    snackbar,
    http,
    default() {
      return builder;
    },
    build() {
      jasmine.getEnv().allowRespy(true);
      return new CallableWrapperService(fireFunc, snackbar, http);
    },
  };

  return builder;
}
