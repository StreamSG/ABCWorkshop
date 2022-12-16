import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JobData } from 'src/app/models/job-data.model';
import { JobService } from 'src/app/services/job.service';

@Component({
  selector: 'app-job-list',
  templateUrl: './job-list.component.html',
  styleUrls: ['./job-list.component.scss']
})
export class JobListComponent implements OnInit {

  // TODO - Pick locations that will have alerts prior to meeting!
  public jobs: JobData[];

  constructor(private jobService: JobService, private router: Router) { }

  ngOnInit(): void {
    this.jobs = this.jobService.getJobs();
    this.jobService.setSelectedJob(-1); // In case the user navigates here when a job was already selected, we want to "forget" the job that was selected
  }

  /**
   * @description On click method for use in html for when a job from the list is clicked, in order to set the selected job index and route to the job view.
   * @param {number} index The index of the job to mark as selected
   */
  public onJobClicked(index: number): void {
    this.jobService.setSelectedJob(index);
    this.router.navigate(['job']);
  }

}
