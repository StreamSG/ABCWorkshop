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
  public tickets: WeTrackTicket[] = []; // Defaults to empty, will be populated in ngOnInit
  public orderedTickets: WeTrackTicket[] = this.tickets.slice(); // A copy of the default ticket list (will be initialized as empty)

  public sortOrder = 1; // Should always be either 1 or -1. Changing to 1 or -1 will invert the sorting order of the orderedTickets array, as is used in the Array.sort() method

  public showFilters = true; // Originally used to allow the user to hide the ticket filters. Now useful for re-initializing the filter lists
  public ticketFilters: {[key: string]: string} = { // Each filter type and the default state 
    'submitter': 'All',
    'assignee': 'All',
    'importance': 'All',
    'type': 'All',
    'status': 'All'
  };
  public numberOfActiveFilters = 0; // For displaying how many filters are actively used, default 0 filters

  public selected: string;
  
  public readonly staticSortingDropdownOptions = { // static names for each of the sorting options
    DATE: 'Date',
    EDIT_DATE: 'Edit Date',
    STATUS: 'Completion Status',
    PRIORITY: 'Priority',
    TICKET_TYPE: 'Ticket Type',
    SUBMITTER: 'Submitter',
    ASSIGNEE: 'Assignee',
  }
  
  public sortingDropdownOptions: string[] = Object.values(this.staticSortingDropdownOptions); // An array of all sorting options, as pulled from the static array so that everything always matches.
  public selectedSorting: string = this.staticSortingDropdownOptions.DATE; // Default sorting start, set to date.
  public currentlyLoadingTickets = true; // For hiding the main list in the DOM and instead showing a loading indicator. By default, nothing is loaded, so loading = true

  constructor(private weTrackService: WeTrackService, private router: Router) { }

  ngOnInit(): void {
    setTimeout(() => this.onRefreshTickets(), 100); // Initialize tickets from the database. Had to add delay as sometimes calling the loadTickets method was returning an old version of the ticket array from the database. I think this happened when I would write to the database and then immediately request an updated list.
  }

  // -----    Ticket Sorting    -----

  /**
   * @description Allows for sorting the list of tickets once the user selects an option from the universal dropdown component
   * @param {string} optionClicked The ticket variable type to sort by
   */
  public onSortTicketsByOption(optionClicked: string): void {
    this.selectedSorting = optionClicked;
    this.sortTickets();
  }

  /**
   * @description Changes the ticketFilters object to the selected filterValue, and then calls sortTickets to cull and sort the ticket array. Calls sort instead of just filter so that if the change in the filter adds new tickets to the array, then they will be placed properly.
   * @param {string} filterType The filter grouping to set, as it appears in the default ticketFilters object key
   * @param {string} filterValue The value to filter by
   */
  public updateFilter(filterType: string, filterValue: string): void {
    this.ticketFilters[filterType] = filterValue;
    this.sortTickets();
  }

  /**
   * @description Clones the master list of tickets, removes tickets based on filter settings, and then sorts the remaining array based on selectedSorting global variable
   */
  public sortTickets(): void {
    this.orderedTickets = this.tickets.slice(); // Create a copy so we don't mess up the master list

    this.applyTicketFilters(); // Do this right away to cull filtered out tickets so we don't sort tickets that aren't even being displayed

    this.numberOfActiveFilters = 0; // Count how many filters aren't set to 'All' for the Clear Filter button in the DOM
    for(let filter of Object.values(this.ticketFilters)) {
      if(filter !== 'All') {
        this.numberOfActiveFilters++;
      }
    }
    
    // Depending on the sorting type, call the Array.sort prototype method with the specified sorting procedure
    switch(this.selectedSorting) {
      case this.staticSortingDropdownOptions.DATE: // Sort by date
        this.orderedTickets.sort( (a, b) => (new Date(a.creationDate).getTime() > new Date(b.creationDate).getTime()) ? this.sortOrder : -this.sortOrder);
        break;
      case this.staticSortingDropdownOptions.TICKET_TYPE: // Sort types alphabetically
        this.orderedTickets.sort( (a, b) => (a.type > b.type) ? this.sortOrder : -this.sortOrder);
        break;
      case this.staticSortingDropdownOptions.SUBMITTER: // Sort submitters alphabetically
        this.orderedTickets.sort( (a, b) => (a.submitter > b.submitter) ? this.sortOrder : -this.sortOrder);
        break;
      case this.staticSortingDropdownOptions.PRIORITY: // Call a service method which will return a number corresponding to the 'weight' of the ticket importance. Low importance returns a low number and high importance returns a high number.
        this.orderedTickets.sort( (a,b) => ( this.weTrackService.getSortableValueFromTicket(a, 'importance') > this.weTrackService.getSortableValueFromTicket(b, 'importance')) ? this.sortOrder : -this.sortOrder)
        break;
      case this.staticSortingDropdownOptions.ASSIGNEE: // Sort by assignee alphabetically
        this.orderedTickets.sort((a,b) => (a.assignee > b.assignee) ? this.sortOrder : -this.sortOrder);
        break;
      case this.staticSortingDropdownOptions.EDIT_DATE: // Sort by date
        this.orderedTickets.sort((a,b) => (new Date(a.editDate).getTime() > new Date(b.editDate).getTime()) ? this.sortOrder : -this.sortOrder);
        break;
      case this.staticSortingDropdownOptions.STATUS: // Sort status in an order deemed meaningful by the service method
        this.orderedTickets.sort((a,b) => ( this.weTrackService.getSortableValueFromTicket(a, 'status') > this.weTrackService.getSortableValueFromTicket(b, 'status')  ) ? this.sortOrder : -this.sortOrder);
    }
  }

  // -----    Ticket Filtering    -----

  /**
   * @description Loop through each filter type, and remove any tickets from the orderedTickets array that don't fit the filter parameters
   */
  private applyTicketFilters(): void {
    const filterTypes = Object.keys(this.ticketFilters); // retrieve an array of filter types from the ticketFilters object

    for(let filter of filterTypes) { // Loop through each filter type
      const curFilter = this.ticketFilters[filter]; // Store the current filter name.
      if(curFilter === 'All') { continue; } // Don't bother filtering out any elements if the filter is set to show All
      let indexesToRemove = []; // Used to store the indexes that we'll want to remove later
      for(let i = 0; i < this.orderedTickets.length; i++) { // Go through every ticket
        const curTicket: {[key: string]: any} = this.orderedTickets[i];
        if( curTicket[filter].toLowerCase() === curFilter.toLowerCase() || // If the ticket filtered variable matches the filter, skip this loop so it isn't removed from the list
          (filter === 'assignee' && curFilter === 'Unassigned' && (typeof curTicket[filter] === 'undefined' || curTicket[filter].length === 0)) ) { continue; } // Covers for searching for 'Unassigned' tickets, as 
        indexesToRemove.push(i); // otherwise, add the ticket index to the list of indexes to remove
      }
      indexesToRemove.reverse(); // Invert the order of the indexes. If you start from the beginning, as you cut out elements in the next loop, it will offset the indexes of future elements to be removed. This way, start from the end of the array and work backwards so removed elements won't change the index of the earlier elements to be removed.
      for(let index of indexesToRemove) { // loop through each index to remove and splice them out
        this.orderedTickets.splice(index, 1);
      }
    }
  }

  /**
   * @description Used in the DOM to set all filters to 'All' and re-initialize the universal filter components so they reset to default ('All')
   */
  public onClearFilters(): void {
    for(let key of Object.keys(this.ticketFilters)) {
      this.ticketFilters[key] = 'All';
    }
    this.showFilters = false;
    setTimeout(() => {this.showFilters = true;} , 1);
    this.sortTickets();
  }

  // -----    Ticket/List Management    -----
  
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
   * @param {number} ticket The ticket you'd like to delete
   * @returns {void}
   */
  public deleteTicket(ticket: WeTrackTicket): void {
    this.weTrackService.deleteTicket(ticket)
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

  // I spent some time making this sorting method, but then realized there's literally a prototype method in arrays to sort them. Leaving it here as a memory until I get over it and delete it.
  // private sortTicketsAscending(ticketKey: string) {
  //   // I think this is a bubble sort

  //   this.orderedTickets = [...this.tickets];

  //   let madeOrderSwap = true;

  //   while(madeOrderSwap) {
  //     madeOrderSwap = false;

  //     for(let i = 0; i < this.orderedTickets.length-1; i++) {
  //       let curTicketValue = this.weTrackService.getSortableValueFromTicket(this.orderedTickets[i], ticketKey);
  //       let nextTicketValue = this.weTrackService.getSortableValueFromTicket(this.orderedTickets[i+1], ticketKey);
        
  //       if(curTicketValue > nextTicketValue) {
  //         let tempTicket = {...this.orderedTickets[i]};
  //         this.orderedTickets[i] = {...this.orderedTickets[i+1]};
  //         this.orderedTickets[i+1] = tempTicket;
  //         madeOrderSwap = true;
  //       }
  //     }
  //   }
  // }
}
