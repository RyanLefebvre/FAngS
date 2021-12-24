import { Injectable, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { SnackBarService } from 'src/app/shared-modules/material/snack-bar-manager.service';
import { TimeService } from '../util/time-constant.service';
import { MatDialog } from '@angular/material/dialog';
import { RoutesService } from '../constants/routes.service';
import { TextService } from '../constants/text.service';
import { HttpService } from '../constants/http-service';
import { Subject } from 'rxjs';
import firebase from 'firebase/compat';

/**
 * This service is responsible for all operations related to authentication.
 *
 * Last edited by: Ryan Lefebvre 7/12/2020
 */
@Injectable({
  providedIn: 'root',
})
export class AuthenticationService implements OnInit {
  /**
   * Some random value used to check if the user is loading or not.
   */
  INITIAL_LOADING_STATE = {
    loading: 'If Current User is this, then they are loading',
  } as unknown as firebase.User;

  /**
   * Reference to the current firebase auth user object.
   */
  currentUser: firebase.User = this.INITIAL_LOADING_STATE;

  /**
   * A promise that resolves when the user is done loading.
   */
  doneLoading: Promise<boolean>;

  /**
   * Obseravble that emits a string containing an error message any time that an authentication
   * error occurs. i.e. during the sign in or sign up process.
   */
  public eventAuthError: Subject<string> = new Subject<string>();

  /**
   * @ignore
   */
  constructor(
    public afAuth: AngularFireAuth,
    public router: RoutesService,
    public time: TimeService,
    public snackbarManager: SnackBarService,
    public dialogRef: MatDialog,
    public textService: TextService,
    public http: HttpService
  ) {}

  /**
   * @ignore
   */
  ngOnInit(): void {}

  /**
   * Sets ups a change handler for user authentication events.
   */
  listenForAuthChanges(): void {
    this.doneLoading = new Promise((resolve) => {
      this.afAuth.onAuthStateChanged((user) => {
        this.currentUser = user;
        resolve(true);
      });
    });
  }

  /**
   * Returns true if the current user is authenticated. False otherwise.
   */
  isAuthenticated(): boolean {
    return !this.isLoading() && this.currentUser !== null;
  }

  /**
   * Returns true if the user is loading. False otherwise.
   */
  isLoading(): boolean {
    return this.currentUser === this.INITIAL_LOADING_STATE;
  }

  /**
   * Logs the current user out and sends them to the homepage on success.
   */
  async logOutGoHome(message: string): Promise<void> {
    return await this.logOut(message, this.router.paths.homepage);
  }

  /**
   * Logs the current user out and navigates to the verify email page on success.
   */
  async logOutGoVerify(message: string): Promise<void> {
    return await this.logOut(message, this.router.paths.verify);
  }

  /**
   * Attempts to sign the user out, clear session storage, navigate the user to the route specified
   * and show a success message indicating the sign out operation was successful. If any error occurs
   * then the error is caught and an error message is displayed.
   */
  async logOut(successMessage: string, route: string): Promise<void> {
    try {
      await this.router.navigate([route]);
      await this.afAuth.signOut();
      sessionStorage.clear();
      localStorage.clear();
      await this.dialogRef.closeAll();
      this.snackbarManager.showSuccessMessage(successMessage);
    } catch (error) {
      this.snackbarManager.showFailureMessage(
        this.textService.text.signOutFailureMessage
      );
    }
  }

  /**
   * Atttempts to sign the user into their account. On success, a check is done to make sure the
   * user's email is verified. If the user's email is not verified, then they are redirected to the
   * verify email page, a new verification email is sent and a snackbar is displayed telling the
   * user that their email is not verified. If any error occurs, then the authError observable
   * emits the latest error message.
   */
  async login(email: string, password: string): Promise<void> {
    try {
      const userCredentials: firebase.auth.UserCredential =
        await this.afAuth.signInWithEmailAndPassword(email, password);
      const userEmailIsNotVerified: boolean =
        userCredentials.user.emailVerified == false;
      if (userEmailIsNotVerified) {
        await this.logOutGoVerify(this.textService.text.verifyEmail);
        await userCredentials.user.sendEmailVerification();
      } else {
        this.router.navigate([this.router.paths.dashboard]);
      }
    } catch (error) {
      const prettyErrorResponse = this.http.getFormattedErrorResponse(error);
      this.snackbarManager.showWarningMessage(
        prettyErrorResponse.error.message
      );
      this.eventAuthError.next(prettyErrorResponse.error.message);
    }
  }

  /**
   * Returns the uid of the currently authenticated user by getting the uid of the auth state from the authentication service.
   */
  getCurrentUserID(): string {
    return this.currentUser.uid;
  }

  /**
   * Returns the uid of the currently authenticated user by getting the uid of the auth state from the authentication service.
   */
  getCurrentUserEmail(): string {
    return this.currentUser.email;
  }
}
