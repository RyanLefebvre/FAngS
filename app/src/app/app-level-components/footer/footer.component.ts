import { Component, OnInit } from '@angular/core';
import { RoutesService } from 'src/app/services/constants/routes.service';
import { TextService } from 'src/app/services/constants/text.service';

/**
 * Footer for every page of the web application.
 * The purpose of the footer is to help visitors by adding
 * information and navigation options at the bottom of web pages.
 *
 * Last edited by: Ryan Lefebvre 6/19/2020
 */
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
})
export class FooterComponent implements OnInit {
  /**
   * Copyright needs to be updated if there has been
   * any contribution made to work during a given year.
   * We are constantly updating the application and this keeps
   * our copyright date current no matter what.
   */
  currentYear: number = new Date().getFullYear();

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

  /**
   * Helper method for hiding the support email on small screens.
   * This prevents any overflow from the footer.
   */
  showContactInfo(): boolean {
    return window.innerWidth > 540;
  }
}
