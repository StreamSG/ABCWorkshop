import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';

import { JobData } from 'src/app/models/jobs-response.model';
import { JobService } from 'src/app/services/job.service';

@Component({
  selector: 'app-customer-subview',
  templateUrl: './customer-subview.component.html',
  styleUrls: ['./customer-subview.component.scss']
})
export class CustomerSubviewComponent implements OnInit, OnDestroy {
  public job: JobData;
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  
  constructor(private jobService: JobService) { }

  ngOnInit(): void {
    this.requestJobData();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  /**
   * @description - Subscribe to job service in order to get currently selected job data. To be called in ngOnInit()
   * @returns {void}
   */
  private requestJobData(): void {
    this.jobService.getLoading().pipe(takeUntil(this.ngUnsubscribe)).subscribe({
      next: (loading: boolean) => {
        if (!loading) {
          this.job = this.jobService.getSelectedJob();
        }
      }
    });
  }
}
