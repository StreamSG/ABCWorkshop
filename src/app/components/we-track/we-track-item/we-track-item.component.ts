import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';

import { WeTrackTicket } from 'src/app/models/we-track-ticket.model';
import { WeTrackService } from 'src/app/services/we-track.service';

@Component({
  selector: 'app-we-track-item',
  templateUrl: './we-track-item.component.html',
  styleUrls: ['./we-track-item.component.scss']
})
export class WeTrackItemComponent implements OnInit {
  // Both variables received from we-track-list for ticket data as well as index selection when the user wants to edit
  @Input() weTrackTicketIndex: number;
  @Input() weTrackTicket: WeTrackTicket;
  // Emission to we-track-list when the user wants to delete this ticket from the database.
  @Output() deleteThisTicket: EventEmitter<void> = new EventEmitter<void>(); // An alternative to this would be to have the ticket delete itself from the database. However, this would require all of the places that use the master ticket array to subscribe to the service in order to be notified when the master list changes. -Micah

  public isActive: boolean = false; // When the ticket is open in the list, showing the full description and all data
  public statusColor: string = ''; // For use with the stylized dot class next to the ticket status. See global style sheet for class info
  public prettyCreationDate: string = ''; // Shows creation date in MM-DD-YYYY format

  public commentName: string = ''; // Form data from commenter name (may be replaced if we move to login-based interaction)
  public commentText: string = ''; // Form data for comment text

  public ellipsesStyleWrap: object = { // for ngStyle use on the description, to hide overflow when the ticket is collapsed. 
    'text-overflow': 'ellipsis', // Where should this go? Entirely in the HTML? Maybe create a class? -Micah
    'overflow' : 'hidden',
    'white-space': 'nowrap',
  };
  
  // Functions passed as callback functions
  
  constructor(private weTrackService: WeTrackService, private router: Router) { }
  
  ngOnInit(): void {
    this.statusColor = this.getStatusColor(this.weTrackTicket.status); // Calculate status color for "dot-" class. See global style sheet for dot info
    let tempPrettyDate = new Date(this.weTrackTicket.creationDate).toISOString().slice(0,10); // Convert Date string to MM-DD-YYY
    this.prettyCreationDate = tempPrettyDate.slice(5,10) + '-' + tempPrettyDate.slice(0,4);
  }

  /**
   * @description Is passed to uni dropdown component, so must be created as an anonymous function.
   */
  public callbackOnEditTicket: Function = (): void => {
    this.weTrackService.selectedTicket = this.weTrackTicketIndex;
    this.router.navigate(['we-track','edit']);
  };

  /**
   * @description Is passed to uni dropdown component, so must be created as an anonymous function.
   */
  public onDeleteTicket: Function = (): void => {
    this.deleteThisTicket.next();
  }

  public onActivateTicketItem(): void {
    this.isActive = !this.isActive;
  }

  private getStatusColor(status: string): string {
    switch(status) {
      case WeTrackTicket.STATUS.PENDING:
        return 'orange';
      case WeTrackTicket.STATUS.IN_PROGRESS:
        return 'yellow';
      case WeTrackTicket.STATUS.COMPLETE:
        return 'green';
      case WeTrackTicket.STATUS.ASSIGNED:
        return 'blue';
      case WeTrackTicket.STATUS.CANCELLED:
        return 'red';
      default:
        return 'yellow';
    }
  }

  public onSubmitComment(): void {
    
    if(this.commentName.trim() === '' || this.commentText.trim() === '') { return; }
    let updatedTicketPayload = {...this.weTrackTicket};
    if(!Array.isArray(updatedTicketPayload.comments) || updatedTicketPayload.comments.length === 0) {
      updatedTicketPayload.comments = [{name: this.commentName, comment: this.commentText, date: new Date()}];
    }
    else {
      updatedTicketPayload.comments.push({name: this.commentName, comment: this.commentText, date: new Date()});
    }
    this.commentText = '';

    this.weTrackService.updateTicket(updatedTicketPayload, this.weTrackTicketIndex)
      .then(() => {
        this.weTrackTicket = updatedTicketPayload;
      });
  }

  public deleteComment(index: number): void {
    let updatedTicketPayload = {...this.weTrackTicket};
    updatedTicketPayload.comments.splice(index, 1);

    this.weTrackService.updateTicket(updatedTicketPayload, this.weTrackTicketIndex)
      .then(() => {
        this.weTrackTicket = updatedTicketPayload;
      });
  }

  public stopPropogation(event: Event): void {
    event.stopPropagation();
  }
}
