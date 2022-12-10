import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs'; // TODO Remove when async function is removed.
import { Observable, BehaviorSubject } from 'rxjs';
import { Subscription } from 'rxjs';

import { WeatherAlertResponse } from '../models/weather-alert.model';

// import { yourModel } from '' // TODO import your own model here

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private serverURL: string = 'https://api.weather.gov/alerts';
  private apiResults: WeatherAlertResponse = null;
  private loadingChanged: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private loading: boolean;
  private httpSubscription: Subscription;
  private isSuccessfullyCompleted: boolean = false;
 
  constructor (private http: HttpClient,) { }

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
   * @description - TODO - Fill out with your own description. Tell us why this service is needed, what the API does, and where in the application this service is being used.
   * @param {number} lat The latitude of the location where you'd like to request weather alerts
   * @param {number} long The longitude of the location where you'd like to request weather alerts
   * @returns {void}
   */
 public call(lat: number, long: number): void {
  // validate we're not already loading an API response and that we have the expected parameters
  if (!this.loading && lat && long) {
    this.updateLoading(true);
    this.httpSubscription = this.http.get(`${this.serverURL}?point=${lat}%2C${long}&limit=500`)
      .subscribe({
        next: (apiResponse: any) => {
          console.log(apiResponse);
          // this.apiResults = new WeatherAlert(response);
          this.apiResults = new WeatherAlertResponse(apiResponse);
          this.isSuccessfullyCompleted = true;
          this.updateLoading(false);
        },
        error: (error: any) => {
          // this.apiResults = new WeatherAlert(error.error);
          console.error(error);
          this.isSuccessfullyCompleted = false;
          this.updateLoading(false);
        }
      });
    }
  }























  // private weatherDataLoaded: boolean = false; // Will not have any weather data at the start, so initialize to false
  // private lastWeatherCheckTime: number; // When the last check was made, time in ms.
  // private loadedWeatherAlerts: WeatherAlert[]; // Array of alerts, which will be stored in case a weather alert request is made shortly after a call to the api
  // private lastCheckLocation: {lat: number, long: number}; // Where the last weather check was made
  
  // // readonly variables which can be tweaked to standards
  // private readonly showActiveAlertsOnly = false; // Can be changed for debug purposes to show 
  // private readonly weatherApiUrl: string = `https://api.weather.gov/alerts${ this.showActiveAlertsOnly ? '/active' : '' }`;
  // private readonly timeBetweenChecks: number = 15 * 60000; // Amount of time that needs to pass before another weather check will be made. Default 15 min converted to ms.
  // private readonly maxMilesForNewCheck = 15;  // THIS ISN'T SO SIMPLE. LAT/LONG IS A LITTLE TRICKY TO CONVERT, IGNORE MY "BIG BRAIN" MATH

  // // constructor(private http: HttpClient) { }

  
  

  // /**
  //  * @description Requests coordinates from the browser and returns as a lat/long object
  //  * @returns {Promise<{lat: number, long: number}>} Returns a promise resolved to a lat/long object
  //  */
  // private getCurrentCoordinates(): Promise<{lat: number, long: number}> {
  //   return new Promise((resolve, reject) => { // Create the promise
  //     navigator.geolocation.getCurrentPosition( // Attempt to get the geolocation
  //       (pos: GeolocationPosition) => { // In the event of a success
  //         resolve( {
  //           lat: pos.coords.latitude, // create a lat/long object and resolve
  //           long: pos.coords.longitude
  //         } ); 
  //       },
  //       (err) => {  // In the event of a failure, reject with the error
  //         reject(err);
  //       } 
  //     );
  //   });
  // }
  // private milesBetweenCurAndLastLocation(curLocation: {lat:number, long:number}): number {
  //   const distanceInLatLongUnits = Math.sqrt( Math.pow(curLocation.lat - this.lastCheckLocation.lat, 2) + Math.pow(curLocation.long - this.lastCheckLocation.long, 2) ); // Distance formula
  //   return distanceInLatLongUnits * 5400 / 90; // Formula to convert lat/long units to miles THIS IS WRONG
  // }

  // /**
  //  * @async
  //  * @description Requests weather alert data from the weather.gov api, parses the data, and returns a neat array of WeatherAlert data.
  //  * @returns {Promise<WeatherAlert[]>} Returns a promise resolving in an array of WeatherAlerts
  //  */
  //  public async asyncloadWeatherAlerts(): Promise<WeatherAlert[]> {

  //   const currentLocation: {lat:number, long: number} = await this.getCurrentCoordinates();

  //   if (this.weatherDataLoaded // If we have run a test in the pass
  //     && this.milesBetweenCurAndLastLocation(currentLocation) < this.maxMilesForNewCheck // And the user hasn't traveled far enough
  //     && new Date().getTime() - this.lastWeatherCheckTime < this.timeBetweenChecks && this.loadedWeatherAlerts) { // And the user has checked recently

  //     return this.loadedWeatherAlerts; // Return the data from the last check
  //   }
  //   // Otherwise, we will run/rerun the code to collect the weather data
  //   this.weatherDataLoaded = false;
    
  //   // This is the suggested rxjs way to handle observables with async await. More info here: https://rxjs.dev/deprecations/to-promise
  //   const res = await firstValueFrom(this.http.get<WeatherResponse>(
  //     `${this.weatherApiUrl}?point=43.0722%2C-89.4008&limit=500`
  //   )); // don't handle error here. Promise will auto reject and will allow for handling at the receipt of errored data. 

  //   if (!(res && res.features && res.features && Array.isArray(res.features) && res.features)) { // Truthy check
  //     console.error('Received unusable data from weather server')
  //     throw (res); // Will trigger .catch() case for the main loadWeatherAlerts promise
  //   }

  //   this.weatherDataLoaded = true; // Mark that we got a response, even if the array is empty
  //   this.loadedWeatherAlerts = []; // Prepare and clear the loadedWeatherAlerts for the potential of new alerts

  //   // Parse weather data response
  //   for (let data of res.features) { // loop through all alerts. Will skip if array is empty
  //     if (!(data && data.properties)) { continue; } // Truthy check for current element data
  //     let tempAlert: WeatherAlert = new WeatherAlert(
  //       data.properties.sent ? data.properties.sent : '',
  //       data.properties.onset ? data.properties.onset : '',
  //       data.properties.expires ? data.properties.expires : '',
  //       data.properties.ends ? data.properties.ends : '',
  //       data.properties.status ? data.properties.status : '',
  //       data.properties.messageType ? data.properties.messageType : '',
  //       data.properties.category ? data.properties.category : '',
  //       data.properties.severity ? data.properties.severity : '',
  //       data.properties.certainty ? data.properties.certainty : '',
  //       data.properties.urgency ? data.properties.urgency : '',
  //       data.properties.event ? data.properties.event : '',
  //       data.properties.headline ? data.properties.headline : '',
  //       data.properties.description ? data.properties.description : '',
  //       data.properties.instruction ? data.properties.instruction : '',
  //       data.properties.response ? data.properties.response : '',
  //     );
  //     this.loadedWeatherAlerts.push(tempAlert); // Add generated alert to the master array
  //   }
  //   return this.loadedWeatherAlerts; // Finally, return the new array of alerts ( may be [] )
  // }
}

