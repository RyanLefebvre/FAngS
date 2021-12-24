import { Component, Input, OnInit } from '@angular/core';
import { TextService } from 'src/app/services/constants/text.service';
import { ApiResponse } from '../../../../../../../shared/classes/api-response';
import { NOT_FOUND_ERROR } from '../../../../../../../shared/constants/http';

/**
 * Page used as a falback whenever there is an error that
 * can not be handled and we need a view to display it.
 */
@Component({
  selector: 'app-error-page',
  templateUrl: './error-page.component.html',
  styleUrls: ['./error-page.component.css'],
})
export class ErrorPageComponent implements OnInit {
  /**
   * Api Response error object.
   */
  @Input()
  errorResponse: ApiResponse<Record<string, unknown>> = NOT_FOUND_ERROR;

  /**
   * @ignore
   */
  constructor(public textService: TextService) {}

  /**
   * @ignore
   */
  ngOnInit(): void {}
}
