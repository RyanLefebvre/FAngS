import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { SnackBarService } from 'src/app/shared-modules/material/snack-bar-manager.service';
import { TextService } from '../constants/text.service';
import { AuthenticationService } from './authentication.service';

/**
 * This service controls any interactiomn with the apps storage
 * bucket. This is primarily used when uploading images.
 */
@Injectable({
  providedIn: 'root',
})
export class StorageService {
  /**
   * Max file size for profile pictures 5mb
   */
  MAX_PROFILE_IMAGE_SIZE: number = 1024 * 1000 * 5;

  /**
   * @ignore
   */
  constructor(
    public afStorage: AngularFireStorage,
    public snackbarManager: SnackBarService,
    public auth: AuthenticationService,
    public textService: TextService
  ) {}

  /**
   * Uploads a file to the authenticated users directory in
   * the users sotrage bucket where their profile picture is
   * expected.
   */
  async uploadProfilePicture(file): Promise<string | null> {
    return this.uploadImage(
      file,
      `/users/${this.auth.getCurrentUserID()}/profilePicture`,
      null,
      this.textService.text.profilePicUploadFailed
    );
  }

  /**
   * Uploads a file to angular fire storage at the requested path.
   */
  async uploadImage(
    file,
    path: string,
    successMessage: string,
    failureMessage: string
  ): Promise<string | null> {
    const ref = this.afStorage.ref(path);
    return new Promise<string | null>((resolve) => {
      try {
        ref.put(file).then(() => {
          ref.getDownloadURL().subscribe((uploadedImageURL: string) => {
            if (successMessage) {
              this.snackbarManager.showSuccessMessage(successMessage);
            }
            resolve(uploadedImageURL);
          });
        });
      } catch (error) {
        this.snackbarManager.showFailureMessage(failureMessage);
        resolve(null);
      }
    });
  }
}
