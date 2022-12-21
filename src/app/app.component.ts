import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, take, takeUntil } from 'rxjs';

import { GeolocationService } from './geolocation.service';
import { WeatherAlertResponse } from './models/weather-alert.model';
import { WeatherService } from './services/weather.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  public weatherAlertResponse: WeatherAlertResponse;
  private ngUnsubscribe = new Subject<void>(); // Documentation: https://www.intertech.com/angular-best-practice-unsubscribing-rxjs-observables/ search for ngUnsubscribe

  constructor(private weatherService: WeatherService, private locationService: GeolocationService) { }

  ngOnInit(): void {
    
    // TODO This probably won't end up here
    // only use take(2) when you subscribe right after call method!
    this.weatherService.getLoading().pipe( take(2), takeUntil( this.ngUnsubscribe ) ).subscribe({ // For take(), documentation: https://rxjs.dev/api/operators/take
      next: (loading) => {
        if (!loading && this.weatherService.hasSuccessfullyCompleted()) {
          this.weatherAlertResponse = this.weatherService.getResults();
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
