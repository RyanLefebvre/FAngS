/* eslint-disable @typescript-eslint/no-explicit-any */
import 'jest';
import * as functions from 'firebase-functions-test';
import * as admin from 'firebase-admin';
import { FORBIDDEN_CODE } from '../../../../shared/constants/http';
import {
  createUserProfile,
  deleteUserProfile,
  editUserProfile,
  getUIDFromContext,
  getUserProfile,
  getUserProfileFromUID,
  USER_COLLECTION_NAME,
} from '../services/user';

const test = functions(
  { projectId: 'geodakadevelopment-4b671' },
  // we prob want to make the projectId a variable!, see if we can share firebase stuff between frontend and backend when sharing secrets!
  './service-account.json'
);
admin.initializeApp();

describe('UserService', () => {
  afterAll(() => test.cleanup());

  const mockUserInfo: any = {
    uid: 'someIdThatWouldNotBeRandomlyGenerated',
    username: 'MyReallyCoolUsername',
    email: 'MyCoolEmail',
    password: 'someCOolPassword',
    dateCreated: 1,
    heardAboutUs: 'John Madden',
  };

  const mockUserContext = {
    auth: {
      uid: mockUserInfo.uid,
    },
  };

  it('Should create a new userProfile when create user is called', async () => {
    await test.wrap(createUserProfile)(mockUserInfo);

    const ref = await admin
      .firestore()
      .collection(USER_COLLECTION_NAME)
      .doc(mockUserInfo.uid);

    expect(ref).not.toBe(null);

    // MAY NEED TO USE THE interfaces like at work
    // see: https://stackoverflow.com/a/63342052/15088003
    const userProfileInDB: any = await getUserProfileFromUID(mockUserInfo.uid);

    const keysNotToCheck = ['password'];
    Object.keys(mockUserInfo).forEach((key: string) => {
      if (!keysNotToCheck.includes(key)) {
        expect(userProfileInDB[key]).toBe(mockUserInfo[key]);
      }
    });
  });

  it('should get the user when getUserProfile is called', async () => {
    const userProfileResponse = await test.wrap(getUserProfile)(
      mockUserInfo.uid,
      mockUserContext
    );
    expect(userProfileResponse.code).toBe(200);
    const userProfileInDB = userProfileResponse.data;
    const keysNotToCheck = ['password', 'email'];
    Object.keys(mockUserInfo).forEach((key: string) => {
      if (!keysNotToCheck.includes(key)) {
        expect(userProfileInDB[key]).toBe(mockUserInfo[key]);
      }
    });
  });

  it('should not get the user profile when getUserProfile is called and the user isnt found ', async () => {
    const userProfileResponse = await test.wrap(getUserProfile)(
      'SomeRandomUidTheyCantReach',
      mockUserContext
    );
    expect(userProfileResponse.code).toBe(FORBIDDEN_CODE);
  });

  it('should update the user profile when editUserProfile is called and the user is authorized', async () => {
    const userEditData = {
      uid: mockUserInfo.uid,
      username: mockUserInfo.username + 'someOtherChars',
      email: mockUserInfo.email,
      isPublic: false,
    } as any;

    await test.wrap(editUserProfile)(userEditData, mockUserContext);

    const userProfileInDB: any = await getUserProfileFromUID(mockUserInfo.uid);
    Object.keys(userEditData).forEach((key: string) =>
      expect(userProfileInDB[key]).toBe(userEditData[key])
    );
  });

  it('should not get the user profile if the user exists but is not public and getUserProfile is called', async () => {
    const userProfileResponse = await test.wrap(getUserProfile)(
      mockUserInfo.uid,
      { auth: { uid: 'someOtherUid' } }
    );
    expect(userProfileResponse.code).toBe(FORBIDDEN_CODE);
  });

  it('should not delete the user if anyone tries to delete the user besides themselves', async () => {
    const userProfileResponse = await test.wrap(deleteUserProfile)(
      mockUserInfo.uid,
      { auth: { uid: 'someOtherUid' } }
    );
    expect(userProfileResponse.code).toBe(FORBIDDEN_CODE);
  });

  it('should delete the user if they delete themselves', async () => {
    let userProfileInDB: any = await getUserProfileFromUID(mockUserInfo.uid);
    expect(userProfileInDB.wasDeleted).toBe(false);
    await test.wrap(deleteUserProfile)(mockUserInfo.uid, mockUserContext);
    userProfileInDB = await getUserProfileFromUID(mockUserInfo.uid);
    expect(userProfileInDB.wasDeleted).toBe(true);
  });

  it('should return null when getUidFromContext is called and the context does not have a uid', () => {
    expect(getUIDFromContext({} as any)).toBe(null);
  });
});
