/**
 * Data used to create a user.
 * 
 * Last edited by: Ryan Lefebvre 11/24/2021
 */
export class UserCreateData {

    /**
     * UID of the created user
     */
    uid: string;

    /**
     * Optional and does not need to be unique because uid is linked to 
     * account not username. Only restriction is that the username must
     * be a valid string with less than or equal to 25 characters. 
     * A value of null means that no username was provided.
     */
    username?: string;

    /**
    * User's email address.
    */
    email: string;

    /**
    * User's password.
    */
    password: string;

    /**
     * The date that the user profile was created. After account creation this 
     * variable should be treated as read only. 
     */
    dateCreated: number;

    /**
     * String that contains a message with max length of 140 characters explaining 
     * how the user heard about us.
     */
    heardAboutUs?: string;

}