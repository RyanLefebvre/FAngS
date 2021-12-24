import { Component, OnInit } from '@angular/core';

/**
 * This is the first component that will load for an authenticated
 * user. Typically some type of dashboard or whatever the main view
 * of the application is.
 *
 * Last edited by: Ryan Lefebvre 10/27/2021
 */
@Component({
  selector: 'app-individual-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  /**
   * @ignore
   */
  constructor() {}

  /**
   * @ignore
   */
  ngOnInit(): void {}
}
