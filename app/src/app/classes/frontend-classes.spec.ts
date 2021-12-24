import { NavBarRoute } from './route';

describe('Frontend Classes', () => {
  it('should return true if the user is not authenticated and the page can be accessed by anyone', () => {
    const testNavBarRoute = new NavBarRoute(
      'someRoute',
      'somePath',
      'someIcon',
      false,
      false
    );
    expect(testNavBarRoute.canAccess(false)).toBe(true);
  });

  it('should return false if the user is not authenticated and the page can only be accessed when authenticated', () => {
    const testNavBarRoute = new NavBarRoute(
      'someRoute',
      'somePath',
      'someIcon',
      true,
      false
    );
    expect(testNavBarRoute.canAccess(false)).toBe(false);
  });

  it('should return false if the user is authenticated and the page can only be accessed when NOT authenticated', () => {
    const testNavBarRoute = new NavBarRoute(
      'someRoute',
      'somePath',
      'someIcon',
      false,
      true
    );
    expect(testNavBarRoute.canAccess(true)).toBe(false);
  });

  it('should return true if the user is not uthenticated and the page can only be accessed when authenticated', () => {
    const testNavBarRoute = new NavBarRoute(
      'someRoute',
      'somePath',
      'someIcon',
      true,
      false
    );
    expect(testNavBarRoute.canAccess(true)).toBe(true);
  });

  it('should return true if the user is authenticated and the page can only be accessed when NOT authenticated', () => {
    const testNavBarRoute = new NavBarRoute(
      'someRoute',
      'somePath',
      'someIcon',
      false,
      true
    );
    expect(testNavBarRoute.canAccess(false)).toBe(true);
  });
});
