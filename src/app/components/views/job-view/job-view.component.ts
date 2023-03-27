import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, take, takeUntil } from 'rxjs';

import { JobData } from 'src/app/models/jobs-response.model';
import { WeatherAlertResponse } from 'src/app/models/weather-alert.model';
import { JobService } from 'src/app/services/job.service';
import { WeatherService } from 'src/app/services/weather.service';

@Component({
  selector: 'app-job-view',
  templateUrl: './job-view.component.html',
  styleUrls: ['./job-view.component.scss']
})
export class JobViewComponent implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  public weatherAlertResponse: WeatherAlertResponse;
  public job: JobData;
  public activeTab: number = 0;
  public readonly tabTitleRoutes: string[] = ['job', 'customer', 'history', 'facilities', 'tests'];
  private jobApiLoading: boolean;

  constructor(private jobService: JobService, private router: Router, private weatherService: WeatherService) { }

  ngOnInit(): void {
    this.getCurrentJob();
    this.subscribeToWeatherService();
    this.setActiveTabByUrl();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  /**
   * @description Will check if a job is currently selected, and if not will redirect user to homepage.
   * @returns {void}
   */
  private verifyJobSelected(): void {
    if (!this.job) {
      this.router.navigate(['']); // leave this page if visited erroneously, or if we have a "bad" job=
    }
  }

  /**
   * @description Will check current url path, and will adjust the currently selected tab to reflect the url route.
   * @returns {void}
   */
  private setActiveTabByUrl(): void {
    const curRoute = this.router.url.split('/');
    if (this.tabTitleRoutes && Array.isArray(this.tabTitleRoutes) && curRoute.length > 2) {
      for (let i = 0; i < this.tabTitleRoutes.length; i++) {
        if (this.tabTitleRoutes[i] === curRoute[2]) {
          this.activeTab = i;
          return;
        }
      }
    }
  }
  
  /**
   * @description For use in html, when the user clicks on a tab. Will set active tab and direct route to specified tab
   * @param {number} tabIndex The index of the tab, to be passed from the ngFor loop.
   * @returns {void}
   */
  public onTabClick(tabIndex: number): void {
    this.activeTab = tabIndex;
    if (this.activeTab === 0) {
      this.router.navigate(['job']) // no extra path for job tab to avoid job/job
    }
    else {
      this.router.navigate(['job', this.tabTitleRoutes[this.activeTab]]); // All other paths are job/tab-name
    }
  }

  /**
   * @description - Subscribe to job service in order to get currently selected job data, and then verify that the given job exists. To be called in ngOnInit()
   * @returns {void}
   */
  private getCurrentJob(): void {
    this.job = this.jobService.getSelectedJob();
    this.verifyJobSelected(); // Verify that the job is not null. This can happen if the user refreshes the page from within a job!
  }

  /**
   * @description - Subscribes to weather service and sets global variable for the api response
   * @returns {void}
   */
  private subscribeToWeatherService(): void {
    this.weatherService.getLoading().pipe(take(2), takeUntil(this.ngUnsubscribe)).subscribe({
      next: (loading: boolean) => {
        if (!loading && this.weatherService.hasSuccessfullyCompleted()) {
          this.weatherAlertResponse = this.weatherService.getResults();
        }
      }
    });
  }

}
