import { autoSpy } from 'autoSpy';
import { AppComponent } from './app.component';
import { AuthenticationService } from './services/firebase/authentication.service';

describe('AppComponent', () => {
  let component: AppComponent;

  beforeEach(() => {
    const { build } = setup().default();
    component = build();
  });

  it('should call listenForAuthChanges when ngOnInit() is called', () => {
    component.ngOnInit();
    expect(component.authManager.listenForAuthChanges).toHaveBeenCalled();
  });

  it('should scroll to the top when onActivate is called', () => {
    window.scroll = jasmine.createSpy();
    component.onActivate();
    expect(window.scroll).toHaveBeenCalledWith(0, 0);
  });
});

function setup() {
  const authManager = autoSpy(AuthenticationService);
  const builder = {
    default() {
      return builder;
    },
    build() {
      return new AppComponent(authManager);
    },
  };
  return builder;
}
