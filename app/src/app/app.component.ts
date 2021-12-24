import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from './services/firebase/authentication.service';

/**
 * Top level component that serves as a container for all other components.
 *
 * Last edited by: Ryan Lefebvre 6/26/2020
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  /**
   * @ignore
   */
  constructor(public authManager: AuthenticationService) {}

  /**
   * @ignore
   */
  ngOnInit(): void {
    this.authManager.listenForAuthChanges();
  }

  /**
   * Scrolls window back to the top. Prevents opening a new
   * URL halfway down the page. This function is called  for every activate
   * event that is fired off tby the top level router-outlet component.
   */
  onActivate(): void {
    window.scroll(0, 0);
  }
}
