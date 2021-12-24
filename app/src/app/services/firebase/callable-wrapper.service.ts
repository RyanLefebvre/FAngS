import { Injectable } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/compat/functions';
import { SnackBarService } from 'src/app/shared-modules/material/snack-bar-manager.service';
import { ApiResponse } from '../../../../../shared/classes/api-response';
import { HttpService } from '../constants/http-service';

/**
 * This service is a wrapper around all requests to a firebase callable function to make
 * it easier to return the body of the request or an error without having to repeat
 * the same few lines of code with async/await keywords that is wrapped in a try catch.
 *
 * Last edited by: Ryan Lefebvre 7/13/2020
 */
@Injectable({
  providedIn: 'root',
})
export class CallableWrapperService {
  /**
   * @ignore
   */
  constructor(
    public fireFunc: AngularFireFunctions,
    public snackBarManager: SnackBarService,
    public http: HttpService
  ) {}

  /**
   * Makes a request to a firebase callable cloud function with the name functionName
   * and passes functionBody as the body of the request for the callable function.
   */
  async firebaseCloudFunction<InputType, OutputType>(
    functionName: string,
    functionBody: InputType,
    successMessage: string,
    failureMessage: string,
    dontShowMessage?: boolean
  ): Promise<ApiResponse<OutputType>> {
    const shouldShowMessage = !dontShowMessage;
    try {
      const response: ApiResponse<OutputType> = await this.fireFunc
        .httpsCallable(functionName)(functionBody)
        .toPromise();
      if (response.error && shouldShowMessage) {
        this.snackBarManager.showFailureMessage(response.error.message);
      } else if (shouldShowMessage) {
        this.snackBarManager.showSuccessMessage(successMessage);
      }
      return response;
    } catch (error) {
      if (shouldShowMessage) {
        this.snackBarManager.showFailureMessage(
          error.code
            ? this.http.getFormattedErrorResponse(error).error.message
            : failureMessage
        );
      }
      return error;
    }
  }
}
