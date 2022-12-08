import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private weatherDataLoaded: boolean = false; // Will not have any weather data at the start, so initialize to false
  private lastWeatherCheckTime: number; // When the last check was made, time in ms.
  private loadedWeatherAlerts: WeatherAlert[]; // Array of alerts, which will be stored in case a weather alert request is made shortly after a call to the api
  private lastCheckLocation: {lat: number, long: number}; // Where the last weather check was made
  
  // readonly variables which can be tweaked to standards
  private readonly showActiveAlertsOnly = false; // Can be changed for debug purposes to show 
  private readonly weatherApiUrl: string = `https://api.weather.gov/alerts${ this.showActiveAlertsOnly ? '/active' : '' }`;
  private readonly timeBetweenChecks: number = 15 * 60000; // Amount of time that needs to pass before another weather check will be made. Default 15 min converted to ms.
  private readonly maxMilesForNewCheck = 15;  // THIS ISN'T SO SIMPLE. LAT/LONG IS A LITTLE TRICKY TO CONVERT, IGNORE MY "BIG BRAIN" MATH

  constructor(private http: HttpClient) { }

  /**
   * @async
   * @description Requests weather alert data from the weather.gov api, parses the data, and returns a neat array of WeatherAlert data.
   * @returns {Promise<WeatherAlert[]>} Returns a promise resolving in an array of WeatherAlerts
   */
  public async loadWeatherAlerts(): Promise<WeatherAlert[]> {

    const currentLocation: {lat:number, long: number} = await this.getCurrentCoordinates();

    if (this.weatherDataLoaded // If we have run a test in the pass
      && this.milesBetweenCurAndLastLocation(currentLocation) < this.maxMilesForNewCheck // And the user hasn't traveled far enough
      && new Date().getTime() - this.lastWeatherCheckTime < this.timeBetweenChecks && this.loadedWeatherAlerts) { // And the user has checked recently

      return this.loadedWeatherAlerts; // Return the data from the last check
    }
    // Otherwise, we will run/rerun the code to collect the weather data
    this.weatherDataLoaded = false;
    
    // This is the suggested rxjs way to handle observables with async await. More info here: https://rxjs.dev/deprecations/to-promise
    const res = await firstValueFrom(this.http.get<WeatherResponse>(
      `${this.weatherApiUrl}?point=${currentLocation.lat}%2C${currentLocation.long}&limit=500`
    )); // don't handle error here. Promise will auto reject and will allow for handling at the receipt of errored data. 

    if (!(res && res.features && res.features && Array.isArray(res.features) && res.features)) { // Truthy check
      console.error('Received unusable data from weather server')
      throw (res); // Will trigger .catch() case for the main loadWeatherAlerts promise
    }

    this.weatherDataLoaded = true; // Mark that we got a response, even if the array is empty
    this.loadedWeatherAlerts = []; // Prepare and clear the loadedWeatherAlerts for the potential of new alerts

    // Parse weather data response
    for (let data of res.features) { // loop through all alerts. Will skip if array is empty
      if (!(data && data.properties)) { continue; } // Truthy check for current element data
      let tempAlert: WeatherAlert = {
        sent: data.properties.sent ? data.properties.sent : '',
        onset: data.properties.onset ? data.properties.onset : null,
        expires: data.properties.expires ? data.properties.expires : '',
        ends: data.properties.ends ? data.properties.ends : null,
        status: data.properties.status ? data.properties.status : WeatherStatus.RESPONSE_ERROR,
        messageType: data.properties.messageType ? data.properties.messageType : WeatherMessageType.RESPONSE_ERROR,
        category: data.properties.category ? data.properties.category : WeatherCategory.RESPONSE_ERROR,
        severity: data.properties.severity ? data.properties.severity : WeatherSeverity.RESPONSE_ERROR,
        certainty: data.properties.certainty ? data.properties.certainty : WeatherCertainty.RESPONSE_ERROR,
        urgency: data.properties.urgency ? data.properties.urgency : WeatherUrgency.RESPONSE_ERROR,
        event: data.properties.event ? data.properties.event : '',
        headline: data.properties.headline ? data.properties.headline : null,
        description: data.properties.description ? data.properties.description : '',
        instruction: data.properties.instruction ? data.properties.instruction : null,
        response: data.properties.response ? data.properties.response : WeatherRecommendedResponse.RESPONSE_ERROR,
      };
      this.loadedWeatherAlerts.push(tempAlert); // Add generated alert to the master array
    }



    return this.loadedWeatherAlerts; // Finally, return the new array of alerts ( may be [] )
  }

  /**
   * @description Requests coordinates from the browser and returns as a lat/long object
   * @returns {Promise<{lat: number, long: number}>} Returns a promise resolved to a lat/long object
   */
  private getCurrentCoordinates(): Promise<{lat: number, long: number}> {
    return new Promise((resolve, reject) => { // Create the promise
      navigator.geolocation.getCurrentPosition( // Attempt to get the geolocation
        (pos: GeolocationPosition) => { // In the event of a success
          resolve( {
            lat: pos.coords.latitude, // create a lat/long object and resolve
            long: pos.coords.longitude
          } ); 
        },
        (err) => {  // In the event of a failure, reject with the error
          reject(err);
        } 
      );
    });
  }
  private milesBetweenCurAndLastLocation(curLocation: {lat:number, long:number}): number {
    const distanceInLatLongUnits = Math.sqrt( Math.pow(curLocation.lat - this.lastCheckLocation.lat, 2) + Math.pow(curLocation.long - this.lastCheckLocation.long, 2) ); // Distance formula
    return distanceInLatLongUnits * 5400 / 90; // Formula to convert lat/long units to miles THIS IS WRONG
  }
}

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