// // If we convert this to a model, you can just put this before the constructor
// /**
//  * @description The important weather alert data as pulled from the weather.gov api. All of the variable names here match the variable names used in the api.
//  * @param {string} sent Time the warning was sent
//  * @param {string} onset expecting event beginning time (nullable)
//  * @param {string} expires expiration time of the warning
//  * @param {string} ends expected end time of the event (nullable)
//  * @param {string} status For normal weather expect Actual, may only want to access when that is the case
//  * @param {string} messageType The code denoting the type of the event message
//  * @param {string} category The code denoting the category of the event
//  * @param {string} severity How severe the weather event is
//  * @param {string} certainty How certain the weather event is
//  * @param {string} urgency How urgent the weather event is
//  * @param {string} event A description of the event, such as 'Wind Advisory'
//  * @param {string} headline The headline for the event (nullable)
//  * @param {string} description The text describing the subject event 
//  * @param {string} instruction Recommended action (nullable)
//  * @param {WeatherRecommendedResponse} response Specific type of recommended response
//  */
// export class WeatherAlert {
//   constructor(
//     public sent: string,
//     public onset: string,
//     public expires: string, 
//     public ends: string,
//     public status: string,
//     public messageType: string, 
//     public category: string,
//     public severity: string,
//     public certainty: string,
//     public urgency: string,
//     public event: string, 
//     public headline: string,
//     public description: string, 
//     public instruction: string,
//     public response: string
//   ){}
// }

