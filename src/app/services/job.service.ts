import { HttpClient } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';

import { JobsResponse, JobData } from '../models/jobs-response.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class JobService extends ApiService<JobsResponse> {
  protected serverURL: string = 'http://localhost:3000/jobs/get'; // For use with https://github.com/micah-wehrle/ABCNest
  private selectedJobAccountNumber: number = 0;

  constructor(injector: Injector) {
    super(injector);
  }

  protected parseApiResponse(response: any): JobsResponse {
    return new JobsResponse(response);
  }

  /**
   * @description Getter for currently selected job.
   * @returns {JobData} Returns the selected job
   */
   public getSelectedJob(): JobData {
    if (!this.loading && this.isSuccessfullyCompleted && this.apiResults && this.apiResults.jobs && Array.isArray(this.apiResults.jobs)) {
      for (let i = 0; i < this.apiResults.jobs.length; i++) {
        const curJob = this.apiResults.jobs[i];
        if (curJob && curJob.accountNumber === this.selectedJobAccountNumber) {
          return this.apiResults.jobs[i];
        }
      }
    }
    return null;
  }

  /**
   * @description Setter for setting the account number of the selected job.
   * @param {number} accountNumber The account number of the selected job
   * @returns {void}
   */
  public setSelectedJob(accountNumber: number): void {
    this.selectedJobAccountNumber = accountNumber;
  }
}
