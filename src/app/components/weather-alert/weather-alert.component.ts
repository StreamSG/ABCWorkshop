import { Component, Input, OnDestroy, OnInit } from '@angular/core';

import {  WeatherService } from 'src/app/services/weather.service';
import { WeatherAlertResponse } from 'src/app/models/weather-alert.model';
import { interval, Subscription, take } from 'rxjs';

@Component({
  selector: 'app-weather-alert',
  templateUrl: './weather-alert.component.html',
  styleUrls: ['./weather-alert.component.scss']
})
export class WeatherAlertComponent implements OnInit, OnDestroy {
  @Input() weatherAlert: WeatherAlertResponse;
  public showToast: boolean = true; // By default we want to show the toast, but will be changed if the user closes the toast or if new weather alert data is called from the API
  public toastTimeoutBarWidth: number = 100; // Default the bar to 100% width
  private timeoutBarUpdateIntervalSubscription: Subscription;

  constructor(private weatherService: WeatherService) { }

  ngOnInit(): void {
    this.subscribeToWeatherService(); // subscribe to updates in the weatherService so we can show the toast in case it was closed
    this.setupToastTimeout();
  }

  ngOnDestroy(): void {
    this.timeoutBarUpdateIntervalSubscription.unsubscribe();
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

  /**
   * @description Will create and subscribe to an interval which will adjust the width of the toast timeout timer bar. Shrinks with the frequency of the variable updateInterval. When the interval completes, hides the toast
   * @returns {void}
   */
  private setupToastTimeout(): void {
    const toastTimeoutTime: number = 10000; // Adjustable to make the toast display a shorter or longer amount of time
    const toastTimeoutUpdateInterval: number = 10; // Adjustable to make the shrinking of the timer bar smoother in exchange for more processing power. The smaller the number, the more frequently the bar width will be calculated.
    
    const toastLifespanEndTime: number = new Date().getTime() + toastTimeoutTime; 
    
    // Figure out how many times the interval will be called in the lifespan of the toast, so we can take() that many times.
    const numberOfTimesToTakeInterval: number = Math.ceil(toastTimeoutTime / toastTimeoutUpdateInterval);
    this.timeoutBarUpdateIntervalSubscription = interval(toastTimeoutUpdateInterval)
    .pipe( take(numberOfTimesToTakeInterval) )
      .subscribe({
        next: () => { // Each interval, shrink the timer bar
          const timeLeft: number = toastLifespanEndTime - new Date().getTime();
          this.toastTimeoutBarWidth = Math.round( timeLeft / toastTimeoutTime * 100000 )/1000; 

          if (timeLeft <= 0) { // this is a safeguard against the window not being in focus when the timer runs out. 
            this.showToast = false;
            this.timeoutBarUpdateIntervalSubscription.unsubscribe();
          }
        },
        complete: () => { // When the take(n) hits the limit, the subscription will complete, then hide the tost
          // With the addition of the timeLeft < 0 check above, this will probably never trigger. I can't unfortunately find a way to avoid this. It doesn't functionally matter, though I (micah) believe it to be bad practice to always "escape" something and never let it run to completion. I'm leaving it in in case some weird edge case causes this to be needed when the above check doesn't trigger but the interval completes, the alert will still be hidden.
          this.showToast = false;
        }
      });
  }
}
