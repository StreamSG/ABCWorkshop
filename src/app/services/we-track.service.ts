import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { WeTrackTicket } from '../models/we-track-ticket.model';

@Injectable({
  providedIn: 'root'
})
export class WeTrackService {

  /*
    Todo:
      Add lock on ability to add or delete ticket when there's an open promise with server?
  */

  readonly databaseUrl = 'https://atlas-boot-camp-default-rtdb.firebaseio.com/we-track.json';

  private tickets: WeTrackTicket[] = []; // master list of all tickets
  private loadingTickets = false; 
  private loadTicketPromise: Promise<WeTrackTicket[]>;
  public selectedTicket: number = -1;

  constructor(private http: HttpClient) { }

  /**
   * @returns {WeTrackTicket[]} Returns a copy of the locally restored array of tickets
   */
  public getTickets(): WeTrackTicket[] {
    return this.tickets.slice();
  }

  /**
   * @description Getter for the loadingTickets variable
   * @returns {boolean} loadingTickets value
   */
  public isLoadingTickets(): boolean {
    return this.loadingTickets;
  }

  /**
   * @description Returns the ticket at the given index
   * @param {number} index of the ticket you'd like to access
   * @returns {WeTrackTicket} The ticket at give selected index
   */
  public getTicket(index: number): WeTrackTicket {
    return this.tickets[index];
  }

  /**
   * @description If a pending promise exists waiting on a response from the database, simply returns that promise. If there is no pending promise, creates a new request from the database and returns that promise.
   * @returns {Promise<WeTrackTicket[]} Returns a promise which will resolve to an updated array of tickets from the database.
   */
  public loadTickets(): Promise<WeTrackTicket[]> {
    if(this.loadingTickets) { // If there is already a pending response from database, return that promise
      return this.loadTicketPromise;
    }
    // If there is on pending response from database, create new promise:
    this.loadingTickets = true; // Log that a promise is being created
    this.loadTicketPromise = new Promise( (resolve, reject) => { // store the promise to be returned
      this.http.get<WeTrackTicket[]>(this.databaseUrl).subscribe({ // subscribe to the response from the server
        next: (response) => {
          // on a positive response, store the ticket data and resolve the promise
          this.tickets = response ? response : [];
          resolve(this.getTickets());
        },
        error: (err) => {
          // on an error, reject the promise
          console.error('Error attempting to load tickets from: ' + this.databaseUrl);
          reject(err);
        },
        complete: () => {
          // whether next or error, mark that the promise has concluded
          this.loadingTickets = false; 
        },
      });
    });
    return this.loadTicketPromise; // return the newly created promise awaiting a response from the server
  }



  

  /**
   * @description Attempts to add the given new ticket to the database. Will only add ticket to the session local database on a successful response from the database server
   * @param ticket {WeTrackTicket} Takes a variable of type WeTrackTicket to be added to the database
   * @returns {Promise<WeTrackTicket[]>} Will return the updated ticket list after it has been successfully added to the server
   */
  public addNewTicket(ticket: WeTrackTicket): Promise<WeTrackTicket[]> {
    let updatedTicketPayload = [...this.tickets, ticket]; // create temporary array of tickets
    return this.putTickets(updatedTicketPayload);
  }

  public updateTicket(ticket: WeTrackTicket, selectedTicket: number): Promise<WeTrackTicket[]> {
    let updatedTicketPayload = this.tickets.slice();
    updatedTicketPayload[selectedTicket] = ticket;
    return this.putTickets(updatedTicketPayload);
  }

  private putTickets(ticketPayload: WeTrackTicket[]): Promise<WeTrackTicket[]> {
    return new Promise( (resolve, reject) => {
      this.http.put<{name: string}>(this.databaseUrl, JSON.stringify(ticketPayload)).subscribe({
        next: () => {
          this.tickets = ticketPayload; // only add ticket locally if it was successfully added to DB
          resolve(this.getTickets());
        },
        error: (err) => {
          console.error('Error attempting to add new ticket to: ' + this.databaseUrl);
          reject(err);
        },
      });
    });
  }

