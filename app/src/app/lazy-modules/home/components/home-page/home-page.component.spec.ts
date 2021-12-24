/* eslint-disable @typescript-eslint/no-explicit-any */
import { ActivatedRoute, Router } from '@angular/router';
import { HomePageComponent } from './home-page.component';
import { autoSpy } from 'autoSpy';
import { RoutesService } from 'src/app/services/constants/routes.service';
import { AuthenticationService } from 'src/app/services/firebase/authentication.service';
import { TextService } from 'src/app/services/constants/text.service';

describe('HomePageComponent', () => {
  let component: HomePageComponent;

  beforeEach(() => {
    component = setup().build();
  });

  it('should not crash when the component is created or destroyed', () => {
    let crashed = false;
    try {
      component.ngOnInit();
    } catch {
      crashed = true;
    }
    expect(crashed).toBe(false);
  });

  it('should navigate to the register form when goToRegister is called', () => {
    const expectedRoute = component.routesService.paths.register;
    component.routesService.navigate = (route) => {
      expect(route[0]).toBe(expectedRoute);
      return {} as any;
    };
    component.goToRegister();
  });

  it('should navigate to the sign-in form when goToSignIn() is called', () => {
    const expectedRoute = component.routesService.paths.signIn;
    component.routesService.navigate = (route) => {
      expect(route[0]).toBe(expectedRoute);
      return {} as any;
    };
    component.goToSignIn();
  });

  it('should go to the terms page when goToTerms() is called ', () => {
    const expectedRoute = component.routesService.paths.terms;
    component.routesService.navigate = (route) => {
      expect(route[0]).toBe(expectedRoute);
      return {} as any;
    };
    component.goToTerms();
  });

  it('should go to the privacy page when goToPrivacy() is called ', () => {
    const expectedRoute = component.routesService.paths.privacy;
    component.routesService.navigate = (route) => {
      expect(route[0]).toBe(expectedRoute);
      return {} as any;
    };
    component.goToPrivacy();
  });

  it('should go to the dashboard when goToDash is called ', () => {
    const expectedRoute = component.routesService.paths.dashboard;
    component.routesService.navigate = (route) => {
      expect(route[0]).toBe(expectedRoute);
      return {} as any;
    };
    component.goToDash();
  });
});

function setup() {
  const auth = autoSpy(AuthenticationService);
  // easier to work with a real one than a mock
  const router = new RoutesService(autoSpy(Router), autoSpy(ActivatedRoute));
  const textService = autoSpy(TextService);
  const builder = {
    auth,
    router,
    textService,
    default() {
      return builder;
    },
    build() {
      jasmine.getEnv().allowRespy(true);
      return new HomePageComponent(auth, router, textService);
    },
  };

  return builder;
}
