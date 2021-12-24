import { Injectable } from '@angular/core';
import { FormControlPair } from '../../classes/form-control-pair';

/**
 * Serves as a wrapper around constant values in the user profile.
 * This class has nothing to do with application state. Constants
 * exported from this class include activity level and gender.
 *
 * Last edited by: Ryan Lefebvre 6/24/2020
 */
@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  /**
   * Key used to refer to user profile visbility of public
   */
  PROF_VIS_PUBLIC = 'public';

  /**
   * Name displayed for profile visbility public option of form controls.
   */
  PROF_VIS_PUBLIC_NAME = 'Public';

  /**
   * Form control for profile visbility public.
   */
  FORM_CONTROL_PROF_VIS_PUBLIC: FormControlPair = new FormControlPair(
    this.PROF_VIS_PUBLIC,
    this.PROF_VIS_PUBLIC_NAME
  );

  /**
   * Key used to refer to user profile visbility of private
   */
  PROF_VIS_PRIVATE = 'private';
  /**
   * Name displayed for profile visbility private option of form controls.
   */
  PROF_VIS_PRIVATE_NAME = 'Private';

  /**
   * Form control for profile visbility private.
   */
  FORM_CONTROL_PROF_VIS_PRIVATE: FormControlPair = new FormControlPair(
    this.PROF_VIS_PRIVATE,
    this.PROF_VIS_PRIVATE_NAME
  );

  /**
   * Returns a list of form controls that contains all valid genders.
   */
  getProfileVisibilityFormControls(): FormControlPair[] {
    const visbilities: FormControlPair[] = [
      this.FORM_CONTROL_PROF_VIS_PUBLIC,
      this.FORM_CONTROL_PROF_VIS_PRIVATE,
    ];
    return visbilities;
  }

  /**
   * @ignore
   */
  constructor() {}
}
