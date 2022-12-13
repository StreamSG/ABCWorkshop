import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Subscription } from 'rxjs';

import { WeatherAlertResponse } from '../models/weather-alert.model';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private serverURL: string = 'https://api.weather.gov/alerts/active';
  private apiResults: WeatherAlertResponse = null;
  private loadingChanged: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private loading: boolean;
  private httpSubscription: Subscription;
  private isSuccessfullyCompleted: boolean = false;

  constructor (private http: HttpClient) { }

  /**
   * @description - Resets the state of the service. This should be called in clearJobData service if this service is a job specific API.
   * @returns {void}
   */
 public resetData(): void {
  this.apiResults = null;
  this.loading = false;
  this.loadingChanged.next(this.loading);
  this.isSuccessfullyCompleted = false;
  this.cancelRequest();
  }

  /**
   * @description - Cancels any ongoing API call.
   * @returns {void}
   */
   private cancelRequest(): void {
    if (this.httpSubscription) {
      if (!this.httpSubscription.closed) {
        this.httpSubscription.unsubscribe();
      }
    }
  }

  /**
   * @description - Returns the loadingChanged Subject as an Observable. Components should subscribe to this function, which should return the status of the API, and retrieve the API result when the loading has been updated from true to false.
   * @returns {Observable<boolean>} - The loadingChanged Subject as an Observable
   */
  public getLoading(): Observable<boolean> {
    return this.loadingChanged.asObservable();
  }

  /**
   * @description - Updates the loadingChanged BehaviorSubject. This is called within the service's call() to update the status of the API. The loading variable is updated to true when the API is called, and updated to false when the response is retrieved.
   * @param {boolean} loading - The new value for loading
   * @returns {void}
   */
  private updateLoading(loading: boolean): void {
    this.loading = loading;
    this.loadingChanged.next(this.loading);
  }

  /**
   * @description - Returns the status of isSuccessfullyCompleted. This should be used in components to determine if an API should be called again.
   * @returns {boolean} - true if the API has successfully been called; false otherwise
   */
  public hasSuccessfullyCompleted(): boolean {
    return this.isSuccessfullyCompleted;
  }

  /**
   * @description - Returns the WeatherAlert API result
   * @returns {WeatherAlert[]} - The API results for the weather.gov api call
   */
  public getResults(): WeatherAlertResponse {
    return this.apiResults;
  }

  /**
   * @description - Will make a request to the weather.gov API, and retrieve weather alerts at the lat/long parameters provided. Will process the response in WeatherAlertResponse model.
   * @param {number} lat - The latitude of the location where you'd like to request weather alerts
   * @param {number} long - The longitude of the location where you'd like to request weather alerts
   * @returns {void}
   */
 public call(lat: number, long: number): void {
  // validate we're not already loading an API response and that we have the expected parameters
  if (!this.loading && lat && long) {
    this.updateLoading(true);
    this.httpSubscription = this.http.get(`${this.serverURL}?point=46%2C-92&limit=500`)
      .subscribe({
        next: (apiResponse: any) => {
          console.log(apiResponse); // TODO - remove, for testing purposes
          this.apiResults = new WeatherAlertResponse(apiResponse);
          console.log('api as new class -', this.apiResults)
          this.isSuccessfullyCompleted = true;
          this.updateLoading(false);
        },
        error: (error: any) => {
          this.apiResults = new WeatherAlertResponse(error.error);
          console.error(error);
          this.isSuccessfullyCompleted = false;
          this.updateLoading(false);
        }
      });
    }
  }
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