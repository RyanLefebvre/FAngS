/**
 * Class that represents a user. Can be easily 
 * extended to add properties to the user profile.
 * 
 * Last edited by: Ryan Lefebvre 10/26/2021
 */
export class UserProfile {

    /**
     * uid assigned at account birth by firebase authentication.
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
     * The date that the user profile was created. After account creation this 
     * variable should be treated as read only. 
     */
    dateCreated: number;

    /**
     * String that contains a message with max length of 140 characters explaining 
     * how the user heard about us.
     */
    heardAboutUs?: string;

    /**
     * Timestamp of the last edit to the user profile.
     */
    lastEdit: number;

    /**
     * True if the user was deleted false otherwise.
     */
    wasDeleted: boolean;

    /**
     * True if other users can view this users profile. False otherwise.
     */
    isPublic: boolean;

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