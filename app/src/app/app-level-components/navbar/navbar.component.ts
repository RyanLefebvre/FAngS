import { Component, OnInit } from '@angular/core';
import { RoutesService } from 'src/app/services/constants/routes.service';
import { AuthenticationService } from 'src/app/services/firebase/authentication.service';

/**
 * Navbar for every page of the application. Helps users
 * navigate to other pages of the application. When the window
 * is wide, the navbar displays the links in the top right hand side.
 * When the window is narrow, the navbar will display a button that
 * activates a sidenav and displays the same links which would no longer
 * fit in the narrow window.
 *
 * Last edited by: Ryan Lefebvre 6/19/2020
 */
@Component({
  selector: 'app-nav-bar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavBarComponent implements OnInit {
  /**
   * @ignore
   */
  constructor(
    public routesService: RoutesService,
    public auth: AuthenticationService
  ) {}

  /**
   * @ignore
   */
  ngOnInit(): void {}
}
