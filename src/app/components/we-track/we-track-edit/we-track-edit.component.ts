import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
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
    'isAssignedGroup': new FormGroup(
      {
        'isAssigned': new FormControl(false), // checkbox to show nested forms
        'assignee': new FormControl(''),
        'status': new FormControl('pending'),
      }, 
      [
        this.optionalCheckboxGroup('isAssigned', ['assignee', 'status']), 
      ]
    ),
    'customCreationGroup': new FormGroup(
      {
        'isCustomCreation': new FormControl(false),
        'customCreationDate': new FormControl('')
      },
      [
        this.optionalCheckboxGroup('isCustomCreation', ['customCreationDate']),
      ]
    ),
    'customEditGroup': new FormGroup(
      {
        'isCustomEdit': new FormControl(false),
        'customEditDate': new FormControl('')
      },
      [
        this.optionalCheckboxGroup('isCustomEdit', ['customEditDate']),
      ]
    ),
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
          'isAssignedGroup': {
            'isAssigned': selTicket.assignee !== '',
            'assignee': selTicket.assignee ? selTicket.assignee : '',
            'status': selTicket.status ? selTicket.status : '',
          },
          'customCreationGroup': {
            'isCustomCreation': true, // will always be true since we are editing a pre-existing ticket
            'customCreationDate': selTicket.creationDate ? new Date(selTicket.creationDate).toISOString().substring(0,10) : '', // Ideally shouldn't be non truthy since we're editing a pre-existing ticket, but just in case 
          },
          'customEditGroup': {
            'isCustomEdit': selTicket.editDate && (selTicket.creationDate && selTicket.creationDate !== selTicket.editDate) ? true : false,
            'customEditDate': selTicket.editDate ? new Date(selTicket.editDate).toISOString().substring(0,10) : '',
          }
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
    if(this.weTrackForm.get('isAssignedGroup.isAssigned')?.value) {
      const assigned = this.weTrackForm.get('isAssignedGroup.assignee');
      const status = this.weTrackForm.get('isAssignedGroup.status');
      
      tempTicket.assignee = assigned && assigned.value ? assigned.value : '';
      tempTicket.status = status && status.value ? status.value : '';
    }

    // If the the custom creation date is checked, insert the date from the form. If not, the tempTicket.creationDate is already defaulted to today
    if(this.weTrackForm.get('customCreationGroup.isCustomCreation')?.value) {
      const customCreationDate = this.weTrackForm.get('customCreationGroup.customCreationDate')?.value;

      tempTicket.creationDate = new Date('' + customCreationDate);
    }

    // If the the custom edit date is checked, insert the date from the form. If not, the tempTicket.editDate is already defaulted to today
    if(this.weTrackForm.get('customEditGroup.isCustomEdit')?.value) { 
      const customEditDate = this.weTrackForm.get('customEditGroup.customEditDate')?.value;

      tempTicket.editDate = new Date('' + customEditDate);
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

  // Custom form validators:
  private optionalCheckboxGroup(checkboxName: string, subFieldNames: string[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      
      const formGroup = (control as FormGroup);
      if(!formGroup.controls[checkboxName]?.value) { return null; }
      let allFormsValid = true;
      for(let subName of subFieldNames) {
        if(formGroup.controls[subName] && !formGroup.controls[subName].value) {
          allFormsValid = false;
          break;
        }
      }
      return !allFormsValid ? { missingData: true } : null;
    };
  }

}
