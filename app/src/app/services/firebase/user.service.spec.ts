/* eslint-disable @typescript-eslint/no-explicit-any */
import { UserService } from './user.service';
import { autoSpy } from 'autoSpy';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { HttpService } from '../constants/http-service';
import { TextService } from '../constants/text.service';
import { CallableWrapperService } from './callable-wrapper.service';
import { UserCreateData } from '../../../../../shared/classes/user-create-data';
import { UserEditData } from '../../../../../shared/classes/user-edit-data';

describe('UserService', () => {
  let service: UserService;

  beforeEach(() => {
    service = setup().default().build();
  });

  it('should create a user profile when valid profile info is passed into the createUserProfile function', async () => {
    const createData: UserCreateData = {
      uid: null,
      username: 'someName',
      email: 'someEmail@gmail.com',
      password: 'pikachuElectric77',
      dateCreated: 1,
    };
    const sendEmailRef = jasmine.createSpy();
    service.afAuth = {
      createUserWithEmailAndPassword: jasmine.createSpy().and.returnValue({
        user: {
          uid: 'blahFooBlah',
          sendEmailVerification: sendEmailRef,
        },
      }),
    } as any;
    const expectedReturn: any = 'someReturnValue';
    service.callableWrapper.firebaseCloudFunction = jasmine
      .createSpy()
      .and.returnValue(expectedReturn);
    const retVal = await service.createUserProfile(createData);
    expect(service.afAuth.createUserWithEmailAndPassword).toHaveBeenCalled();
    expect(sendEmailRef).toHaveBeenCalled();
    expect(retVal).toBe(expectedReturn);
  });

  it('should return an error when the createUserProfile function errors out', async () => {
    const retVal = await service.createUserProfile(null);
    expect(retVal.error).not.toBe(null);
  });

  it("should make a request to edit the user's profile when editUserProfile is called", async () => {
    const fakeData = {} as UserEditData;
    await service.editUserProfile(fakeData);
    expect(service.callableWrapper.firebaseCloudFunction).toHaveBeenCalledWith(
      service.FUNCTION_EDIT_USER_PROFILE,
      fakeData,
      service.textService.text.userEditSuccess,
      service.textService.text.userEditFailure
    );
  });

  it("should make a request to get the user's profile when getUserProfile is called", async () => {
    const fakeData = 'someUserId';
    await service.getUserProfile(fakeData);
    expect(service.callableWrapper.firebaseCloudFunction).toHaveBeenCalledWith(
      service.FUNCTION_GET_USER_PROFILE,
      fakeData,
      service.textService.text.userGetSuccess,
      service.textService.text.userGetFailure,
      true
    );
  });

  it("should make a request to delete the user's profile when deleteUserProfile is called", async () => {
    const fakeData = 'someUserId';
    await service.deleteUserProfile(fakeData);
    expect(service.callableWrapper.firebaseCloudFunction).toHaveBeenCalledWith(
      service.FUNCTION_DELETE_USER_PROFILE,
      fakeData,
      service.textService.text.userDeleteSuccess,
      service.textService.text.userDeleteFailure
    );
  });
});

function setup() {
  const afAuth = autoSpy(AngularFireAuth);
  const fireFunc = autoSpy(CallableWrapperService);
  const textService = new TextService();
  const http = new HttpService();
  const builder = {
    afAuth,
    fireFunc,
    textService,
    http,
    default() {
      return builder;
    },
    build() {
      return new UserService(afAuth, fireFunc, textService, http);
    },
  };

  return builder;
}
