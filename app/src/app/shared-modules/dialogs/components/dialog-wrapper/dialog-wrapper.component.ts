import { Component, Input, OnInit } from '@angular/core';

/**
 * Wrapper component that should be the parent for
 * any dialog components content to standardize the
 * styles.
 *
 * Last edited by: Ryan Lefebvre 7/27/2020
 */
@Component({
  selector: 'app-dialog-wrapper',
  templateUrl: './dialog-wrapper.component.html',
  styleUrls: ['./dialog-wrapper.component.css'],
})
export class DialogWrapperComponent implements OnInit {
  /**
   * Mat icon displayed in the upper left hand side of the dialog.
   */
  @Input()
  icon: string;

  /**
   * Center aligned title displayed at top of dialog.
   */
  @Input()
  title: string;

  /**
   * Optional message displayed beneath the header.
   */
  @Input()
  message: string;

  /**
   * True if the message should be hidden. False otherwise.
   */
  @Input()
  hideMessage: boolean;

  /**
   * @ignore
   */
  constructor() {}

  /**
   * @ignore
   */
  ngOnInit(): void {}
}
