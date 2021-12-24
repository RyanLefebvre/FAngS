import { autoSpy } from 'autoSpy';
import { TextService } from 'src/app/services/constants/text.service';
import { TermsTextComponent } from './terms.component';

describe('DialogWrapperComponent', () => {
  let component: TermsTextComponent;

  beforeEach(() => {
    const { build } = setup().default();
    component = build();
    jasmine.clock().install();
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('should not crash when ngOnInit() is called', () => {
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
    textService,
    default() {
      return builder;
    },
    build() {
      return new TermsTextComponent(textService);
    },
  };

  return builder;
}