// If we convert this to a model, you can just put this before the constructor
/**
 * @description The important weather alert data as pulled from the weather.gov api. All of the variable names here match the variable names used in the api.
 * @param {string} sent Time the warning was sent
 * @param {string | null} onset expecting event beginning time (nullable)
 * @param {string} expires expiration time of the warning
 * @param {string | null} ends expected end time of the event (nullable)
 * @param {WeatherStatus} status For normal weather expect Actual, may only want to access when that is the case
 * @param {WeatherMessageType} messageType The code denoting the type of the event message
 * @param {WeatherCategory} category The code denoting the category of the event
 * @param {WeatherSeverity} severity How severe the weather event is
 * @param {WeatherCertainty} certainty How certain the weather event is
 * @param {WeatherUrgency} urgency How urgent the weather event is
 * @param {string} event A description of the event, such as 'Wind Advisory'
 * @param {string | null} headline The headline for the event (nullable)
 * @param {string} description The text describing the subject event 
 * @param {string | null} instruction Recommended action (nullable)
 * @param {WeatherRecommendedResponse} response Specific type of recommended response
 */
export interface WeatherAlert {
  /** @param {string} sent Time the warning was sent */
  sent: string,
  /** @param {string | null} onset expecting event beginning time (nullable) */
  onset: string | null,
  /** @param {string} expires expiration time of the warning */
  expires: string, 
  /** @param {string | null} ends expected end time of the event (nullable) */
  ends: string | null,
  /** @param {WeatherStatus} status For normal weather expect Actual, may only want to access when that is the case */
  status: WeatherStatus,
  /** @param {WeatherMessageType} messageType The code denoting the type of the event message */
  messageType: WeatherMessageType, 
  /** @param {WeatherCategory} category The code denoting the category of the event */
  category: WeatherCategory,
  /** @param {WeatherSeverity} severity How severe the weather event is */
  severity: WeatherSeverity,
  /** @param {WeatherCategory} category The code denoting the category of the event */
  certainty: WeatherCertainty,
  /** @param {WeatherUrgency} urgency How urgent the weather event is */
  urgency: WeatherUrgency,
  /** @param {string} event A description of the event, such as 'Wind Advisory' */
  event: string, 
  /** @param {string | null} headline The headline for the event (nullable) */
  headline: string | null,
  /** @param {string} description The text describing the subject event  */
  description: string, 
  /** @param {string | null} instruction Recommended action (nullable) */
  instruction: string | null,
  /** @param {WeatherRecommendedResponse} response Specific type of recommended response */
  response: WeatherRecommendedResponse
}

/**
 * @description Used for the http.get method so typescript knows what sort of response data to expect. Not exported, only needed privately in this file.
 */
interface WeatherResponse {
  features: {
    properties: WeatherAlert
  }[]
}