import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

/**
 * Dialog that will wait for an asynchronous operation and
 * not be able to be closed until the operation completes successfully
 * or errors out. Once that happens the dialog will close itself.
 *
 * Last edited by: Ryan Lefebvre 12/11/2020
 */
@Component({
  selector: 'app-wait-for-operation',
  templateUrl: './wait-for-operation-dialog.component.html',
  styleUrls: ['./wait-for-operation-dialog.component.css'],
})
export class WaitForOperationDialog implements OnInit {
  /**
   * @ignore
   */
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: Record<string, Function>,
    public dialogRef: MatDialogRef<WaitForOperationDialog>
  ) {}

  /**
   * @ignore
   */
  ngOnInit(): void {
    this.waitForOperation();
  }

  /**
   * This component is expected to be passed an asynchronous lambda that
   * will make some type of request. This function disables closing on the
   * dialog, waits for the fucntion if it exists and then closes the dialog
   * once it returns.
   */
  async waitForOperation(): Promise<void> {
    this.dialogRef.disableClose = true;
    const response = await this.data.logic();
    this.dialogRef.close(response);
  }
}
