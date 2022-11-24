import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { WeTrackTicket } from 'src/app/models/we-track-ticket.model';
import { WeTrackService } from 'src/app/services/we-track.service';

@Component({
  selector: 'app-we-track-edit',
  templateUrl: './we-track-edit.component.html',
  styleUrls: ['./we-track-edit.component.scss']
})
export class WeTrackEditComponent implements OnInit {
  public isSubmitting: boolean = false; // For use in planned future feature where weTrack will freeze during an update to the database
  public isEditing: boolean = false; // Allows for style changes in html depending on if the user is editing or creating a new ticket

  // Prepare a dynamic FormGroup for all of the data from the DOM
  public weTrackForm = new FormGroup({
    'title': new FormControl('', Validators.required),
    'type': new FormControl('feature', Validators.required),
    'importance': new FormControl('low', Validators.required),
    'submitter': new FormControl('', Validators.required),
    'description': new FormControl('', Validators.required),
    // Optional fields that are 
    'isAssigned': new FormControl(false), // checkbox to show nested forms
      'assignee': new FormControl(),
      'status': new FormControl('pending'),
  });

  constructor(private router: Router, private weTrackService: WeTrackService) { }

  ngOnInit(): void {
    if(this.router.url === '/we-track/edit') {  
      this.isEditing = true;
      if(this.weTrackService.selectedTicket === -1) {
        // if the user navigates directly to the edit page, will redirect to the new page
        this.router.navigate(['we-track','new']);
      }
      else { // If the user is on the edit page, and has a ticket selected in the weTrackService..
        const selTicket: WeTrackTicket = this.weTrackService.getTicket(this.weTrackService.selectedTicket); // retrieve the selected ticket from weTrackService

        this.weTrackForm.patchValue(selTicket ? { // update all the values of the FormGroup to the data retrieved from selected ticket
          'title': selTicket.title ? selTicket.title : '',
          'type': selTicket.type ? selTicket.type : '',
          'importance': selTicket.importance ? selTicket.importance : '',
          'submitter': selTicket.submitter ? selTicket.submitter : '',
          'description': selTicket.description ? selTicket.description : '',
          'isAssigned': selTicket.assignee !== '',
          'assignee': selTicket.assignee ? selTicket.assignee : '',
          'status': selTicket.status ? selTicket.status : '',
        } : {} ); // if selTicket isn't truthy, don't patch anything.
      }
    }
  }

  /**
   * @description Called in the DOM when the user is ready to submit the newly created/edited ticket.
   */
  public onFormSubmit() {
    this.isSubmitting = true;

    const title = this.weTrackForm.get('title');
    const type = this.weTrackForm.get('type');
    const description = this.weTrackForm.get('description');
    const importance = this.weTrackForm.get('importance');
    const submitter = this.weTrackForm.get('submitter');

    let tempTicket: WeTrackTicket = new WeTrackTicket(
      title && title.value ? title.value : '',
      type && type.value ? type.value : '',
      description && description.value ? description.value : '',
      importance && importance.value ? importance.value : '',
      submitter && submitter.value ? submitter.value : '',
    );
    
    // If the isAssigned box is checked, insert assignment data into tempTicket 
    if(this.weTrackForm.get('isAssigned')?.value) {
      const assigned = this.weTrackForm.get('assignee');
      const status = this.weTrackForm.get('status');
      
      tempTicket.assignee = assigned && assigned.value ? assigned.value : '';
      tempTicket.status = status && status.value ? status.value : '';
    }
    
    const afterTicketSubmissionCallback: Function = () => { // clear the selected ticket and go back to the ticket page
      this.weTrackService.selectedTicket = -1; 
      this.router.navigate(['we-track']);
    };

    // If user is in editing page, send the ticket to the weTrackService so it can replace the current ticket
    if(this.isEditing) {
      tempTicket.comments = this.weTrackService.getTicket(this.weTrackService.selectedTicket)?.comments // Comments will only exist if this was edited
      this.weTrackService.updateTicket(tempTicket, this.weTrackService.selectedTicket)
        .then( afterTicketSubmissionCallback() ); // Once the ticket is updated in the database
    }
    else { // If we're creating a new ticket, simply send the ticket to be added to the database
      this.weTrackService.addNewTicket(tempTicket)
        .then( afterTicketSubmissionCallback() ); // Once the ticket is added to the database
    }

  }
  
  // Do we want to add a site-wide back arrow with breadcrumbs? -Micah
  public onGoBack() {
    this.router.navigate(['we-track']);
  }

}
