import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, Subscription, take, takeUntil } from 'rxjs';
import { CookieService } from 'ngx-cookie-service'

import { JobsResponse } from 'src/app/models/jobs-response.model';
import { WeatherAlertResponse } from 'src/app/models/weather-alert.model';
import { JobService } from 'src/app/services/job.service';
import { WeatherService } from 'src/app/services/weather.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit, OnDestroy {
  public weatherAlertResponse: WeatherAlertResponse;
  public jobsResponse: JobsResponse;
  private techUUID: string;
  private jobServiceSubscription: Subscription;
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private weatherService: WeatherService, private jobService: JobService, public cookieService: CookieService) { }

  ngOnInit(): void {
    this.techUUID = this.cookieService.get('user'); // TODO - Make part of a sort of "login" feature. Aaron is working on this I believe, possibly a sort of modal.
    if (!this.jobService.getResults()) { // don't call the api if it already has data
      this.callJobServiceJobs(this.techUUID);
    }
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
    if (this.jobServiceSubscription && !this.jobServiceSubscription.closed) {
      this.jobServiceSubscription.unsubscribe(); // This prevents a situation where the user attempts to subscribe to the api call when there is already a pending api call.
    }
    this.jobServiceSubscription = this.jobService.getLoading().pipe(take(3), takeUntil(this.ngUnsubscribe)).subscribe({
      next: (loading: boolean) => {
        if(!loading && this.jobService.hasSuccessfullyCompleted()) {
          this.jobsResponse = this.jobService.getResults();
          // Putting this here is bad practice, you shouldn't string calls together! We should talk about how to fix long term. I'm fine leaving it in for now.
          this.callAndSubscribeToWeatherService();
        }
      }
    });
  }

  /**
   * @description Calls the job list api, passing the tech uuid, which invoke a response from the api containing a list of jobs procedurally generated from the given uuid. Also subscribes to the service for when the response comes through
   * @param {string} uuid The uuid for the tech for which to retrieve the job list.
   * @returns {void}
   */
  private callJobServiceJobs(uuid: string): void {
    this.jobsResponse = null;
    this.subscribeToJobServiceJobs();
    this.jobService.call(uuid);
  }

  /**
   * @description - Subscribes to weather service and sets global variable for the api response
   * @returns {void}
   */
  private callAndSubscribeToWeatherService(): void {
    const jobList = this.jobsResponse.jobs;
    if (Array.isArray(jobList) && jobList.length > 0) { // only want to make this call if there are
      this.weatherService.call(jobList[0].location.lat, jobList[0].location.long); // calls with first assigned job cause alerts should be similar to the area
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
