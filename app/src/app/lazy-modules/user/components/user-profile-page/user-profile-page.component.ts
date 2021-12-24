import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { RoutesService } from 'src/app/services/constants/routes.service';
import { AuthenticationService } from 'src/app/services/firebase/authentication.service';
import { UserService } from 'src/app/services/firebase/user.service';
import { ApiResponse } from '../../../../../../../shared/classes/api-response';
import { UserProfile } from '../../../../../../../shared/classes/user-profile';

/**
 * Parses query parameters to get uid or defaults to currently
 * authenticated user's uid. Loads and displays the user's profile.
 */
@Component({
  selector: 'app-user-profile-page',
  templateUrl: './user-profile-page.component.html',
  styleUrls: ['./user-profile-page.component.css'],
})
export class UserProfilePageComponent implements OnInit, OnDestroy {
  /**
   * Reference to this component so the fetcher can call functions
   * defined in the body of this component.
   */
  context: UserProfilePageComponent = this;

  /**
   * User profile that is returned from the fetcher.
   */
  user: UserProfile;

  /**
   * UID of the user that the fetcher should request.
   * If there is no UID in the query params, then will
   * default to uid of the current user
   */
  uid: string = this.getUidFromRoute();

  /**
   * Reference to the active route subscription.
   */
  routeSub: Subscription;

  /**
   * @ignore
   */
  constructor(
    public userService: UserService,
    public auth: AuthenticationService,
    public router: RoutesService
  ) {}

  /**
   * @ignore
   */
  ngOnInit(): void {
    this.listenToRouteChanges();
  }

  /**
   * @ignore
   */
  ngOnDestroy(): void {
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }

  /**
   * Subscribes to changes in the route to see if the uid changed.
   */
  listenToRouteChanges(): void {
    this.routeSub = this.router.activatedRoute.queryParams.subscribe(
      () => (this.uid = this.getUidFromRoute())
    );
  }

  /**
   * Gets the UID from the route if it exists or returns the UID of the user
   * that is currently authenticated.
   */
  getUidFromRoute(): string {
    return (
      this.router.getQueryParam(this.router.UID_PARAM_KEY) ||
      this.auth.getCurrentUserID()
    );
  }

  /**
   * Passed into the fetcher component to get the user profile with whatever the latest uid is.
   */
  async fetchUser(
    context: UserProfilePageComponent,
    uid: string
  ): Promise<ApiResponse<UserProfile>> {
    return await context.userService.getUserProfile(uid);
  }

  /**
   * Sets the input variable to the user property component whenever the fetcher responds.
   */
  onFetchResponse(formattedResponse: UserProfile): void {
    this.user = formattedResponse;
  }
}
