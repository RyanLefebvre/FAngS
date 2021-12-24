/**
 * Data used to edit a user.
 * 
 * Last edited by: Ryan Lefebvre 11/22/2021
 */
export class UserEditData {

    /**
     * UID of the user to edit
     */
    uid: string;

    /**
     * Optional and does not need to be unique because uid is linked to 
     * account not username. Only restriction is that the username must
     * be a valid string with less than or equal to 25 characters. 
     * A value of null means that no username was provided.
     */
    username: string;

    /**
    * User's email address.
    */
    email: string;

    /**
     * True if other users can view this users profile. False otherwise.
     */
    isPublic: boolean;

    /**
     * Timestamp of the last edit to the user profile.
     */
    lastEdit: number;

}