/**
 * Class used to represent routes/pages within the application
 *
 * Last edited by: Ryan Lefebvre 10/27/2021
 */
export class NavBarRoute {
  /**
   * Name given to the route and displayed in UI.
   */
  public name = '';

  /**
   * Actual path of the route that is appened to URL.
   */
  public path = '';

  /**
   * Name of the icon that will be displayed next to the route.
   */
  public icon: string = null;

  /**
   * True if the route should only be able to be accessed by
   * authenticated users
   */
  public onlyAuthenticated = false;

  /**
   * True if the route should only be able to be accessed by
   * unauthenticated users
   */
  public onlyUnauthenticated = false;

  /**
   * Returns true if this route is accessible by the current
   * user based on their authentication status
   *
   * @param userIsAuthenticated true if the user is authenticated.
   */
  public canAccess(userIsAuthenticated: boolean): boolean {
    const anyOneCanAccess =
      !this.onlyAuthenticated && !this.onlyUnauthenticated;
    if (anyOneCanAccess) {
      return true;
    } else {
      const authenticatedAccess = this.onlyAuthenticated && userIsAuthenticated;
      const unauthenticatedAccess =
        !this.onlyAuthenticated && !userIsAuthenticated;
      return authenticatedAccess || unauthenticatedAccess;
    }
  }

  /**
   * Assigns value and display name to class properties.
   *
   * @param name name of the route that is displayed.
   * @param path actual path of the route.
   * @param icon mat icon displayed.
   * @param onlyAuthenticated true if only authenticated users can access the route.
   * @param onlyUnauthenticated true if only unauthenticated users can access the route.
   */
  constructor(
    name: string,
    path: string,
    icon: string,
    onlyAuthenticated: boolean,
    onlyUnauthenticated: boolean
  ) {
    this.name = name;
    this.path = path;
    this.icon = icon;
    this.onlyAuthenticated = onlyAuthenticated;
    this.onlyUnauthenticated = onlyUnauthenticated;
  }
}
