/* eslint-disable @typescript-eslint/no-explicit-any */
import { WaitForOperationDialog } from './wait-for-operation-dialog.component';

describe(' WaitForOperationDialog', () => {
  let component: WaitForOperationDialog;

  beforeEach(() => {
    const { build } = setup().default();
    component = build();
  });

  it('should call wait for operation when ngOnInit() is called', () => {
    component.waitForOperation = jasmine.createSpy();
    component.ngOnInit();
    expect(component.waitForOperation).toHaveBeenCalled();
  });

  it('should wait for the function passed in and return the result when waitForOperation() is called', async () => {
    const retVal = 'someValue';
    const someOperation = jasmine.createSpy().and.returnValue(retVal);
    component.data = { logic: someOperation };
    await component.waitForOperation();
    expect(someOperation).toHaveBeenCalled();
    expect(component.dialogRef.close).toHaveBeenCalledWith(retVal);
  });
});

function setup() {
  const data = {};
  const dialogRef = {
    disableClose: false,
    close: jasmine.createSpy(),
  } as any;
  const builder = {
    data,
    dialogRef,
    default() {
      return builder;
    },
    build() {
      return new WaitForOperationDialog(data, dialogRef);
    },
  };

  return builder;
}
