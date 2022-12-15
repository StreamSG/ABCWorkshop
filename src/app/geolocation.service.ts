import { EventEmitter, Injectable, OnInit } from '@angular/core';
import { toJSDate } from '@ng-bootstrap/ng-bootstrap/datepicker/ngb-calendar';
import { BehaviorSubject, lastValueFrom, take } from 'rxjs';
import { WeatherService } from './services/weather.service';

@Injectable({
  providedIn: 'root'
})
export class GeolocationService {

  

  public updatedCurrentLocation: BehaviorSubject<void> = new BehaviorSubject<void>(null);
  private preselectedLocations: ButtonLocationData[] = [ // An array of location names and lat/longs, used to generate location buttons in the component html
    { locationName: 'Austin, TX', lat: 30.2672, long: -97.7431 },
    { locationName: 'Cleveland, OH', lat: 41.4993, long: -81.6944 },
    { locationName: 'Dallas, TX', lat: 32.7767, long: -96.7970 },
    { locationName: 'Fort Lauderdale, FL', lat: 26.1224, long: -80.1373 },
    { locationName: 'Milwaukee, WI', lat: 43.0722, long: -89.4008 },
    { locationName: 'Rapid City, SD', lat: 44.0805, long: -103.2310 },
    { locationName: 'Santa Monica, CA', lat: 34.0195, long: -118.4912 },
  ];
  private currentLocation: ButtonLocationData = {
    locationName: 'Loading...',
    lat: 999,  
    long: 999,
    isInvalid: true,
  }

  private jobList: {[key: string]: any}[] = [];

  private static jobCount: number = 5;


  constructor(private weatherService: WeatherService) { }


  public getPreselectedLocations(): ButtonLocationData[] {
    return [
      this.currentLocation,
      ...this.preselectedLocations
    ];
  }

  /**
   * @description Load the user's current location, add the location to the current location button in the preselectedLocations array, and call the weather service API if it hasn't been already.
   * @returns {void}
   */
   public initializeCurrentLocation(): void {
    navigator.geolocation.getCurrentPosition(
      (pos: GeolocationPosition) => { // On successful location call..
        if (!pos || !pos.coords) {
          this.currentLocation.locationName = 'No local pos'; 
          this.currentLocation.isInvalid = true;
          this.updatedCurrentLocation.next();
          return; 
        } 
        this.currentLocation.locationName = 'Current location';
        this.currentLocation.lat = pos.coords.latitude;
        this.currentLocation.long = pos.coords.longitude;
        this.currentLocation.isInvalid = false;
        this.updatedCurrentLocation.next();
      }, 
      (err) => { // Location call failed
        console.error(err);
        this.currentLocation.locationName = 'No local pos'; 
        this.currentLocation.isInvalid = true;
        this.updatedCurrentLocation.next();
      }
    );
  }
}

export interface ButtonLocationData {
  locationName: string,
  lat: number,
  long: number,
  isInvalid?: boolean
}