import { Component, OnInit } from '@angular/core';
import { Subject, take, takeUntil } from 'rxjs';

import { JobData } from 'src/app/models/job-data.model';
import { JobsResponse } from 'src/app/models/jobs-response.model';
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
  public jobsResponse: JobsResponse;
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  
  constructor(private weatherService: WeatherService, private jobService: JobService) { }

  ngOnInit(): void {
    // this.callAndSubscribeToWeatherService();
    this.callAndSubscribeToJobService();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  /**
   * @todo This method requires implementation, now that the job generation has been moved to the back end. Will require back end changes as well, requesting the back end to generate a new job. This should be done by creating a system where the front end can do: backendURL/jobs/get/{uuid}/{job-index}. Usually, when removing job-index, the back end will decide how many jobs should be returned. However, when passing job-index, the back end will then then generate that many jobs and remove them. So essentially the front end will request job-index as current job count + 1
   * @description For use in html when the request job button is clicked. Will Generate a new job to add to the job list
   * @returns {void}
   */
  public onRequestJobButtonClick(): void {
    console.log('TODO: awaiting implementation as a future feature.');
  }

  /**
   * @description For use in html when the refresh button is clicked. Will call JobService 
   * @returns {void}
   */
  public onRefreshJobList(): void {
    this.callAndSubscribeToJobService();
  }
  
  // This has been temporarily removed until we can decide where the weather api will be called (back end or front end).
  // /**
  //  * @description - Subscribes to weather service and sets global variable for the api response
  //  * @returns {void}
  //  */
  // private callAndSubscribeToWeatherService(): void {
  //   if (Array.isArray(this.jobList) && this.jobList.length > 0) { // only want to make this call if there are 
  //     this.weatherService.call(this.jobList[0].lat, this.jobList[0].long); // calls with first assigned job cause alerts should be similar to the area
  //     this.weatherService.getLoading().pipe(take(3), takeUntil(this.ngUnsubscribe)).subscribe({
  //       next: (loading: boolean) => {
  //         if (!loading && this.weatherService.hasSuccessfullyCompleted()) {
  //           this.weatherAlertResponse = this.weatherService.getResults();
  //         }
  //       }
  //     });
  //   }
  // }

  private callAndSubscribeToJobService(): void {
    this.jobsResponse = null;
    this.jobService.call('mw224e');
    this.jobService.getLoading().pipe(take(3), takeUntil(this.ngUnsubscribe)).subscribe({
      next: (loading: boolean) => {
        if(!loading && this.jobService.hasSuccessfullyCompleted()) {
          this.jobsResponse = this.jobService.getResults();
        }
      }
    });
  }
}