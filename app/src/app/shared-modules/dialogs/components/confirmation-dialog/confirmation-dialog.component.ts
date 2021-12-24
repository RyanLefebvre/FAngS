import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TextService } from 'src/app/services/constants/text.service';

/**
 * A dialog that is used to confirm and execute operations. The dialog is
 * given a title, a prompt to display about the action being performed, logic to perform
 * if the confirmation is successful and a spinner message to display while the logic
 * is executing. This dialog is not responsible for any snackbar notifications associated
 * with the confirmation logic and cannot be closed once the logic begins until the request
 * associated with the logic returns.
 *
 * Last edited by: Ryan Lefebvre 12/23/2020
 */
@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.css'],
})
export class ConfirmationDialogComponent implements OnInit {
  /**
   * True if the spinner should be shown, false otherwise.
   */
  showSpinner = false;

  /**
   * @ignore
   */
  constructor(
    public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Record<string, Function>,
    public textService: TextService
  ) {}

  /**
   * @ignore
   */
  ngOnInit(): void {}

  /**
   * Click handler for the confirmation button. Turns on the spinner,
   * disables closing the dialog and executes the logic to perform.
   * Lastly closes the dialog.
   */
  async confirm(): Promise<void> {
    try {
      this.dialogRef.disableClose = true;
      this.showSpinner = true;
      const confirmLogic: Function = this.data.confirmationLogic;
      await confirmLogic();
    } catch (error) {}
    setTimeout(() => this.closeDialog(), 600);
  }

  /**
   * A wrapper function around the logic responsible for closing the dialog.
   */
  closeDialog(): void {
    this.dialogRef.close();
  }
}
