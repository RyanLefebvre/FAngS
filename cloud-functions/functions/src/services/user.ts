import * as firebase from 'firebase-admin';
import * as functions from 'firebase-functions';
import * as functionWrappers from './cloudfunction';
import { UserProfile } from '../../../../shared/classes/user-profile';
import { UserEditData } from '../../../../shared/classes/user-edit-data';
import { UserCreateData } from '../../../../shared/classes/user-create-data';
import {
  CREATE,
  DELETE,
  READ,
  UPDATE,
} from '../../../../shared/constants/http';
import { CallableContext } from 'firebase-functions/v1/https';

/**
 * Functions within this file are responsible for various operations related to
 * user profile CRUD and authentication status.
 *
 * Last edited by: Ryan Lefebvre 8/23/2020
 */

/**
 * Key used in the firebase storage form of the UserProfile.
 */
export const USER_PROF_STORAGE_KEY = 'u';

/**
 * Name of the User collection in the database
 */

export const USER_COLLECTION_NAME = 'Users';

// ////////////////////////////////////////////////
// CREATE USER
// ////////////////////////////////////////////////
/**
 * @openapi
 * /createUserProfile:
 *   post:
 *     description: Given UserCreateData, will return the newly created user from the database.
 *     parameters:
 *       - in: header
 *         name: UserCreateData
 *         description: properties that you want to create the user profile with
 *         schema:
 *           type: object
 *           properties:
 *             uid:
 *               type: string
 *             username:
 *               type: string
 *             email:
 *               type: string
 *             password:
 *               type: string
 *             dateCreated:
 *               type: integer
 *             heardAboutUs:
 *               type: integer
 *     responses:
 *       201:
 *         description: Returns user profile requested to create.
 *       401:
 *         description: Not authenticated.
 *       403:
 *         description: Not authorized to create user.
 *       500:
 *         description: Something went wrong.
 */
const createUserProfileOperation = async (
  _: functions.https.CallableContext,
  userCreateData: UserCreateData
): Promise<UserProfile> => {
  const newUser: UserProfile = {
    uid: userCreateData.uid,
    username: userCreateData.username,
    email: userCreateData.email,
    dateCreated: userCreateData.dateCreated,
    heardAboutUs: userCreateData.heardAboutUs,
    lastEdit: userCreateData.dateCreated,
    wasDeleted: false,
    isPublic: true,
  };

  await updateUserInDB(newUser);

  return newUser;
};

export const createUserProfile = functions.https.onCall(
  functionWrappers.cloudFunction<UserCreateData, UserProfile>(
    createUserProfileOperation,
    CREATE
  )
);

// ////////////////////////////////////////////////
// GET USER
// ////////////////////////////////////////////////
/**
 * @openapi
 * /getUserProfile:
 *   get:
 *     description: Given a user id, will return a user profile from the db if the profile belongs to the requester or if the requested profile is public.
 *     parameters:
 *       - in: header
 *         name: userId
 *         description: id of the user that you want to get
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Returns user profile requested.
 *       401:
 *         description: Not authenticated.
 *       403:
 *         description: Not authorized to get user.
 *       404:
 *         description: Cant find the user.
 *       500:
 *         description: Something went wrong.
 */
const getUserProfileOperation = async (
  _: functions.https.CallableContext,
  uid: string
): Promise<UserProfile> => {
  const userProfilePromise: Promise<UserProfile> = getUserProfileFromUID(uid);
  // have to get email from auth table because of case where user changes email,
  // then reverts the email through the firebase email revert link. No event that
  // will notify us to keep firestore in sync
  const userEmailPomise: Promise<string> = getUserEmailFromAuthTable(uid);
  // This shouldn't need to be this hacky https://github.com/microsoft/TypeScript/issues/42012
  const settled: [
    PromiseSettledResult<UserProfile>,
    PromiseSettledResult<string>
  ] = await Promise.allSettled([userProfilePromise, userEmailPomise]);
  const userProfile = (settled[0] as PromiseFulfilledResult<UserProfile>).value;
  return {
    ...userProfile,
    email:
      (settled[1] as PromiseFulfilledResult<string>).value || userProfile.email,
  };
};

const getUserProfileAuthorization = async (
  context: functions.https.CallableContext,
  uid: string
): Promise<boolean> => {
  return (
    getUIDFromContext(context) === uid ||
    (await getUserProfileFromUID(uid))?.isPublic === true
  );
};

export const getUserProfile = functions.https.onCall(
  functionWrappers.authorizedCloudFunction<string, UserProfile>(
    getUserProfileAuthorization,
    getUserProfileOperation,
    READ
  )
);

// ////////////////////////////////////////////////
// EDIT USER
// ////////////////////////////////////////////////
/**
 * @openapi
 * /editUserProfile:
 *   put:
 *     description: Given UserEditData, will return the edited user from the database. Prevents any user from editing a profile besides their own.
 *     parameters:
 *       - in: header
 *         name: UserEditData
 *         description: properties that you want to edit the user profile with
 *         schema:
 *           type: object
 *           properties:
 *             uid:
 *               type: string
 *             username:
 *               type: string
 *             email:
 *               type: string
 *             isPublic:
 *               type: boolean
 *             lastEdit:
 *               type: integer
 *     responses:
 *       200:
 *         description: Returns user profile requested to edit.
 *       401:
 *         description: Not authenticated.
 *       403:
 *         description: Not authorized to edit user.
 *       500:
 *         description: Something went wrong.
 */
