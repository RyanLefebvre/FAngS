import { Injectable } from '@angular/core';
import { UserProfile } from '../../../../../shared/classes/user-profile';
import { UserEditData } from '../../../../../shared/classes/user-edit-data';
import { CallableWrapperService } from './callable-wrapper.service';
import { ApiResponse } from '../../../../../shared/classes/api-response';
import { UserCreateData } from '../../../../../shared/classes/user-create-data';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { TextService } from '../constants/text.service';
import { HttpService } from '../constants/http-service';
import firebase from 'firebase/compat';

/**
 * This service is responsible for any firebase operations related to user CRUD
 * but not to authentication.
 *
 * Last edited by: Ryan Lefebvre 9/30/2020
 */
@Injectable({
  providedIn: 'root',
})
export class UserService {
  /**
   * Name of the firebase function used to edit a user.
   */
  FUNCTION_EDIT_USER_PROFILE = 'editUserProfile';

  /**
   * Name of the firebase function used to create a user.
   */
  FUNCTION_CREATE_USER_PROFILE = 'createUserProfile';

  /**
   * Name of the firebase function used to edit the demographic and preference information of a UserProfile object.
   */
  FUNCTION_GET_USER_PROFILE = 'getUserProfile';

  /**
   * Name of the firebase function used to edit the demographic and preference information of a UserProfile object.
   */
  FUNCTION_DELETE_USER_PROFILE = 'deleteUserProfile';

  /**
   * @ignore
   */
  constructor(
    public afAuth: AngularFireAuth,
    public callableWrapper: CallableWrapperService,
    public textService: TextService,
    public http: HttpService
  ) {}

  /**
   * Creates a user profile based on the information passed in. Firebase currently offers no way to
   * send a verification email with a cloud function throguh the sdk once a user credential is created in
   * the auth table so we create the user in the auth table and send the verification email
   * client side. This would obviously not be good if one of the requests failed to complete, but an atomic
   * operation doesn't seem possible given the current tools.
   */
  async createUserProfile(
    createUserInfo: UserCreateData
  ): Promise<ApiResponse<UserProfile>> {
    try {
      const createdUser: firebase.auth.UserCredential =
        await this.afAuth.createUserWithEmailAndPassword(
          createUserInfo.email,
          createUserInfo.password
        );
      createUserInfo.uid = createdUser.user.uid;
      const newUserPromise: Promise<ApiResponse<UserProfile>> =
        this.callableWrapper.firebaseCloudFunction<UserCreateData, UserProfile>(
          this.FUNCTION_CREATE_USER_PROFILE,
          createUserInfo,
          this.textService.text.userCreateSuccess,
          this.textService.text.userCreateFailure
        );
      const sendEmailPromise: Promise<void> =
        createdUser.user.sendEmailVerification();
      await Promise.all([newUserPromise, sendEmailPromise]);
      return newUserPromise;
    } catch (error) {
      return this.http.getFormattedErrorResponse(error);
    }
  }

  /**
   * Edits the user with the information passed in.
   */
  async editUserProfile(
    editUserInfo: UserEditData
  ): Promise<ApiResponse<UserProfile>> {
    return this.callableWrapper.firebaseCloudFunction<
      UserEditData,
      UserProfile
    >(
      this.FUNCTION_EDIT_USER_PROFILE,
      editUserInfo,
      this.textService.text.userEditSuccess,
      this.textService.text.userEditFailure
    );
  }

  /**
   * Gets the user profile associated with the uid passed in.
   */
  async getUserProfile(uid: string): Promise<ApiResponse<UserProfile>> {
    return this.callableWrapper.firebaseCloudFunction<string, UserProfile>(
      this.FUNCTION_GET_USER_PROFILE,
      uid,
      this.textService.text.userGetSuccess,
      this.textService.text.userGetFailure,
      true
    );
  }

  /**
   * Deletes the user profile associated with the uid passed in.
   */
  async deleteUserProfile(uid: string): Promise<ApiResponse<void>> {
    return this.callableWrapper.firebaseCloudFunction<string, void>(
      this.FUNCTION_DELETE_USER_PROFILE,
      uid,
      this.textService.text.userDeleteSuccess,
      this.textService.text.userDeleteFailure
    );
  }
}
