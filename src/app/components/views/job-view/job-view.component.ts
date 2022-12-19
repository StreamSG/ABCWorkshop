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
  public activeTab: number = 0;
  public readonly tabTitleRoutes: string[] = ['job', 'customer', 'history', 'facilities', 'tests'];

  constructor(private jobService: JobService, private router: Router) { }

  ngOnInit(): void {
    this.job = this.jobService.getSelectedJob(); // Will be undefined if no job selected
    if (!this.job) {
      this.router.navigate(['']); // leave this page if visited erroneously, or if we have a "bad" job
      return;
    }

    // check current route
  }

  onTabClick(tabIndex: number): void {
    this.activeTab = tabIndex;
    if(this.activeTab === 0) {
      this.router.navigate(['job'])
    }
    else {
      this.router.navigate(['job', this.tabTitleRoutes[this.activeTab]]);
    }
  }

}
