import { Component, OnInit } from '@angular/core';
import { TextService } from 'src/app/services/constants/text.service';

/**
 *  Privacy Policy document in static HMTL. All changes to this document are made in the HTML.
 *  Whenever the HTML is updated, the author of the edits should update the "Last edited" date
 *  at the top of the file.
 *
 *  Last edited by: Bowen Bilodeau 7/28/2020
 */
@Component({
  selector: 'app-privacy',
  templateUrl: './privacy.component.html',
  styleUrls: ['./privacy.component.css'],
})
export class PrivacyComponent implements OnInit {
  /**
   *@ignore
   */
  constructor(public textService: TextService) {}

  /**
   *@ignore
   */
  ngOnInit(): void {}
}
