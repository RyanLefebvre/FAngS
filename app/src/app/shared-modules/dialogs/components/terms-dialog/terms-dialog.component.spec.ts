/* eslint-disable @typescript-eslint/no-explicit-any */
import { TermsDialogComponent } from './terms-dialog.component';

describe('TermsDialogComponent', () => {
  let component: TermsDialogComponent;

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
      return new TermsDialogComponent({} as any);
    },
  };

  return builder;
}
