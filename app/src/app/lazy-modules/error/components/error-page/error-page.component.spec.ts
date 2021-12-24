import { ErrorPageComponent } from './error-page.component';
import { autoSpy } from 'autoSpy';
import { TextService } from 'src/app/services/constants/text.service';

describe('ErroPage', () => {
  let component: ErrorPageComponent;

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
});

function setup() {
  const textService = autoSpy(TextService);
  const builder = {
    textService,
    default() {
      return builder;
    },
    build() {
      return new ErrorPageComponent(textService);
    },
  };
  return builder;
}
