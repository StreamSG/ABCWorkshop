import { HttpClient } from '@angular/common/http';
import { createInjectableType } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { firstValueFrom, ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  private weatherDataLoaded: boolean = false;
  private lastWeatherCheckTime: number; // When the last check was made, time in ms.
  private loadedWeatherData: WeatherAlert[];
  private lastCheckLocation: {lat: number, long: number}; // Where the last weather check was made

  // variables to build request url
  private readonly weatherApiUrl: string = 'https://api.weather.gov/alerts?point='; 
  private readonly urlComma = '%2C';
  private readonly urlEnding = '&limit=500';

  //    
  private readonly timeBetweenChecks: number = 15 * 60 * 1000; // Amount of time that needs to pass before another weather check will be made. Default 15 min converted to ms.
  private readonly maxDistanceForNewCheck = 0.25; // As a raw lat/long distance, this is about 15 miles




  constructor(private http: HttpClient) { }

  public async loadWeatherAlerts(): Promise<WeatherAlert[]> {

    const currentLocation: {lat:number, long: number} = await this.getCurrentCoordinates();
    // console.log('Got current location successfully');

    if (this.weatherDataLoaded // If we have run a test in the pass
      && this.distanceBetweenCurAndLastLocation(currentLocation) < this.maxDistanceForNewCheck // And the user hasn't traveled far enough
      && new Date().getTime() - this.lastWeatherCheckTime < this.timeBetweenChecks && this.loadedWeatherData) { // And the user has checked recently

      return this.loadedWeatherData; // Return the data from the last check
    }
    // Otherwise, we will run/rerun the code to collect the weather data
    this.weatherDataLoaded = false;
    
    // This is the suggested rxjs way to handle observables with async await. More info here: https://rxjs.dev/deprecations/to-promise
    const res = await firstValueFrom(this.http.get<WeatherResponse>(`${this.weatherApiUrl}${currentLocation.lat}%2C${currentLocation.long}&limit=500`)); // don't handle error here. Promise will auto reject and will allow for handling at the receipt of errored data. 
    // console.log('response from weather:');
    console.log(res);

    if (res && res.features && res.features && Array.isArray(res.features) && res.features) {
      if (res.features.length === 0) {
        return []; // no alerts!
      }
      // Parse weather data response
      for (let data of res.features) {
        if (data && data.properties) {
          console.log(data);
        }
      }
    }
    else {
      // throw ()
    }




    return [];
  }

  private async getCurrentCoordinates(): Promise<{lat: number, long: number}> {
    return await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (pos: GeolocationPosition) => { 
          resolve({lat: pos.coords.latitude, long: pos.coords.longitude}); 
        },
        (err) => { 
          reject(err);
        } 
      );
    });
  }

  private distanceBetweenCurAndLastLocation(curLocation: {lat:number, long:number}): number {
    return Math.sqrt( Math.pow(curLocation.lat - this.lastCheckLocation.lat, 2) + Math.pow(curLocation.long - this.lastCheckLocation.long, 2) );
  }
}

export enum WeatherStatus { 'Actual', 'Exercise', 'System', 'Test', 'Draft' }
export enum WeatherMessageType { 'Alert', 'Update', 'Cancel', 'Ack', 'Error' }
export enum WeatherCategory { 'Met', 'Geo', 'Safety', 'Security', 'Rescue', 'Fire', 'Health', 'Env', 'Transport', 'Infra', 'CBRNE', 'Other' }
export enum WeatherSeverity { 'Extreme', 'Severe', 'Moderate', 'Minor', 'Unknown' }
export enum WeatherCertainty { 'Observed', 'Likely', 'Possible', 'Unlikely', 'Unknown' }
export enum WeatherUrgency { 'Immediate', 'Expected', 'Future', 'Past', 'Unknown' }
export enum WeatherRecommendedResponse { 'Shelter', 'Evacuate', 'Prepare', 'Execute', 'Avoid', 'Monitor', 'Assess', 'AllClear', 'None' }

export interface WeatherAlert {
  sent: string, // time the warning was sent
  onset: string | null, // expecting event beginning time (nullable)
  expires: string, // expiration time of the warning
  ends: string | null, // expected end time of the event (nullable)
  status: WeatherStatus,
  messageType: WeatherMessageType,
  category: WeatherCategory,
  severity: WeatherSeverity,
  certainty: WeatherCertainty,
  urgency: WeatherUrgency,
  event: string, // A description of the vent, such as 'Wind Advisory'
  headline: string | null, // The headline for the event (nullable)
  description: string, // The text describing the subject event 
  instruction: string | null, // Recommended action (nullable)
  response: WeatherRecommendedResponse
}

export interface WeatherResponse {
  features: {
    properties: WeatherAlert
  }[]
}