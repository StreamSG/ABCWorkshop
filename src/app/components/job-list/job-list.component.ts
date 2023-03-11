import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { JobsResponse, JobData } from 'src/app/models/jobs-response.model';
import { JobService } from 'src/app/services/job.service';
import { WeatherService } from 'src/app/services/weather.service';

@Component({
  selector: 'app-job-list',
  templateUrl: './job-list.component.html',
  styleUrls: ['./job-list.component.scss']
})
export class JobListComponent implements OnInit, OnDestroy {
  public jobsResponse: JobsResponse;
  public jobLoadingState: string; 
  
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private jobService: JobService, private router: Router, private weatherService: WeatherService) { }

  ngOnInit(): void {
    this.subscribeToJobServiceList();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  /**
   * @description On click method for use in html for when a job from the list is clicked, in order to set the selected job index and route to the job view.ed
   * @param {JobData} selectedJob - the current job clicked, lat long needed for this job
   * @returns {void} Returns void {void}
   */
  public onJobClicked(selectedJob: JobData): void {
    if (selectedJob) {
      // this.weatherService.call(selectedJob.lat, selectedJob.long);
    }
    this.jobService.setSelectedJob(selectedJob.accountNumber);
    this.router.navigate(['job']);
  }

  /**
   * @description For use in ngOnInit to set up a subscription to the job service list, such that if the job list is updated the component will receive an updated list. Un-subscription handled in ngOnDestroy.
   * @returns {void}
   */
  private subscribeToJobServiceList(): void {
    this.jobService.getLoading().pipe(takeUntil(this.ngUnsubscribe)).subscribe({
      next: (loading: boolean) => {
        if (loading) {
          this.jobLoadingState = 'loading';
        }
        else {
          if(this.jobService.hasSuccessfullyCompleted()) {
            this.jobLoadingState = 'completed';
            this.jobsResponse = this.jobService.getResults();
          }
          else {
            this.jobLoadingState = 'failed';
          }
        }
      }
    });
  }
}
