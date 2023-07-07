import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';

import { JobsResponse, JobData } from '../models/jobs-response.model';

@Injectable({
  providedIn: 'root'
})
export class JobService {
  private serverURL: string = 'http://localhost:3000/jobs/get'; // For use with https://github.com/micah-wehrle/ABCNest
  private jobApiResults: JobsResponse = null;
  private loadingChanged: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private loading: boolean;
  private httpSubscription: Subscription;
  private isSuccessfullyCompleted: boolean = false;
  private selectedJobAccountNumber: number = 0;

  constructor(private http: HttpClient) { }

  /**
   * @description - Resets the state of the service. This should be called in clearJobData service if this service is a job specific API.
   * @returns {void}
   */
   public resetData(): void {
    this.jobApiResults = null;
    this.loading = false;
    this.loadingChanged.next(this.loading);
    this.isSuccessfullyCompleted = false;
    this.cancelRequest();
  }
 
  /**
   * @description - Cancels any ongoing API call.
   * @returns {void}
   */
  private cancelRequest(): void {
    if (this.httpSubscription) {
      if (!this.httpSubscription.closed) {
        this.httpSubscription.unsubscribe();
      }
    }
  }
 
  /**
   * @description - Returns the loadingChanged Subject as an Observable. Components should subscribe to this function, which should return the status of the API, and retrieve the API result when the loading has been updated from true to false. 
   * @returns {Observable<boolean>} - The loadingChanged Subject as an Observable
   */
  public getLoading(): Observable<boolean> {
    return this.loadingChanged.asObservable();
  }
 
  /**
   * @description - Updates the loadingChanged BehaviorSubject. This is called within the service's call() to update the status of the API. The loading variable is updated to true when the API is called, and updated to false when the response is retrieved.
   * @param {boolean} loading - The new value for loading
   * @returns {void}
   */
  private updateLoading(loading: boolean): void {
    this.loading = loading;
    this.loadingChanged.next(this.loading);
  }
 
  /**
   * @description - Returns the status of isSuccessfullyCompleted. This should be used in components to determine if an API should be called again.
   * @returns {boolean} - true if the API has successfully been called; false otherwise
   */
  public hasSuccessfullyCompleted(): boolean {
    return this.isSuccessfullyCompleted;
  }
 
  /**
   * @description - Returns the <yourModel> API result
   * @returns {JobsResponse} - The API results for the inquireBillingAuthorization call
   */
  public getResults(): JobsResponse {
    return this.jobApiResults;
  }
 
  /**
   * @description - Calls the back end in order to get current job data based on given uuid. For use in homepage to load job data when the app is loaded or refreshed.
   * @param {string} uuid - the uuid to be passed to the back end as a seed to generate jobs.
   * @param {number} [jobCount = null] - The number of jobs to request from the back end. If nothing is passed then the back end will determine the job count based on the seed.
   * @returns {void}
   */
  public call(uuid: string, jobCount: number = null): void {
    // validate we're not already loading an API response and that we have the expected parameters
    if (!this.loading && uuid) {
      this.updateLoading(true);
      this.httpSubscription = this.http.get(`${this.serverURL}/${uuid}/${jobCount}`)
        .subscribe({ 
          next: (response: any) => {
            this.jobApiResults = new JobsResponse(response);
            this.isSuccessfullyCompleted = true;
            this.updateLoading(false);
          },
          error: (error: any) => {
            this.jobApiResults = new JobsResponse(error.error);
            this.isSuccessfullyCompleted = false;
            this.updateLoading(false);
          }
        });
      }
  }

  /**
   * @description Getter for currently selected job.
   * @returns {JobData} Returns the selected job
   */
   public getSelectedJob(): JobData {
    if (!this.loading && this.isSuccessfullyCompleted && this.jobApiResults && this.jobApiResults.jobs && Array.isArray(this.jobApiResults.jobs)) {
      for (let i = 0; i < this.jobApiResults.jobs.length; i++) {
        const curJob = this.jobApiResults.jobs[i];
        if (curJob && curJob.accountNumber === this.selectedJobAccountNumber) {
          return this.jobApiResults.jobs[i];
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
