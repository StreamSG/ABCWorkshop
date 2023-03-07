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
  private techUUID: string;
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  
  constructor(private weatherService: WeatherService, private jobService: JobService) { }

  ngOnInit(): void {
    // this.callAndSubscribeToWeatherService(); // To be reinstated as a future version.
    
    this.techUUID = 'cj692r'; // TODO - Make part of a sort of "login" feature. Aaron is working on this I believe, possibly a sort of modal.
    this.callJobServiceJobs(this.techUUID);
    this.subscribeToJobServiceJobs();
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
    this.callJobServiceJobs(this.techUUID);
  }

  /**
   * @description To be used in ngOnInit, will do subscribe to job service jobs so that when the api is called it will update the jobResponse data.
   * @returns {void}
   */
  private subscribeToJobServiceJobs(): void {
    // Should we take(3) here? It is set up to be able to be re-called via the refresh button. So we should take until ngOnDestroy, as it is set now?
    this.jobService.getLoading().pipe(/*take(3), */takeUntil(this.ngUnsubscribe)).subscribe({
      next: (loading: boolean) => {
        if(!loading && this.jobService.hasSuccessfullyCompleted()) {
          this.jobsResponse = this.jobService.getResults();
        }
      }
    });
  }

  /**
   * @description Calls the job list api, passing the tech uuid, which invoke a response from the api containing a list of jobs procedurally generated from the given uuid.
   * @param {string} uuid The uuid for the tech for which to retrieve the job list. 
   * @returns {void}
   */
  private callJobServiceJobs(uuid: string): void {
    this.jobsResponse = null;
    this.jobService.call(uuid);
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
}