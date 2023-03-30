import { Component, OnInit } from '@angular/core';

import { JobData } from 'src/app/models/jobs-response.model';
import { JobService } from 'src/app/services/job.service';

@Component({
  selector: 'app-history-subview',
  templateUrl: './history-subview.component.html',
  styleUrls: ['./history-subview.component.scss']
})
export class HistorySubviewComponent implements OnInit {
  public job: JobData;
  
  constructor(private jobService: JobService) { }

  ngOnInit(): void {
    this.job = this.jobService.getSelectedJob();
  }
}
