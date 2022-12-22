import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { JobData } from 'src/app/models/job-data.model';
import { JobService } from 'src/app/services/job.service';
import { WeatherService } from 'src/app/services/weather.service';

@Component({
  selector: 'app-job-list',
  templateUrl: './job-list.component.html',
  styleUrls: ['./job-list.component.scss']
})
export class JobListComponent implements OnInit, OnDestroy {
  // TODO - Pick locations that will have alerts prior to meeting!
  public jobs: JobData[];
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private jobService: JobService, private router: Router, private weatherService: WeatherService) { }

  ngOnInit(): void {
    this.jobs = this.jobService.getJobs();
    this.jobService.setSelectedJob(-1); // In case the user navigates here when a job was already selected, we want to "forget" the job that was selected

    this.subscribeToJobServiceList();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete
  }

  /**
   * @description On click method for use in html for when a job from the list is clicked, in order to set the selected job index and route to the job view.
   * @param {number} index The index of the job to mark as selected
   * @param {JobData} selectedJob - the current job clicked, lat long needed for this job
   * @returns {void} Returns void {void}
   */
  public onJobClicked(selectedJob: JobData, index: number): void {
    if (selectedJob) {
      this.weatherService.call(selectedJob.lat, selectedJob.long);
    }
    this.jobService.setSelectedJob(index);
    this.router.navigate(['job']);
  }

  /**
   * @description Subscribe to the job service update in case a new job is added/removed from the list.
   * @returns {void}
   */
  private subscribeToJobServiceList(): void {
    this.jobService.jobListChanged.pipe(takeUntil(this.ngUnsubscribe)).subscribe({
      next: (jobs: JobData[]) => {
        this.jobs = jobs;
      }
    });
  }

}
