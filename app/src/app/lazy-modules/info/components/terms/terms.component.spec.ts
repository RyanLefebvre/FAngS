import { autoSpy } from 'autoSpy';
import { TextService } from 'src/app/services/constants/text.service';
import { TermsComponent } from './terms.component';

describe('TermsComponent', () => {
  let component: TermsComponent;
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
      return new TermsComponent(textService);
    },
  };

  return builder;
}
