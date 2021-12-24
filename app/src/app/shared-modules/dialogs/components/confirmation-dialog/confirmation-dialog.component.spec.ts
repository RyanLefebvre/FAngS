/* eslint-disable @typescript-eslint/no-explicit-any */
import { ConfirmationDialogComponent } from './confirmation-dialog.component';
import { autoSpy } from 'autoSpy';
import { TextService } from 'src/app/services/constants/text.service';

describe('ConfirmationDialogComponent', () => {
  let component: ConfirmationDialogComponent;

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

  it('should close the dialog when closeDialog() is called', () => {
    component.closeDialog();
    expect(component.dialogRef.close).toHaveBeenCalled();
  });

  it('should disable closing, show the spinner and wait on the confirm logic when confirm is called, then turn the spinner off after the timeout ', async () => {
    expect(component.showSpinner).toBe(false);
    expect(component.dialogRef.disableClose).toBe(false);
    component.data['confirmationLogic'] = async () => {
      expect(component.showSpinner).toBe(true);
      expect(component.dialogRef.disableClose).toBe(true);
    };
    component.closeDialog = jasmine.createSpy();
    await component.confirm();
    jasmine.clock().tick(601);
    expect(component.closeDialog).toHaveBeenCalled();
  });
});

function setup() {
  const dialogRef = {
    // easier than mocking is just to define methods we need.
    close: jasmine.createSpy(),
    disableClose: false,
  } as any;
  const textService = autoSpy(TextService);
  const builder = {
    dialogRef,
    textService,
    default() {
      return builder;
    },
    build() {
      return new ConfirmationDialogComponent(dialogRef, {}, textService);
    },
  };

  return builder;
}
