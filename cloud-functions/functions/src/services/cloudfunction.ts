import * as functions from 'firebase-functions';
import { ApiResponse } from '../../../../shared/classes/api-response';
import {
  SUCCESS_CODE_MAPPING,
  UNUATHENTICATED_ERROR,
  UNAUTHORIZED_ERROR,
  ERROR_CODE_MAPPING,
  GENERAL_ERROR_CODE,
} from '../../../../shared/constants/http';

/**
 * Functions within this file do all the heavy lifting for making the
 * responses from the cloud functions consistent and in the format that
 * the client is expecting.
 *
 * Last edited by: Ryan Lefebvre 11/24/2020
 */

/**
 * Wrapper around the cloud function that checks for authorization
 * - i.e. The user has permissions to perform this operation.
 */
export function authorizedCloudFunction<InputType, OutputType>(
  isAuthorized: (
    context: functions.https.CallableContext,
    someParams: InputType
  ) => Promise<boolean> | boolean,
  func: (
    context: functions.https.CallableContext,
    someParams: InputType
  ) => Promise<OutputType>,
  operationType: string
) {
  return async (
    params: InputType,
    authContext: functions.https.CallableContext
  ): Promise<ApiResponse<OutputType>> => {
    return (await isAuthorized(authContext, params))
      ? authenticatedCloudFunction<InputType, OutputType>(func, operationType)(
          params,
          authContext
        )
      : UNAUTHORIZED_ERROR;
  };
}

/**
 * Wrapper around the cloud function that checks for authentication
 * - i.e. We know who the user is.
 */
export function authenticatedCloudFunction<InputType, OutputType>(
  func: (
    context: functions.https.CallableContext,
    someParams: InputType
  ) => Promise<OutputType>,
  operationType: string
) {
  return async (
    params: InputType,
    authContext: functions.https.CallableContext
  ): Promise<ApiResponse<OutputType>> => {
    return isAuthenticated(authContext)
      ? cloudFunction<InputType, OutputType>(func, operationType)(
          params,
          authContext
        )
      : UNUATHENTICATED_ERROR;
  };
}

/**
 * Handles the formatting of a successful response and an error
 * response for a cloud function.
 */
export function cloudFunction<InputType, OutputType>(
  func: (
    context: functions.https.CallableContext,
    someParams: InputType
  ) => Promise<OutputType>,
  operationType: string
) {
  return async (
    params: InputType,
    authContext: functions.https.CallableContext
  ): Promise<ApiResponse<OutputType>> => {
    try {
      return {
        data: await func(authContext, params),
        code: SUCCESS_CODE_MAPPING[operationType],
      };
    } catch (error) {
      const typedError = error as { code?: string | number };
      return ERROR_CODE_MAPPING[typedError.code || GENERAL_ERROR_CODE];
    }
  };
}

/**
 * Input is a firebase on call context object from a cloud function request.
 * Returns true if a user is authenticated, false otherwise.
 */
export function isAuthenticated(
  context: functions.https.CallableContext
): boolean {
  return context?.auth != null;
}
