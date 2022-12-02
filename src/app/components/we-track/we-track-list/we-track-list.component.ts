import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { WeTrackTicket } from 'src/app/models/we-track-ticket.model';
import { WeTrackService } from 'src/app/services/we-track.service';

@Component({
  selector: 'app-we-track-list',
  templateUrl: './we-track-list.component.html',
  styleUrls: ['./we-track-list.component.scss']
})
export class WeTrackListComponent implements OnInit {
  public tickets: WeTrackTicket[] = [];
  public orderedTickets: WeTrackTicket[] = [];

  public sortOrder = 1;
  
  public readonly staticSortingDropdownOptions = {
    DATE: 'Date',
    TICKET_TYPE: 'Ticket Type',
    SUBMITTER: 'Submitter',
    ASSIGNEE: 'Assignee',
    PRIORITY: 'Priority',
    EDIT_DATE: 'Edit Date',
    STATUS: 'Completion Status',
  }
  
  public sortingDropdownOptions: string[] = Object.values(this.staticSortingDropdownOptions);
  public selectedSorting: string = this.staticSortingDropdownOptions.DATE;
  public currentlyLoadingTickets = true;

  constructor(private weTrackService: WeTrackService, private router: Router) { }

  ngOnInit(): void {
    setTimeout(() => this.onRefreshTickets(), 100); // Initialize tickets from the database. Had to add delay as sometimes calling the loadTickets method was returning an old version of the ticket array from the database. I think this happened when I would write to the database and then immediately request an updated list.
  }

  public sortTicketsByOption(optionClicked: string) {
    this.selectedSorting = optionClicked;
    this.sortTickets();
  }

  public sortTickets() {
    this.orderedTickets = [...this.tickets];
    
    switch(this.selectedSorting) {
      case this.staticSortingDropdownOptions.DATE:
        this.orderedTickets.sort( (a, b) => (new Date(a.creationDate).getTime() > new Date(b.creationDate).getTime()) ? this.sortOrder : -this.sortOrder);
        break;
      case this.staticSortingDropdownOptions.TICKET_TYPE:
        this.orderedTickets.sort( (a, b) => (a.type > b.type) ? this.sortOrder : -this.sortOrder);
        // this.sortTicketsAscending('type');
        break;
      case this.staticSortingDropdownOptions.SUBMITTER:
        // this.sortTicketsAscending('');
        this.orderedTickets.sort( (a, b) => (a.submitter > b.submitter) ? this.sortOrder : -this.sortOrder);
        break;
      case this.staticSortingDropdownOptions.PRIORITY:
        this.orderedTickets.sort( (a,b) => ( this.weTrackService.getSortableValueFromTicket(a, 'importance') > this.weTrackService.getSortableValueFromTicket(b, 'importance')) ? this.sortOrder : -this.sortOrder)
        break;
      case this.staticSortingDropdownOptions.ASSIGNEE:
        this.orderedTickets.sort((a,b) => (a.assignee > b.assignee) ? this.sortOrder : -this.sortOrder);
        break;
      case this.staticSortingDropdownOptions.EDIT_DATE:
        this.orderedTickets.sort((a,b) => (new Date(a.editDate).getTime() > new Date(b.editDate).getTime()) ? this.sortOrder : -this.sortOrder);
        break;
      case this.staticSortingDropdownOptions.STATUS:
        this.orderedTickets.sort((a,b) => ( this.weTrackService.getSortableValueFromTicket(a, 'status') > this.weTrackService.getSortableValueFromTicket(b, 'status')  ) ? this.sortOrder : -this.sortOrder);
    }
  }

  private sortTicketsAscending(ticketKey: string) {
    // I think this is a bubble sort

    this.orderedTickets = [...this.tickets];

    let madeOrderSwap = true;

    while(madeOrderSwap) {
      madeOrderSwap = false;

      for(let i = 0; i < this.orderedTickets.length-1; i++) {
        let curTicketValue = this.weTrackService.getSortableValueFromTicket(this.orderedTickets[i], ticketKey);
        let nextTicketValue = this.weTrackService.getSortableValueFromTicket(this.orderedTickets[i+1], ticketKey);
        
        if(curTicketValue > nextTicketValue) {
          let tempTicket = {...this.orderedTickets[i]};
          this.orderedTickets[i] = {...this.orderedTickets[i+1]};
          this.orderedTickets[i+1] = tempTicket;
          madeOrderSwap = true;
        }
      }
    }
  }

  private invertTicketOrder() {
    let outputTickets = [];
    for(let i = 0; i < this.orderedTickets.length; i++) {
      outputTickets[i] = this.orderedTickets[ this.orderedTickets.length - 1 - i];
    }
    this.orderedTickets = outputTickets;
  }
  
  public callbackSortTickets: Function = (sortType: string): void => {
    console.log(sortType);
  }
  
  /**
   * @description Create a request to the database for an updated list of tickets. When the promise resolves, sets this.tickets to the ticket response data
   * @returns {void}
   */
  public onRefreshTickets(): void {
    this.currentlyLoadingTickets = true;
    this.weTrackService.loadTickets()
      .then((tickets) => {
        this.tickets = tickets;
        this.currentlyLoadingTickets = false;
        this.sortTickets();
      })
      .catch((err) => {console.error(err); this.currentlyLoadingTickets = false; });
  }

  /**
   * @description Temporary method, allows for randomly generating a ticket for testing purposes.
   */
  public onGenTicket(): void {
    // temporary way to add new tickets
    let tempTicket = new WeTrackTicket(
      ['Add a nice feature', 'Make this thing work', 'Do something cool', 'Work together :)', 'Reach for the stars', 'Achieve your dreams'][Math.floor(Math.random()*6)] + ' (generated)',
      ['issue','feature'][Math.round(Math.random())],
      'Blah blah blah this is a description',
      ['low','medium','high','urgent'][Math.floor(Math.random()*4)],
      ['Micah', 'Aaron', 'Kerry', 'Raul', 'Someone else', 'Another person'][Math.floor(Math.random()*6)],
    );
    tempTicket.status = ['pending', 'in-progress', 'complete', 'cancelled', 'assigned'][Math.floor(Math.random()*5)];
    this.weTrackService.addNewTicket(tempTicket)
      .then((tickets) => { 
        this.tickets = tickets; 
        this.sortTickets();
      })
      .catch((err) => { console.error(err); });
  }

  /**
   * @description Deletes a specific ticket at the given index from the database. After promise resolves will update the local list from the returned array
   * @param {number} index The index of the ticket you'd like to delete
   * @returns {void}
   */
  public deleteTicket(index: number): void {
    this.weTrackService.deleteTicket(index)
      .then((tickets) => { 
        this.tickets = tickets;
        this.sortTickets();
      });
  }

  /**
   * @description Routes to the new ticket page
   * @returns {void}
   */
  public onNewTicket(): void {
    this.router.navigate(['we-track','new']);
  }
}
