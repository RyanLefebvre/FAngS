import { AbstractControl } from '@angular/forms';

/**
 * Form control used to validate text for profile edit and register page.
 * Constraints are that the text must be a valid string less than or equal
 * to 25 characters or be null. If text is invalid, then an error is returned,
 * otherwise null is returned indicating a valid text.
 *
 * @param control control value to check.
 *
 * Last edited by: Ryan Lefebvre 7/03/2020
 */
export function getTextValidation(maxLength = 25, minLength = 0) {
  return (control: AbstractControl): boolean | Record<string, unknown> => {
    const textInvalid: {} = { INVALID_TEXT: true };
    const textValid = null;

    const text: string = control.value;
    const textIsNull: boolean = text == null;

    if (textIsNull) {
      return textValid;
    } else {
      const textIsString: boolean = typeof text == 'string';
      if (!textIsString) {
        return textInvalid;
      } else {
        const textLength: number = text.length;
        const textIsValidLength: boolean =
          minLength <= textLength && textLength <= maxLength;
        if (textIsValidLength) {
          return textValid;
        } else {
          return textInvalid;
        }
      }
    }
  };
}
