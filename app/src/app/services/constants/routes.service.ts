import { Injectable } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { NavBarRoute as NavBarRoute } from 'src/app/classes/route';
import { routes, completePaths } from 'src/app/constants/routes';

/**
 * This service exposes the routes in the app to the components.
 * The reason that the routes are stored in a constants file is
 * because the modules also need access to the routes.
 *
 * So any module that needs to acces the routes imports them directly
 * from the constants file but any component/service that need access
 * wil go through this service so that it can be easily injected into
 * the constructor.
 *
 * Last edited by: Ryan Lefebvre 10/27/2021
 */
@Injectable({
  providedIn: 'root',
})
export class RoutesService {
  /**
   * All the routes in the app that are displayed in the navbar.
   */
  routes: NavBarRoute[] = routes;

  /**
   * Handles getting the full path to a route in
   * the application when routerlink is used.
   */
  paths = completePaths;

  /**
   * Value of the userID query param key
   */
  UID_PARAM_KEY = 'uid';

  /**
   * @ignore
   */
  constructor(public router: Router, public activatedRoute: ActivatedRoute) {}

  /**
   * Wrapper around Angular router navigate to avoid
   * components needing to import the RoutesService and Router.
   */
  navigate(commands: string[], extras?: NavigationExtras): Promise<boolean> {
    return this.router.navigate(commands, extras);
  }

  /**
   * Returns the value of a query param given the query param key.
   */
  getQueryParam(key: string): string {
    return this.activatedRoute.snapshot.queryParamMap.get(key);
  }
}
