import { Component, OnInit } from '@angular/core';

import { JobData } from 'src/app/models/jobs-response.model';
import { JobService } from 'src/app/services/job.service';

@Component({
  selector: 'app-job-subview',
  templateUrl: './job-subview.component.html',
  styleUrls: ['./job-subview.component.scss']
})
export class JobSubviewComponent implements OnInit {
  public job: JobData;

  constructor(private jobService: JobService) { }

  ngOnInit(): void {
    this.job = this.jobService.getSelectedJob();
  }

}
