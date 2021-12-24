import { Component, OnInit } from '@angular/core';
import { RoutesService } from 'src/app/services/constants/routes.service';
import { TextService } from 'src/app/services/constants/text.service';

/**
 * This is the component that the user is redirected to after a successful registration.
 * It is a mat-card that contains a message to remind the user to check their email and
 * to follow the instructions in the email before their next authentication to be given
 * access to the app. At the bottom of the card is an email to contact for support and
 * there are also two links. One navigates the user to the sign in page and the
 * other navigates them to the home page.
 *
 * Last edited by: Ryan Lefebvre 6/26/2020
 */
@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.css'],
})
export class VerifyEmailComponent implements OnInit {
  /**
   * @ignore
   */
  constructor(
    public routesService: RoutesService,
    public textService: TextService
  ) {}

  /**
   * @ignore
   */
  ngOnInit(): void {}
}
