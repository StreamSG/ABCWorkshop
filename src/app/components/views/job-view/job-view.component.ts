import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JobData } from 'src/app/models/job-data.model';
import { JobService } from 'src/app/services/job.service';

@Component({
  selector: 'app-job-view',
  templateUrl: './job-view.component.html',
  styleUrls: ['./job-view.component.scss']
})
export class JobViewComponent implements OnInit {
  public job: JobData; // To be retrieved from jobService

  constructor(private jobService: JobService, private router: Router) { }

  ngOnInit(): void {
    this.job = this.jobService.getSelectedJob(); // Will be undefined if no job selected
    if (!this.job) {
      this.router.navigate(['']); // leave this page if visited erroneously, or if we have a "bad" job
      return;
    }
  }

}