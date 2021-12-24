import { Injectable } from '@angular/core';
import { text } from '../../../../../shared/constants/text';

/**
 * This service exposes any plain text in the app. All plain text
 * should come from the text.ts file in the shared/constants
 * directory.
 *
 * Any module can import the text directly but any component/service
 * that need access wil go through this service so that it can be
 * easily injected into the constructor.
 *
 * Last edited by: Ryan Lefebvre 11/30/2021
 */
@Injectable({
  providedIn: 'root',
})
export class TextService {
  /**
   * All the routes in the app that are displayed in the navbar.
   */
  text = text;

  /**
   * @ignore
   */
  constructor() {}
}
