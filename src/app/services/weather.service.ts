import { Injectable, Injector } from '@angular/core';

import { WeatherAlertResponse } from '../models/weather-alert.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class WeatherService extends ApiService<WeatherAlertResponse> {
  protected serverUrl: string = 'https://api.weather.gov/alerts/active';
  protected apiResultsConstructor: new (response: any) => WeatherAlertResponse = WeatherAlertResponse;

  constructor (injector: Injector) {
    super('Weather Service', injector);
  }

  /**
   * @description - Takes the latitude and longitude from a job location and class the weather api with that data
   * @param {number} lat - The latitude for the desired weather alerts
   * @param {number} long - The longitude for teh desired weather alerts
   * @returns {void}
   */
  public call(lat: number, long: number): void {
    if ((lat || lat === 0) && (long || long === 0)) {
      this.get(`?point=${lat}%2C${long}&limit=500`);
    }
  }
}
