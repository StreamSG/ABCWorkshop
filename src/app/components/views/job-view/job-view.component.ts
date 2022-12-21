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
    
    this.verifyJobSelected();
    this.setActiveTabByUrl();
  }

  /**
   * @description Will check if a job is currently selected, and if not will redirect user to homepage.
   * @returns {void}
   */
  private verifyJobSelected(): void {
    if (!this.job) {
      this.router.navigate(['']); // leave this page if visited erroneously, or if we have a "bad" job=
    }
  }

  /**
   * @description Will check current url path, and will adjust the currently selected tab to reflect the url route.
   * @returns {void}
   */
  private setActiveTabByUrl(): void {
    const curRoute = this.router.url.split('/');
    if (curRoute.length > 2) {
      for (let i = 0; i < this.tabTitleRoutes.length; i++) {
        if (this.tabTitleRoutes[i] === curRoute[2]) {
          this.activeTab = i;
          return;
        }
      }
    }
  }
  
  /**
   * @description For use in html, when the user clicks on a tab. Will set active tab and direct route to specified tab
   * @param {number} tabIndex The index of the tab, to be passed from the ngFor loop.
   */
  public onTabClick(tabIndex: number): void {
    this.activeTab = tabIndex;
    if (this.activeTab === 0) {
      this.router.navigate(['job']) // no extra path for job tab to avoid job/job
    }
    else {
      this.router.navigate(['job', this.tabTitleRoutes[this.activeTab]]); // All other paths are job/tab-name
    }
  }

}
