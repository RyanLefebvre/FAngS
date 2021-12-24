import { DialogWrapperComponent } from './dialog-wrapper.component';

describe('DialogWrapperComponent', () => {
  let component: DialogWrapperComponent;

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
  const builder = {
    default() {
      return builder;
    },
    build() {
      return new DialogWrapperComponent();
    },
  };

  return builder;
}
