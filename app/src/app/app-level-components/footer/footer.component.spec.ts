import { FooterComponent } from './footer.component';
import { autoSpy } from 'autoSpy';
import { RoutesService } from 'src/app/services/constants/routes.service';
import { TextService } from 'src/app/services/constants/text.service';

describe('FooterComponent', () => {
  let component: FooterComponent;

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

  it('should return true when window.innerWidth > 540', () => {
    spyOnProperty(window, 'innerWidth').and.returnValue(600);
    expect(component.showContactInfo()).toBe(true);
  });

  it('should return true when window.innerWidth <= 540', () => {
    spyOnProperty(window, 'innerWidth').and.returnValue(540);
    expect(component.showContactInfo()).toBe(false);
  });
});

function setup() {
  const routesService = autoSpy(RoutesService);
  const textService = autoSpy(TextService);
  const builder = {
    routesService,
    default() {
      return builder;
    },
    build() {
      return new FooterComponent(routesService, textService);
    },
  };

  return builder;
}
