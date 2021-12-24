/* eslint-disable @typescript-eslint/no-explicit-any */
import { UserService } from 'src/app/services/firebase/user.service';
import { AuthenticationService } from 'src/app/services/firebase/authentication.service';
import { RoutesService } from 'src/app/services/constants/routes.service';
import { UserProfilePageComponent } from './user-profile-page.component';
import { autoSpy } from 'autoSpy';
import { UserProfile } from '../../../../../../../shared/classes/user-profile';

describe('UserProfilePageComponent', () => {
  let component: UserProfilePageComponent;

  beforeEach(() => {
    component = setup().default().build();
  });

  it('should listen for route changes whenever ngOnInit() is called', () => {
    component.listenToRouteChanges = jasmine.createSpy();
    component.ngOnInit();
    expect(component.listenToRouteChanges).toHaveBeenCalled();
  });

  it('should unsubscribe from the route sub if it is null when ngOnDestroy is called', () => {
    component.routeSub = {
      unsubscribe: jasmine.createSpy(),
    } as any;
    component.ngOnDestroy();
    expect(component.routeSub.unsubscribe).toHaveBeenCalled();
  });

  it('should NOT unsubscribe from the route sub if it is null when ngOnDestroy is called', () => {
    const unsubRef = jasmine.createSpy();
    component.routeSub = {
      unsubscribe: unsubRef,
    } as any;
    component.routeSub = null;
    component.ngOnDestroy();
    expect(unsubRef).not.toHaveBeenCalled();
  });

  it('should set the uid to the value returned from getUidFromRoute when the listenToRouteChanges subscription body executes', () => {
    let lamRef;
    component.router = {
      activatedRoute: {
        queryParams: {
          subscribe: (someLambda) => (lamRef = someLambda),
        },
      },
    } as any;
    const expectedRetVal = 'someRandomVal';
    component.getUidFromRoute = () => expectedRetVal;
    component.listenToRouteChanges();
    lamRef();
    expect(component.uid).toBe(expectedRetVal);
  });

  it('should get the user profile from the context when fetchUser is called', async () => {
    const context = {
      userService: {
        getUserProfile: jasmine.createSpy(),
      },
    } as any;
    const fakeUID = 'someUID';
    await component.fetchUser(context, fakeUID);
    expect(context.userService.getUserProfile).toHaveBeenCalledWith(fakeUID);
  });

  it('should set the user input to the formatted response when onFetchResponse is called', () => {
    const someResponse = new UserProfile();
    component.onFetchResponse(someResponse);
    expect(component.user).toBe(someResponse);
  });
});

function setup() {
  const userService = autoSpy(UserService);
  const auth = autoSpy(AuthenticationService);
  const router = autoSpy(RoutesService);
  const builder = {
    userService,
    auth,
    router,
    default() {
      return builder;
    },
    build() {
      return new UserProfilePageComponent(userService, auth, router);
    },
  };

  return builder;
}
