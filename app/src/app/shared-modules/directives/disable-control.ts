import { NgControl } from '@angular/forms';
import { Directive, Input, OnInit } from '@angular/core';

/**
 * Angular reactive forms force us to programmatically enable or disable a form control. If an attempt
 * is made to use the 'disabled' attribute of an element linked to a form control, then an error is thrown.
 * This custom directive allows us to use the template driven approach to disabling a form control without
 * causing Angular to throw errors.
 *
 * This was a alot simpler before, but after jumping multiple major versions
 * of Angular at once, We ran into this issue: https://github.com/angular/angular/issues/36197
 *
 * Last edited by: Ryan Lefebvre 12/19/2020
 */
@Directive({
  selector: '[disableControl]',
})
export class DisableControlDirective implements OnInit {
  /**
   * Updates control condition if disabled is not undefined.
   */
  @Input() set disableControl(condition: boolean) {
    if (this.disabled !== undefined) {
      this.toggleForm(condition);
    }
    this.disabled = condition;
  }

  /**
   * True if disabled, false otherwise.
   */
  disabled: boolean;

  /**
   * @ignore
   */
  constructor(private ngControl: NgControl) {}

  /**
   * @ignore
   */
  ngOnInit(): void {
    this.toggleForm(this.disabled);
  }

  /**
   * Disables the control if condition is true, otherwise
   * will enable the control.
   */
  toggleForm(condition: boolean): void {
    const action = condition ? 'disable' : 'enable';
    this.ngControl.control[action]();
  }
}
