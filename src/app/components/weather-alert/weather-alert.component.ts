import { Component, Input, OnInit } from '@angular/core';

import { WeatherAlertInfo, WeatherAlertResponse } from 'src/app/models/weather-alert.model';
import {  WeatherService } from 'src/app/services/weather.service';

@Component({
  selector: 'app-weather-alert',
  templateUrl: './weather-alert.component.html',
  styleUrls: ['./weather-alert.component.scss']
})
export class WeatherAlertComponent implements OnInit {
  @Input() weatherAlert: WeatherAlertResponse;
  public showToast: boolean = true; // By default we want to show the toast, but will be changed if the user closes the toast or if new weather alert data is called from the API

  constructor(private weatherService: WeatherService) { }

  ngOnInit(): void {

    this.subscribeToWeatherService(); // subscribe to updates in the weatherService so we can show the toast in case it was closed

    // only show WHEN and WHAT

    if (this.weatherAlert && this.weatherAlert.activeAlertDescription && this.weatherAlert.activeAlertDescription.indexOf('WHAT') > -1 && this.weatherAlert.activeAlertDescription.indexOf('WHERE') && this.weatherAlert.activeAlertDescription.indexOf('WHEN') && this.weatherAlert.activeAlertDescription.indexOf('IMPACTS')) {
    }
  }

  /**
   * @description - For use by the close button on the toast, to set the showToast variable to false, triggering the ngClass show to be disabled and hide to be enabled. Replaces data-bs-dismiss as we want to have more control over the show/hide of the toast.
   * @returns {void}
   */
  public onClickCloseToast(): void {
    this.showToast = false; // close the toast
  }

  /**
   * @description - Will subscribe to the weather service such that whenever a new API response is processed, the showToast will be set to true so the new alert will be displayed.
   * @description - Largely for demo purposes, as normally the user wouldn't be able to switch locations on a whim.
   * @returns {void}
   */
  private subscribeToWeatherService(): void {
    this.weatherService.getLoading().subscribe({
      next: (loading: boolean) => {
        if(!loading && this.weatherService.hasSuccessfullyCompleted()) {
          this.showToast = true; // whenever the call method finishes, we want to show the toast
        }
      }
    });
  }
}
