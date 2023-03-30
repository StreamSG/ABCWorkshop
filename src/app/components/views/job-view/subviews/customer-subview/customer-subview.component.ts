import { Component, OnInit } from '@angular/core';

import { JobData } from 'src/app/models/jobs-response.model';
import { JobService } from 'src/app/services/job.service';

@Component({
  selector: 'app-customer-subview',
  templateUrl: './customer-subview.component.html',
  styleUrls: ['./customer-subview.component.scss']
})
export class CustomerSubviewComponent implements OnInit {
  public job: JobData;
  
  constructor(private jobService: JobService) { }

  ngOnInit(): void {
    this.job = this.jobService.getSelectedJob();
  }
}
