/* eslint-disable @typescript-eslint/no-explicit-any */
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { MatDialog } from '@angular/material/dialog';
import { autoSpy } from 'autoSpy';
import { SnackBarService } from 'src/app/shared-modules/material/snack-bar-manager.service';
import { HttpService } from '../constants/http-service';
import { RoutesService } from '../constants/routes.service';
import { TextService } from '../constants/text.service';
import { TimeService } from '../util/time-constant.service';
import { AuthenticationService } from './authentication.service';

describe('AuthenticationService', () => {
  let service: AuthenticationService;

  beforeEach(() => {
    service = setup().default().build();
  });

  it('should not crash when ngOnInit() is called', () => {
    let crashed = false;
    try {
      service.ngOnInit();
    } catch (error) {
      crashed = true;
    }
    expect(crashed).toBe(false);
  });

  it('should update the current user and resolve to true when listenForAuthChanges body executed', async () => {
    let lamRef;
    service.afAuth = {
      onAuthStateChanged: (lam) => {
        return (lamRef = lam);
      },
    } as any;
    service.listenForAuthChanges();
    const expectedUser = {
      uid: 'someUid',
      username: 'some username',
      email: 'someemail',
      dateCreated: 1,
      heardAboutUs: 'idk',
      lastEdit: 2,
      wasDeleted: false,
      isPublic: true,
    } as any;
    lamRef(expectedUser);
    expect(await service.doneLoading).toBe(true);
    expect(service.currentUser).toBe(expectedUser);
  });

  it('should get the current users email when getCurrentUserEmail is called', () => {
    const currentUserEmail = 'someNewEmail';
    service.currentUser = {
      email: currentUserEmail,
    } as any;
    expect(service.getCurrentUserEmail()).toBe(currentUserEmail);
  });

  it('should get the current users id when getCurrentUserID is called', () => {
    const currentUserId = 'someNewId';
    service.currentUser = {
      uid: currentUserId,
    } as any;
    expect(service.getCurrentUserID()).toBe(currentUserId);
  });

  it('should return true if the user is not loading and not null when isAuthenticated is called', () => {
    service.isLoading = () => false;
    service.currentUser = {} as any;
    expect(service.isAuthenticated()).toBe(true);
  });

  it('should return true if the user is not loading and not null when isLoading is called', () => {
    service.currentUser = service.INITIAL_LOADING_STATE;
    expect(service.isLoading()).toBe(true);
  });

  it('should take the user home when logOutGoHome is called', async () => {
    service.logOut = jasmine.createSpy();
    service.router.paths = {
      verify: 'somePath',
      homepage: 'someOtherPath',
    } as any;
    await service.logOutGoHome('someMessage');
    expect(service.logOut).toHaveBeenCalledWith(
      'someMessage',
      service.router.paths.homepage
    );
  });

  it('should take the user to the verify page when logOutGoVerify is called', async () => {
    service.logOut = jasmine.createSpy();
    service.router.paths = {
      verify: 'somePath',
      homepage: 'someOtherPath',
    } as any;
    await service.logOutGoVerify('someMessage');
    expect(service.logOut).toHaveBeenCalledWith(
      'someMessage',
      service.router.paths.verify
    );
  });

  it('should logOut and show a success mesage when logOut is called', async () => {
    const route = 'someRoute';
    service.afAuth = {
      signOut: jasmine.createSpy(),
    } as any;
    let routeRef;
    service.router = {
      navigate: (someRoute: string[]) => (routeRef = someRoute[0]),
    } as any;
    service.dialogRef = {
      closeAll: jasmine.createSpy(),
    } as any;
    const successMessage = 'someMessage';
    await service.logOut(successMessage, route);
    expect(routeRef).toBe(route);
    expect(service.afAuth.signOut).toHaveBeenCalled();
    expect(service.snackbarManager.showSuccessMessage).toHaveBeenCalledWith(
      successMessage
    );
  });

  it('should show an error mesage when logOut is called if it errors out', async () => {
    await service.logOut(null, null);
    expect(service.snackbarManager.showFailureMessage).toHaveBeenCalledWith(
      service.textService.text.signOutFailureMessage
    );
  });

  it('should sign the user in but send them to the verify page if they are unverified when login is called', async () => {
    const email = 'someEmail';
    const password = 'somePassword';
    const sendEmailRef = jasmine.createSpy();
    service.afAuth = {
      signInWithEmailAndPassword: () => {
        return {
          user: {
            emailVerified: false,
            sendEmailVerification: sendEmailRef,
          },
        };
      },
    } as any;
    service.logOutGoVerify = jasmine.createSpy();
    await service.login(email, password);
    expect(service.logOutGoVerify).toHaveBeenCalled();
    expect(sendEmailRef).toHaveBeenCalled();
  });

  it('should sign the user in and send them to the dashboard page if they are verified when login is called', async () => {
    const email = 'someEmail';
    const password = 'somePassword';
    jasmine.createSpy();
    service.afAuth = {
      signInWithEmailAndPassword: () => {
        return {
          user: {
            emailVerified: true,
          },
        };
      },
    } as any;
    let routeRef;
    service.router = {
      navigate: (someRoute: string[]) => (routeRef = someRoute[0]),
      paths: {
        dashboard: 'somePath',
      },
    } as any;
    await service.login(email, password);
    expect(routeRef).toBe(service.router.paths.dashboard);
  });

  it('should show an error when login errors out', async () => {
    service.eventAuthError = {
      next: jasmine.createSpy(),
    } as any;
    await service.login(null, null);
    expect(service.snackbarManager.showWarningMessage).toHaveBeenCalled();
    expect(service.eventAuthError.next).toHaveBeenCalled();
  });
});

function setup() {
  const afAuth = autoSpy(AngularFireAuth);
  const router = autoSpy(RoutesService);
  const time = autoSpy(TimeService);
  const snackbarManager = autoSpy(SnackBarService);
  const dialogRef = autoSpy(MatDialog);
  const textService = new TextService();
  const http = new HttpService();
  const builder = {
    afAuth,
    router,
    time,
    snackbarManager,
    dialogRef,
    textService,
    http,
    default() {
      return builder;
    },
    build() {
      return new AuthenticationService(
        afAuth,
        router,
        time,
        snackbarManager,
        dialogRef,
        textService,
        http
      );
    },
  };

  return builder;
}
