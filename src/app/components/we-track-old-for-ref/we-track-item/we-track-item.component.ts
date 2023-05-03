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

  public readonly staticTicketDropdownOptions: {EDIT: string, DELETE: string, PRINT_DATA: string} = {
    EDIT: 'Edit',
    DELETE: 'Delete (only if you mean it!)',
    PRINT_DATA: 'Print Data',
  }
  public ticketDropdownOptions: string[] = Object.values(this.staticTicketDropdownOptions);
  
  constructor(private weTrackService: WeTrackService, private router: Router) { }
  
  ngOnInit(): void {
    this.statusColor = this.getStatusColor(this.weTrackTicket.status); // Calculate status color for "dot-" class. See global style sheet for dot info
    let tempPrettyDate = new Date(this.weTrackTicket.creationDate).toISOString().slice(0,10); // Convert Date string to MM-DD-YYY
    this.prettyCreationDate = tempPrettyDate.slice(5,10) + '-' + tempPrettyDate.slice(0,4);
    this.prettyCreationDate = `${tempPrettyDate.slice(5,10)}-${tempPrettyDate.slice(0,4)}`;
  }
  
  /**
   * @description When the user selects an option from the general dropdown for teh ticket, will search through possible matching options and execute code based on what was clicked.
   * @param {string} optionClicked The option clicked, from the array 
   */
  public onTicketDropdownOptionsClicked(optionClicked: string): void {
    switch(optionClicked) {
      case this.staticTicketDropdownOptions.EDIT:
        this.weTrackService.selectedTicket = this.weTrackService.getIndexOfTicket(this.weTrackTicket);
        this.router.navigate(['we-track','edit']);
        break;
      case this.staticTicketDropdownOptions.DELETE:
        this.deleteThisTicket.next(); // Sometimes disabled if I'm worried about people deleting stuff.
        break;
      case this.staticTicketDropdownOptions.PRINT_DATA:
        console.log(this.weTrackTicket);
        break;
      default:
        console.error('Error parsing response from dropdown selection: ' + optionClicked);
        break;
    }
  }

  /**
   * @description For use when the user clicks on the ticket header. Opens up the ticket view to show full ticket details. However, will not open if the user clicks a button within the ticket.
   * @param event The $event of the click. Used to identify if the user clicks on a button within the ticket, in which case it should not be opened.
   */
  public onActivateTicketItem(event: any): void {
    if(event && event.target && event.target.classList) { // Verify everything exists to get around :any. Struggling with types to get Typescript to cooperate and allow me to access this data.
      let foundBtnClass = false;
      const classList = event.target.classList;
      for(let className of classList) {
        if(className.toLowerCase().indexOf('btn') !== -1 || className.toLowerCase().indexOf('dropdown') !== -1) {
          foundBtnClass = true;
          break;
        }
      }
      if(!foundBtnClass) {
        this.isActive = !this.isActive;
      }
    }
    else {
      console.error('Unable to access necessary values of event in order to determine if it is of the type ot be ignored.');
      console.error(event);
    }
  }

  /**
   * @description Returns the class color for the status of a ticket, based on the status within the ticket. I tried moving this into 
   */
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

  /**
   * @description When the user clicks comment, will prepare the comment, add it to the current ticket, and attempt to send it to the database.
   */
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

  /**
   * @description Will remove the comment from the ticket, and attempt to send the updated data to the database.
   * @param {number} index The index of the comment, as given by the ngFor loop
   */
  public deleteComment(index: number): void {
    let updatedTicketPayload = {...this.weTrackTicket};
    updatedTicketPayload.comments.splice(index, 1);

    this.weTrackService.updateTicket(updatedTicketPayload, this.weTrackTicketIndex)
      .then(() => {
        this.weTrackTicket = updatedTicketPayload;
      });
  }

  public stopPropagation(event: Event): void {
    event.stopPropagation();
  }
}
