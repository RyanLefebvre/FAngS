import { Component, OnInit } from '@angular/core';
import { RoutesService } from 'src/app/services/constants/routes.service';
import { AuthenticationService } from 'src/app/services/firebase/authentication.service';
import { TextService } from 'src/app/services/constants/text.service';

/**
 * This is the homepage to the application. It is responsible for
 * directing users to register or to sign-in.
 *
 * Last edited by: Ryan Lefebvre 6/20/2020
 */
@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css'],
})
export class HomePageComponent implements OnInit {
  /**
   * @ignore
   */
  constructor(
    public auth: AuthenticationService,
    public routesService: RoutesService,
    public textService: TextService
  ) {}

  /**
   * @ignore
   */
  ngOnInit(): void {}

  /**
   * Helper function for register button to navigate
   * to the register form in the call to action section.
   */
  goToRegister(): void {
    this.routesService.navigate([this.routesService.paths.register]);
  }

  /**
   * Navigates to the sign-in/log-in page.
   */
  goToSignIn(): void {
    this.routesService.navigate([this.routesService.paths.signIn]);
  }

  /**
   * Navigates to the terms page.
   */
  goToTerms(): void {
    this.routesService.navigate([this.routesService.paths.terms]);
  }

  /**
   * Navigates to the privacy policy page.
   */
  goToPrivacy(): void {
    this.routesService.navigate([this.routesService.paths.privacy]);
  }

  /**
   * Navigates to the dashboard page.
   */
  goToDash(): void {
    this.routesService.navigate([this.routesService.paths.dashboard]);
  }
}
