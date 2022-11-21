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

  public isSubmitting = false;
  public isEditing = false;

  public weTrackForm = new FormGroup({
    'title': new FormControl('', Validators.required),
    'type': new FormControl('feature', Validators.required),
    'importance': new FormControl('low', Validators.required),
    'submitter': new FormControl('', Validators.required),
    'description': new FormControl('', Validators.required),

    'isAssigned': new FormControl(false), // checkbox to show nested forms
      'assigned': new FormControl(),
      'status': new FormControl('pending'),
  });

  /*

  public title: string,
  public type: string,
  public description: string,
  public importance: string,
  public submitter: string,

  */

  constructor(private router: Router, private weTrackService: WeTrackService) { }

  ngOnInit(): void {
    if(this.router.url === '/we-track/edit') { 
      this.isEditing = true;
      if(this.weTrackService.selectedTicket === -1) {// No active ticket in edit mode! 
        this.router.navigate(['we-track']);
      }
      else { // 
        const selTicket = this.weTrackService.getTicket(this.weTrackService.selectedTicket);
        
        this.weTrackForm.patchValue({
          'title': selTicket.title,
          'type': selTicket.type,
          'importance': selTicket.importance,
          'submitter': selTicket.submitter,
          'description': selTicket.description,
          'isAssigned': selTicket.assignee !== '',
          'assigned': selTicket.assignee,
          'status': selTicket.status,
        });
      }
    }
  }

  public onFormSubmit() {
    // this.isSubmitting = true;

    const title = this.weTrackForm.get('title');
    const type = this.weTrackForm.get('type');
    const importance = this.weTrackForm.get('importance');
    const submitter = this.weTrackForm.get('submitter');
    const description = this.weTrackForm.get('description');

    let tempTicket = new WeTrackTicket(
      title && title.value ? title.value : '',
      type && type.value ? type.value : '',
      description && description.value ? description.value : '',
      importance && importance.value ? importance.value : '',
      submitter && submitter.value ? submitter.value : '',
    );

    if(this.weTrackForm.get('isAssigned')?.value) {
      const assigned = this.weTrackForm.get('assigned');
      const status = this.weTrackForm.get('status');

      tempTicket.assignee = assigned && assigned.value ? assigned.value : '';
      tempTicket.status = status && status.value ? status.value : '';
    }

    if(this.isEditing) {
      this.weTrackService.updateTicket(tempTicket, this.weTrackService.selectedTicket)
        .then(() => {
          this.weTrackService.selectedTicket = -1;
          this.router.navigate(['we-track']);
        });
    }
    else {
      this.weTrackService.addNewTicket(tempTicket)
        .then(() => { // don't care about response
          this.weTrackService.selectedTicket = -1;
          this.router.navigate(['we-track']);
        });
    }

  }
  
  public onGoBack() {
    this.router.navigate(['we-track']);
  }

}
