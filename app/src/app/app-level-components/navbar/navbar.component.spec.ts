import { NavBarComponent } from './navbar.component';
import { autoSpy } from 'autoSpy';
import { RoutesService } from 'src/app/services/constants/routes.service';
import { AuthenticationService } from 'src/app/services/firebase/authentication.service';

describe('NavBarComponent', () => {
  let component: NavBarComponent;

  beforeEach(() => {
    component = setup().default().build();
  });

  it('should not break when ngOnInit() is called ', () => {
    let crashed = false;
    try {
      component.ngOnInit();
    } catch {
      crashed = true;
    }
    expect(crashed).toBe(false);
  });
});

function setup() {
  const routesService = autoSpy(RoutesService);
  const authService = autoSpy(AuthenticationService);
  const builder = {
    routesService,
    authService,
    default() {
      return builder;
    },
    build() {
      return new NavBarComponent(routesService, authService);
    },
  };

  return builder;
}
