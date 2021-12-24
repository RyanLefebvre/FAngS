/**
 * Class that represents a response from a callable cloud function. 
 * May contain data of any type or an error.
 * 
 * Last edited by: Ryan Lefebvre 11/23/2021
 */
export class ApiResponse<DataType> {

    /**
     * Data returned from a successful request.
     */
    data?: DataType;

    /**
     * HTTP status code of the response 
     */
    code?: number | string;

    /**
     * Error object if an error occurs.
     */
    error?: {

        /**
         * Message that explains reason for error.
         */
        message: string;

    }


}