  /**
   * @description Will ensure a ticket matching the passed ticket is found in the master list, and remove that ticket from the database
   * @param {WeTrackTicket} ticketToDelete The ticket to delete from the database
   * @returns {Promise<WeTrackTicket[]>} Will return a copy of the updated ticket list
   */
  public deleteTicket(ticketToDelete: WeTrackTicket): Promise<WeTrackTicket[]> {
    let updatedTicketPayload = this.tickets.slice(); // Need an exact copy of the master list
    let indexOfTicket = -1; // Initialize to an impossible index to verify a match was found
    
    for(let i = 0; i < updatedTicketPayload.length; i++) { // loop through all tickets
      const curTicket = updatedTicketPayload[i];
      if(curTicket == ticketToDelete) { // If the ticket to delete matches the currently checked ticket
        updatedTicketPayload.slice(i,1); // Remove the ticket from the payload to send to the database
        indexOfTicket = i; // log that a matching ticket was found, to later delete from master array
        break; // Stop looking for ticket matches since one was found
      }
    }

    if(indexOfTicket === -1) { // If no ticket match was found, throw an error 
      console.error('No matching ticket found to delete from list');
      return new Promise( (resolve, reject) => { reject('No matching ticket found in master list'); });
    }
    
    // If a match was found..
    return new Promise( (resolve, reject) => {
      this.http.put(this.databaseUrl, JSON.stringify(updatedTicketPayload)).subscribe({ // Update the database with the missing ticket
        next: () => {
          this.tickets.splice(indexOfTicket,1); // On a successful response, delete the local ticket and resolve with a copy of the current list
          resolve(this.getTickets());
        }
      });
    });
  }

  /**
   * @descriptions Given a ticket or ticket index, will return a numerical value representing where the ticket value should fall in a sorted array. Intended to be used to sort special strings when an order other than alphabetical would make more sense, such as urgency or ticket type.
   * @param {number | WeTrackTicket} ticket Takes the index of the ticket or the ticket object
   * @param {string} ticketVariable The ticket variable from which a sortable value is needed
   * @returns {number} The sortable "weight" of the given ticket value, to be ranked with other possible ticket values
   */
  public getSortableValueFromTicket(ticket: number | WeTrackTicket, ticketVariable: string): number {
    if(!ticket) {
      console.error('Error parsing ticket'); // In case the user passes an empty ticket
    }
    let ticketToUse: WeTrackTicket = typeof ticket === 'number' ? this.tickets[ticket] : ticket; // Convert a variable which may be one of two types, into a definite WeTrackTicket type

    switch(ticketVariable) { // Depending on the weTrackTicket variable type, extract various values or return numerical "weights" depending on the value of the given variable
      case 'creationDate':
        return new Date(ticketToUse.creationDate).getTime();
      case 'editDate':
        return new Date(ticketToUse.editDate).getTime();
      case 'type':
        switch(ticketToUse.type) { // Sort the ticket types in the order Idea > Issue > Feature
          case WeTrackTicket.STATIC_DATA.TYPE.FEATURE: 
            return 1;
          case WeTrackTicket.STATIC_DATA.TYPE.ISSUE: 
            return 2;
          case WeTrackTicket.STATIC_DATA.TYPE.IDEA: 
            return 3;
        }
        console.error('Unrecognized ticket type: ', ticketToUse, ticketToUse.type);
        return 0;
      case 'importance': 
        switch(ticketToUse.importance) { // Sort the ticket priorities in the order Urgent > High > Medium > Low
          case WeTrackTicket.STATIC_DATA.PRIORITY.LOW:
            return 1;
          case WeTrackTicket.STATIC_DATA.PRIORITY.MEDIUM:
            return 2;
          case WeTrackTicket.STATIC_DATA.PRIORITY.HIGH:
            return 3;
          case WeTrackTicket.STATIC_DATA.PRIORITY.URGENT:
            return 4; 
        }
        console.error('Unrecognized ticket priority: ', ticketToUse, ticketToUse.importance);
        return 0;
      case 'status':
        switch(ticketToUse.status) { // Sort the ticket status in the order Cancelled > Complete > In-Progress > Assigned > Pending
          case WeTrackTicket.STATIC_DATA.STATUS.PENDING:
            return 1;
          case WeTrackTicket.STATIC_DATA.STATUS.ASSIGNED:
            return 2;
          case WeTrackTicket.STATIC_DATA.STATUS.IN_PROGRESS:
            return 3;
          case WeTrackTicket.STATIC_DATA.STATUS.COMPLETE:
            return 4;
          case WeTrackTicket.STATIC_DATA.STATUS.CANCELLED:
            return 5;
        }
        console.error('Unrecognized ticket status: ', ticketToUse, ticketToUse.status);
        return 0;
      default:
        console.error('Unrecognized ticket variable: ', ticketVariable);
        return 0;
    }
  }

