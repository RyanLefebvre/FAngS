import { autoSpy } from 'autoSpy';
import { TextService } from 'src/app/services/constants/text.service';
import { PrivacyComponent } from './privacy.component';

describe('PrivacyComponent', () => {
  let component: PrivacyComponent;

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
  const textService = autoSpy(TextService);
  const builder = {
    default() {
      return builder;
    },
    build() {
      return new PrivacyComponent(textService);
    },
  };

  return builder;
}