const editUserProfileOperation = async (
  _: functions.https.CallableContext,
  userEditData: UserEditData
): Promise<UserProfile> => {
  const userToBeEdited: UserProfile = await getUserProfileFromUID(
    userEditData.uid
  );
  userToBeEdited.username = userEditData.username;
  userToBeEdited.email = userEditData.email;
  userToBeEdited.lastEdit = userEditData.lastEdit;
  userToBeEdited.isPublic = userEditData.isPublic;
  await updateUserInDB(userToBeEdited);
  return userToBeEdited;
};

const editUserProfileAuthorization = (
  context: functions.https.CallableContext,
  userEditData: UserEditData
): boolean => {
  return userEditData.uid === getUIDFromContext(context);
};

export const editUserProfile = functions.https.onCall(
  functionWrappers.authorizedCloudFunction<UserEditData, UserProfile>(
    editUserProfileAuthorization,
    editUserProfileOperation,
    UPDATE
  )
);

// ////////////////////////////////////////////////
// DELETE USER
// ////////////////////////////////////////////////
/**
 * @openapi
 * /deleteUserProfile:
 *   delete:
 *     description: Given a user id, will delete a user profile from the db if the profile belongs to the requester. Will prevent users from deleting someone else's profile.
 *     parameters:
 *       - in: header
 *         name: userId
 *         description: id of the user that you want to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Returns user profile requested to delete.
 *       401:
 *         description: Not authenticated.
 *       403:
 *         description: Not authorized to get user.
 *       404:
 *         description: Cant find the user.
 *       500:
 *         description: Something went wrong.
 */
const deleteUserProfileOperation = async (
  _: functions.https.CallableContext,
  uid: string
): Promise<void> => {
  const userToDelete = await getUserProfileFromUID(uid);
  userToDelete.wasDeleted = true;
  const deleteInAuthTable = firebase.app().auth().deleteUser(uid);
  const deleteInFirestore = updateUserInDB(userToDelete);
  await Promise.allSettled([deleteInAuthTable, deleteInFirestore]);
};

const deleteUserProfileAuthorization = (
  context: functions.https.CallableContext,
  uid: string
): boolean => {
  return uid === getUIDFromContext(context);
};

export const deleteUserProfile = functions.https.onCall(
  functionWrappers.authorizedCloudFunction<string, void>(
    deleteUserProfileAuthorization,
    deleteUserProfileOperation,
    DELETE
  )
);

// ////////////////////////////////////////////////
// HELPERS
// ////////////////////////////////////////////////

/**
 * Returns the email associated with a firebase firestore UID.
 *
 * @param uid UID of the user to get the email of.
 */
export const getUserEmailFromAuthTable = async (
  uid: string
): Promise<string> => {
  try {
    return (await firebase.auth().getUser(uid)).email;
  } catch (error) {
    return null;
  }
};

/**
 * Returns user id from a firebase.auth.context object. If UID is not found, returns null.
 *
 * @param context firebase auth context to get UID from.
 */
export const getUIDFromContext = (context: CallableContext): string => {
  try {
    return context.auth.uid;
  } catch (error) {
    return null;
  }
};

/**
 * Returns a reference to the result of a user profile update operation as a promise.
 * This allows other functions wait for the update operation to complete before proceeding,
 *
 * @param userProfile UserProfile object to replace.
 * @param uid Firebase firestore uid linked to a UserProfile.
 */
export const updateUserInDB = (
  userProfile: UserProfile
): Promise<FirebaseFirestore.WriteResult> => {
  return firebase
    .firestore()
    .collection(USER_COLLECTION_NAME)
    .doc(userProfile.uid)
    .set({ [USER_PROF_STORAGE_KEY]: JSON.stringify(userProfile) });
};

/**
 * Returns the UserProfile object associated with a firebase firestore uid.
 *
 * @param uid UID associated with a UserProfile object.
 */
export const getUserProfileFromUID = async (
  uid: string
): Promise<UserProfile> => {
  let userProfile: UserProfile = null;
  await firebase
    .firestore()
    .collection(USER_COLLECTION_NAME)
    .doc(uid)
    .get()
    .then((snapshot) => {
      userProfile = convertUserProfileFromSnapshot(snapshot);
    });
  return userProfile;
};

/**
 * Converts a snapshot of a document in our database that is a user profile
 * in storage format into a user profile object.
 *
 * @param userSnap Snapshot of user profile in storage format
 */
export const convertUserProfileFromSnapshot = (
  userSnap: FirebaseFirestore.DocumentSnapshot<FirebaseFirestore.DocumentData>
): UserProfile | null => {
  try {
    const userStorage = userSnap.data();
    const userProfile: UserProfile = JSON.parse(
      userStorage[USER_PROF_STORAGE_KEY]
    );
    return userProfile;
  } catch (error) {
    return null;
  }
};