  /**
   * @description Loops through the master array of tickets and finds the matching ticket index
   * @param {WeTrackTicket} ticket The ticket of which we'd like to find the index.
   * @returns {number} The index of the given ticket
   */
  public getIndexOfTicket(ticket: WeTrackTicket): number {
    for(let i = 0; i < this.tickets.length; i++) {
      if(this.tickets[i] == ticket) {
        return i;
      }
    }
    console.error('No matching ticket found:');
    console.error(ticket);
    return -1;
  }

  // private databaseUrl: string = 'https://atlas-boot-camp-default-rtdb.firebaseio.com/we-track.json';
  // private loading: boolean = false;
  // private loadingChanged: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  // private httpSubscription: Subscription;
  // private isSuccessfullyCompleted: boolean = false;
  // private apiResults: WeTrackTicket[] = [];

  // constructor(private httpClient: HttpClient) {}

  // /**
  //  * @description - Method to update loading and loadingChanged statuses
  //  * @returns {void} - updates global variables
  //  */
  // public resetData(): void {
  //   this.updateLoading(false);
  //   this.isSuccessfullyCompleted = false;
  //   this.apiResults = [];
  //   this.cancelRequest();
  // }

  // /**
  //  * @description - Method to cancel subscription
  //  * @returns {void} - updates global variables
  //  */
  // private cancelRequest(): void {
  //   if (this.httpSubscription) {
  //     if (!this.httpSubscription.closed) {
  //       this.httpSubscription.unsubscribe();
  //     }
  //   }
  // }

  // /**
  //  * @description - Method to update loading and loadingChanged statuses
  //  * @param {boolean} loading - current value of loading for serivce
  //  * @returns {void}
  //  */
  // private updateLoading(loading: boolean): void {
  //   this.loading = loading;
  //   this.loadingChanged.next(this.loading);
  // }

  // /**
  //  * @description - Method to update loading and loadingChanged statuses
  //  * @returns {Observable<boolean>} update loading status
  //  */
  // public getLoading(): Observable<boolean> {
  //   return this.loadingChanged.asObservable();
  // }

  // /**
  //  * @description - Method to update loading and loadingChanged statuses
  //  * @returns {boolean}  update status
  //  */
  // public hasSuccessfullyCompleted(): boolean {
  //   return this.isSuccessfullyCompleted;
  // }

  // /**
  //  * @description - returns results for weTrack service
  //  * @returns {WeTrackTicket[]} returns ticket array
  //  */
  // public getResults(): WeTrackTicket[] {
  //   return this.apiResults;
  // }

  // /**
  //  * @description Call firebase server to get weTrack tickets
  //  * @returns {void}
  //  */
  // public call(): void {
  //   if (!this.loading) {
  //     this.updateLoading(true);
  //     this.httpSubscription = this.httpClient.get<WeTrackTicket[]>(this.databaseUrl).subscribe(
  //       (response: any) => {
  //         this.apiResults = response;
  //         this.updateLoading(false);
  //         this.isSuccessfullyCompleted = true;
  //       },
  //       (error: any) => {
  //         console.log(error, error.error)
  //         this.isSuccessfullyCompleted = false;
  //         this.updateLoading(false);
  //       }
  //     );
  //   }
  // }
}
