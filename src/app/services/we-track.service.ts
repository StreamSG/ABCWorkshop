import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Data } from '@angular/router';
import { Observable, ReplaySubject } from 'rxjs';
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
          // on a positive responsse, store the ticket data and resolve the promise
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

  public deleteTicket(n: number): Promise<WeTrackTicket[]> {
    let updatedTicketPayload = this.tickets.slice();
    updatedTicketPayload.splice(n,1);
    return new Promise( (resolve, reject) => {
      this.http.put(this.databaseUrl, JSON.stringify(updatedTicketPayload)).subscribe({
        next: () => {
          this.tickets.splice(n,1);
          resolve(this.getTickets());
        }
      });
    });
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
