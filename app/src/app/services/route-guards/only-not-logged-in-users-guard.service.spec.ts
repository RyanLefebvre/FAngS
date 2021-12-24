/* eslint-disable @typescript-eslint/no-explicit-any */
import { OnlyNotLoggedInUsersGuard } from './only-not-logged-in-users-guard.service';
import { autoSpy } from 'autoSpy';
import { AuthenticationService } from '../firebase/authentication.service';
import { RoutesService } from '../constants/routes.service';

describe('OnlyNotLoggedInUsersGuard', () => {
  let guard: OnlyNotLoggedInUsersGuard;

  beforeEach(() => {
    guard = setup().default().build();
  });

  it('should return true if the user is not authenticated when canActivate is called', async () => {
    guard.auth.isAuthenticated = () => false;
    expect(await guard.canActivate()).toBe(true);
  });

  it('should navigate to the home page when canActivate is called if the user isauthenticated', async () => {
    guard.auth.isAuthenticated = () => true;
    let routeRef;
    guard.router = {
      navigate: (routeArr: string[]) => {
        routeRef = routeArr[0];
      },
      paths: {
        homepage: 'someRoute',
      },
    } as any;
    await guard.canActivate();
    expect(routeRef).toBe(guard.router.paths.homepage);
  });
});

function setup() {
  const auth = autoSpy(AuthenticationService);
  const router = autoSpy(RoutesService);
  const builder = {
    auth,
    router,
    default() {
      return builder;
    },
    build() {
      return new OnlyNotLoggedInUsersGuard(auth, router);
    },
  };

  return builder;
}
