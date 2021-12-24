import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
} from '@angular/core';
import { HttpService } from 'src/app/services/constants/http-service';
import { ApiResponse } from '../../../../../../../shared/classes/api-response';

/**
 * Used as a wrapper to fetch data for a child component to
 * standardize how failed requests are handled and avoid
 * repeating the same try catch fetch code in a bunch of
 * components.
 *
 * Last edited by: Ryan Lefebvre 6/26/2020
 */
@Component({
  selector: 'app-fetcher',
  templateUrl: './fetcher.component.html',
  styleUrls: ['./fetcher.component.css'],
})
export class FetcherComponent implements OnInit, OnChanges {
  /**
   * Fetch function should return some data that is
   * passed into a child component.
   */
  @Input()
  fetch: (
    context: Component,
    input: Record<string, unknown>
  ) => Promise<ApiResponse<Record<string, unknown>>>;

  /**
   * Reference to the parent components context
   */
  @Input()
  context: Component;

  /**
   * Formats the data before passing it to the
   * success component
   */
  @Input()
  format: Function = (value) => value;

  /**
   * True if the request is being made. False otherwise.
   */
  loading = true;

  /**
   * Whatever is returned from a successful fetch and
   * passed into the child component.
   */
  @Output() onFetchResponse = new EventEmitter<Record<string, unknown>>();

  /**
   * Reponse from the request on success.
   */
  response: ApiResponse<Record<string, unknown>>;

  /**
   * Response from the request on error
   */
  error: ApiResponse<Record<string, unknown>>;

  /**
   * True if inital fetch has been completed
   * False otherwise.
   */
  initialFetchCompleted = false;

  /**
   * If true, the component will refetch the data if
   * any of the inputs are changed.
   */
  @Input()
  refetchOnChanges = true;

  /**
   * Used as input to the fetch request.
   */
  @Input()
  fetchInput: Record<string, unknown>;

  /**
   * @ignore
   */
  constructor(public http: HttpService) {}

  /**
   * Makes a request to fetch data from the given context.
   */
  async ngOnInit(): Promise<void> {
    this.fetchDataFromContext();
  }

  /**
   * If the intial fetch has happened and an input chanbges,
   * then this onChange handler will refetch the data.
   */
  async ngOnChanges(): Promise<void> {
    if (this.initialFetchCompleted && this.refetchOnChanges) {
      this.fetchDataFromContext();
    }
  }

  /**
   * Fetches data using the fetcher and fetcher input passed in.
   * Updates success and failure state variables based on the
   * response.
   */
  async fetchDataFromContext(): Promise<void> {
    try {
      this.response = await this.fetch(this.context, this.fetchInput);
      if (this.response.error) {
        this.error = this.response;
      } else {
        const formattedResponse = this.format(this.response.data);
        this.onFetchResponse.emit(formattedResponse);
      }
    } catch (error) {
      console.log('here is the error', error);
      this.error = this.http.getFormattedErrorResponse(error);
    } finally {
      this.initialFetchCompleted = true;
      this.loading = false;
    }
  }

  /**
   * Returns true if the loader should be shown.
   */
  showLoader(): boolean {
    return this.loading;
  }

  /**
   * Returns true if the success component should be shown.
   */
  showSuccessComponent(): boolean {
    return !this.loading && this.response.data != null;
  }

  /**
   * Returns true if the failure component should be shown.
   */
  showFailureComponent(): boolean {
    return !this.loading && this.response.error != null;
  }
}