// /**
//  * @description Used for the http.get method so typescript knows what sort of response data to expect. Not exported, only needed privately in this file.
//  */
// interface WeatherResponse {
//   features: {
//     properties: WeatherAlert
//   }[]
// }

// These are the enums for the api response variables with set possible values. Each enum has a RESPONSE_ERROR state in case the data received is falsy.
/** 
 * @description Potential weather status variables given by the API 
 * @values Actual, Exercise, System, Test, Draft, RESPONSE_ERROR (assigned by WeatherService file in the event of an API response error)
*/
export enum WeatherStatus { 'Actual', 'Exercise', 'System', 'Test', 'Draft', 'RESPONSE_ERROR' }

/** 
 * @description Potential weather message type variables given by the API 
 * @values Alert, Update, Cancel, Ack, Error, RESPONSE_ERROR (assigned by WeatherService file in the event of an API response error)
*/
export enum WeatherMessageType { 'Alert', 'Update', 'Cancel', 'Ack', 'Error', 'RESPONSE_ERROR' }

/** 
 * @description Potential weather category variables given by the API 
 * @values Met, Geo, Safety, Security, Rescue, Fire, Health, Env, Transport, Infra, CBRNE, Other, RESPONSE_ERROR (assigned by WeatherService file in the event of an API response error)
*/
export enum WeatherCategory { 'Met', 'Geo', 'Safety', 'Security', 'Rescue', 'Fire', 'Health', 'Env', 'Transport', 'Infra', 'CBRNE', 'Other', 'RESPONSE_ERROR' }

/** 
 * @description Potential weather severity variables given by the API 
 * @values Extreme, Severe, Moderate, Minor, Unknown, RESPONSE_ERROR (assigned by WeatherService file in the event of an API response error)
*/
export enum WeatherSeverity { 'Extreme', 'Severe', 'Moderate', 'Minor', 'Unknown', 'RESPONSE_ERROR' }

/** 
 * @description Potential weather certainty variables given by the API 
 * @values Observed, Likely, Possible, Unlikely, Unknown, RESPONSE_ERROR (assigned by WeatherService file in the event of an API response error)
*/
export enum WeatherCertainty { 'Observed', 'Likely', 'Possible', 'Unlikely', 'Unknown', 'RESPONSE_ERROR' }

/** 
 * @description Potential weather urgency variables given by the API 
 * @values Immediate, Expected, Future, Past, Unknown, RESPONSE_ERROR (assigned by WeatherService file in the event of an API response error)
*/
export enum WeatherUrgency { 'Immediate', 'Expected', 'Future', 'Past', 'Unknown', 'RESPONSE_ERROR' }

/** 
 * @description Potential weather recommended response variables given by the API 
 * @values Shelter, Evacuate, Prepare, Execute, Avoid, Monitor, Assess, AllClear, None, RESPONSE_ERROR (assigned by WeatherService file in the event of an API response error)
*/
export enum WeatherRecommendedResponse { 'Shelter', 'Evacuate', 'Prepare', 'Execute', 'Avoid', 'Monitor', 'Assess', 'AllClear', 'None', 'RESPONSE_ERROR' }



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