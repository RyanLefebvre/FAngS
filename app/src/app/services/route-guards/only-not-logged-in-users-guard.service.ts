import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { RoutesService } from '../constants/routes.service';
import { AuthenticationService } from '../firebase/authentication.service';

/**
 * Route guard used to protect routes that only unauthenticated users can access.
 *
 * Last edited by: Ryan Lefebvre 7/04/2020
 */
@Injectable({
  providedIn: 'root',
})
export class OnlyNotLoggedInUsersGuard implements CanActivate {
  /**
   *@ignore
   */
  constructor(
    public auth: AuthenticationService,
    public router: RoutesService
  ) {}

  /**
   * @ignore
   */
  async canActivate(): Promise<boolean> {
    await this.auth.doneLoading;
    const isAuthenticated: boolean = this.auth.isAuthenticated();
    if (isAuthenticated) {
      this.router.navigate([this.router.paths.homepage]);
    }
    return true;
  }
}
