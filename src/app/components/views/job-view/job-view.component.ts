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

  public job: JobData;

  constructor(private jobService: JobService, private router: Router) { }

  ngOnInit(): void {
    if (this.jobService.getSelectedIndex() === -1) {
      this.router.navigate(['']); // leave this page if visited erroneously 
      return;
    }
    this.job = this.jobService.getSelectedJob();
  }

}
