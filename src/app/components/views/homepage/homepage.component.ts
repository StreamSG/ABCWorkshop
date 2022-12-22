import { Component, OnInit } from '@angular/core';
import { Subject, take, takeUntil } from 'rxjs';

import { JobData } from 'src/app/models/job-data.model';
import { WeatherAlertResponse } from 'src/app/models/weather-alert.model';
import { JobService } from 'src/app/services/job.service';
import { WeatherService } from 'src/app/services/weather.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {
  public weatherAlertResponse: WeatherAlertResponse;
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  public jobList: JobData[];
  
  constructor(private weatherService: WeatherService, private jobService: JobService) { }

  ngOnInit(): void {
    this.jobList = this.jobService.getJobs();
    this.callAndSubscribeToWeatherService();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete
  }

  /**
   * @description For use in html when the request job button is clicked. Will Generate a new job to add to the job list
   * @returns {void}
   */
  public onRequestJobButtonClick(): void {
    this.jobService.generateNewJob();
  }

  /**
   * @description - Subscribes to weather service and sets global variable for the api response
   * @returns {void}
   */
  private callAndSubscribeToWeatherService(): void {
    if (Array.isArray(this.jobList) && this.jobList.length > 0) { // only want to make this call if there are 
      this.weatherService.call(this.jobList[0].lat, this.jobList[0].long); // calls with first assigned job cause alerts should be similar to the area
      this.weatherService.getLoading().pipe(take(3), takeUntil(this.ngUnsubscribe)).subscribe({
        next: (loading: boolean) => {
          if (!loading && this.weatherService.hasSuccessfullyCompleted()) {
            this.weatherAlertResponse = this.weatherService.getResults();
          }
        }
      });
    }
  }
}