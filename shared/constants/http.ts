import { ApiResponse } from '../classes/api-response';
import * as textService from './text';

/**
 * This file is a collection of constant values that are used for http requests/responses.
 * 
 * Last edited by: Ryan Lefebvre 7/20/2020
 */

//////////////////////////////////////////////////
// OPERATION TYPES
//////////////////////////////////////////////////

export const CREATE: string = 'create';

export const READ: string = 'read';

export const UPDATE: string = 'update';

export const DELETE: string = 'delete';

//////////////////////////////////////////////////
// HTTP STATUS CODES
//////////////////////////////////////////////////

export const OK_CODE: number = 200;

export const CREATED_CODE: number = 201;

export const NO_CONTENT_CODE: number = 202;

export const UNAUTHENTICATED_CODE: number = 401;

export const FORBIDDEN_CODE: number = 403;

export const NOT_FOUND_CODE: number = 404;

export const GENERAL_ERROR_CODE: number = 500;

//////////////////////////////////////////////////
// FIREBASE ERROR CODES
//////////////////////////////////////////////////

export const EMAIL_IN_USE_CODE: string = "auth/email-already-exists";

export const NETWORK_ERROR_CODE: string = "auth/network-request-failed";

export const INVALID_EMAIL_CODE: string = "auth/invalid-email";

export const CANT_CONNECT_CODE: string = "internal";

export const INVALID_PASSWORD_CODE: string = "auth/wrong-password";

export const USER_NOT_FOUND_CODE: string = "auth/user-not-found";

export const EMAIL_ALREADY_EXISTS_CODE: string = "auth/email-already-in-use";

//////////////////////////////////////////////////
// ERROR RESPONSES
//////////////////////////////////////////////////

/**
 * Error returned if a user is not authenticated.
 */
export const UNUATHENTICATED_ERROR: ApiResponse<any> = {
    code: UNAUTHENTICATED_CODE,
    error: {
        message: textService.text.unauthenticatedErrorMessage
    }
};

/**
 * Error returned if a user is not authorized.
 */
export const UNAUTHORIZED_ERROR: ApiResponse<any> = {
    code: FORBIDDEN_CODE,
    error: {
        message:textService.text.unauthorizedErrorMessage
    }
};

/**
 * Error returned if a user is not authorized.
 */
export const NOT_FOUND_ERROR: ApiResponse<any> = {
    code: NOT_FOUND_CODE,
    error: {
        message: textService.text.notFoundErrorMessage
    }
};

/**
 * Error returned if something went wrong but it is not clear what the error was.
 * Generic catch all response for server side errors.
 */
export const GENERAL_ERROR: ApiResponse<any> = {
    code: GENERAL_ERROR_CODE,
    error: {
        message:textService.text.generalErrorMessage
    }
};

/**
 * Error returned if an email address is already in use by another account.
 */
export const EMAIL_IN_USE_ERROR: ApiResponse<any> = {
    code: EMAIL_IN_USE_CODE,
    error: {
        message: textService.text.emailInUseErrorMessage
    }
};

/**
 * Error returned if an email address is already in use by another account.
 */
export const EMAIL_ALREADY_EXISTS_ERROR: ApiResponse<any> = {
    code: EMAIL_ALREADY_EXISTS_CODE,
    error: {
        message: textService.text.emailAlreadyExistsErrorMessage
    }
};

/**
 * Error returned if a firebase network error occurs.
 */
export const FIREBASE_NETWORK_ERROR: ApiResponse<any> = {
    code: NETWORK_ERROR_CODE,
    error: {
        message: textService.text.firebaseNetworkErrorMessage
    }
};

/**
 * Error returned if an email is invalid.
 */
export const CANT_CONNECT_ERROR: ApiResponse<any> = {
    code: CANT_CONNECT_CODE,
    error: {
        message: textService.text.cantConnectErrorMessage
    }
};

/**
 * Error returned if an email is invalid.
 */
export const INVALID_EMAIL_ERROR: ApiResponse<any> = {
    code: INVALID_EMAIL_CODE,
    error: {
        message: textService.text.invalidEmailErrorMessage
    }
};

/**
 * Error returned if a password is invalid.
 */
export const INVALID_PASSWORD_ERROR: ApiResponse<any> = {
    code: INVALID_PASSWORD_CODE,
    error: {
        message: textService.text.invalidPasswordErrorMessage
    }
}

/**
 * Error returned if a password is invalid.
 */
export const USER_NOT_ERROR: ApiResponse<any> = {
    code: USER_NOT_FOUND_CODE,
    error: {
        message: textService.text.userNotFoundErrorMessage
    }
}

//////////////////////////////////////////////////
// SUCCESS/ERROR MAPPINGS FOR RESPONSE CODES
//////////////////////////////////////////////////

export const SUCCESS_CODE_MAPPING = {
    [CREATE]: CREATED_CODE,
    [READ]: OK_CODE,
    [UPDATE]: OK_CODE,
    [DELETE]: NO_CONTENT_CODE
}

export const ERROR_CODE_MAPPING = {
    [UNAUTHENTICATED_CODE]: UNUATHENTICATED_ERROR,
    [FORBIDDEN_CODE]: UNAUTHORIZED_ERROR,
    [NOT_FOUND_CODE]: NOT_FOUND_ERROR,
    [GENERAL_ERROR_CODE]: GENERAL_ERROR,
    [EMAIL_IN_USE_CODE]: EMAIL_IN_USE_ERROR,
    [NETWORK_ERROR_CODE]: FIREBASE_NETWORK_ERROR,
    [INVALID_EMAIL_CODE]: INVALID_EMAIL_ERROR,
    [CANT_CONNECT_CODE]: CANT_CONNECT_ERROR,
    [INVALID_PASSWORD_CODE]: INVALID_PASSWORD_ERROR,
    [USER_NOT_FOUND_CODE]: USER_NOT_ERROR,
    [EMAIL_ALREADY_EXISTS_CODE]: EMAIL_ALREADY_EXISTS_ERROR
}