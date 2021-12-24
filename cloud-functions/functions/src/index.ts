import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
admin.initializeApp(functions.config().firebase);

/**
 * Exports all callable functions from files where implementations
 * are stored. Acts as a barrel for our cloud functions environment
 * that rolls up all of our exports neatly.
 *
 * Last edited by: Ryan Lefebvre 7/23/2020
 */
export {
  deleteUserProfile,
  getUserProfile,
  createUserProfile,
  editUserProfile,
} from './services/user';
