import { VerifyEmailComponent } from './verify-email.component';
import { autoSpy } from 'autoSpy';
import { RoutesService } from 'src/app/services/constants/routes.service';
import { TextService } from 'src/app/services/constants/text.service';

describe('VerifyEmailComponent', () => {
  let component: VerifyEmailComponent;

  beforeEach(() => {
    component = setup().default().build();
  });

  it('should not crash when ngOnInit is called ', () => {
    let crashed = false;
    try {
      component.ngOnInit();
    } catch (error) {
      crashed = true;
    }
    expect(crashed).toBe(false);
  });
});

function setup() {
  const routesService = autoSpy(RoutesService);
  const textService = autoSpy(TextService);
  const builder = {
    routesService,
    textService,
    default() {
      return builder;
    },
    build() {
      return new VerifyEmailComponent(routesService, textService);
    },
  };

  return builder;
}
