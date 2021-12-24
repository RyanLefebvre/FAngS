import { Injectable } from '@angular/core';
import { ApiResponse } from '../../../../../shared/classes/api-response';
import {
  ERROR_CODE_MAPPING,
  GENERAL_ERROR,
  GENERAL_ERROR_CODE,
} from '../../../../../shared/constants/http';

/**
 * This service exposes any http constants needed
 * from the shared directory at the top level of
 * the project
 *
 * Last edited by: Ryan Lefebvre 11/30/2021
 */
@Injectable({
  providedIn: 'root',
})
export class HttpService {
  /**
   * All the routes in the app that are displayed in the navbar.
   */
  errors = ERROR_CODE_MAPPING;

  /**
   * General error code
   */
  generalErrorCode: number = GENERAL_ERROR_CODE;

  /**
   * @ignore
   */
  constructor() {}

  /**
   * Returns an error response in the format
   * of an errored out ApiRequest.
   */
  getFormattedErrorResponse<T>(error: { code: number }): ApiResponse<T> {
    return this.errors[error.code] || GENERAL_ERROR;
  }
}
