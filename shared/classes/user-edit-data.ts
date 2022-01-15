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
    username?: string;

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

    /**
     * First name of the user.
     */
    firstName ?:string;

    /**
     * Last name of the user.
     */
    lastName ?:string;

    /**
     * Website that the user wants to link people to. This is the value
     * that gets displayed in the UI.
     */
     website ?:string;

    /**
    * Website that the user wants to link people to. This is the value
    * used as the actual link
    */
    websiteURL ?:string;

    /**
     * Where the user is, if they choose to share.
     */
     location ?:string;

     /**
      * Max 140 character bio.
      */
     bio ?:string;

     /**
      * Optional phone number.
      */
     phoneNumber ?:string;

     /**
      * URL of the users profile picture
      */
     profilePictureURL?:string;

}