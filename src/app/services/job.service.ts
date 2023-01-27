import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';

import { JobData } from '../models/job-data.model';
import { JobsResponse } from '../models/jobs-response.model';

@Injectable({
  providedIn: 'root'
})
export class JobService {
  private serverURL: string = 'http://localhost:3000/jobs/get'; // For use with https://github.com/micah-wehrle/ABCNest
  private apiResults: JobsResponse = null;
  private loadingChanged: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private loading: boolean;
  private httpSubscription: Subscription;
  private isSuccessfullyCompleted: boolean = false;

  constructor(private http: HttpClient) { }

  /**
   * @description - Resets the state of the service. This should be called in clearJobData service if this service is a job specific API.
   * @returns {void}
   */
   public resetData(): void {
    this.apiResults = null;
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
    return this.apiResults;
  }
 
  /**
   * @description - //TODO - Fill out with your own description. Tell us why this service is needed, what the API does, and where in the application this service is being used.
   * @returns {void}
   */
  public call(uuid: string): void {
    // validate we're not already loading an API response and that we have the expected parameters
    if (!this.loading && uuid) {
      this.updateLoading(true);
      this.httpSubscription = this.http.get(`${this.serverURL}/${uuid}`)
        .subscribe({ 
          next: (response: any) => {
            this.apiResults = new JobsResponse(response);
            this.isSuccessfullyCompleted = true;
            this.updateLoading(false);
          },
          error: (error: any) => {
            this.apiResults = new JobsResponse(error.error);
            this.isSuccessfullyCompleted = false;
            this.updateLoading(false);
          }
        });
      }
  }



  // EVERYTHING AFTER HERE WILL GO BYE BYE!


  // TODO - Pick locations that will have alerts prior to meeting!
  private jobs: JobData[] = [
    new JobData(41.4993, -81.6944, 'Install', 'Cleveland, OH'),
    new JobData(44.0805, -103.2310, 'Repair', 'Rapid City, SD'),
    new JobData(30.2672, -97.7431, 'Helper', 'Austin, TX'),
    new JobData(26.1224, -80.1373, 'BSW', 'Fort Something, FL'),
    new JobData(34.0195, -118.4912, 'POTS', 'Santa Monica, CA')
  ]; 
  private jobListChanged: BehaviorSubject<JobData[]> = new BehaviorSubject<JobData[]>(this.jobs);
  private selectedJobIndex: number = 0;

  // constructor() { }

  /**
   * @description Getter for master array of jobs
   * @returns {JobData[]} Returns a copy of the master array of jobs
   */
  public getJobs(): JobData[] {
    return this.jobs.slice();
  }

  /**
   * @description Will generate a new job and add it to the end of the current job array.
   * @returns {void}
   */
  public generateNewJob(): void {
    const newJobLatitude: number = +(Math.random() * (49.38 - 24.54) + 24.54).toFixed(2);
    const newJobLongtitude: number = +(Math.random() * (-66.93 + 124.48) - 124.48).toFixed(2);
    const newJob: JobData = new JobData(
      newJobLatitude, // Generates a latitude between -90 and 90 with 3 decimal places
      newJobLongtitude, // Generates a longitude between -180 and 180 with 3 decimal places
      ['Install', 'Repair', 'Helper', 'BSW', 'POTS'][Math.round( Math.random() * 5) ], // Picks a random job type
      'RandomTown, USA Baby'
    );
    this.jobs.push(newJob);
    this.jobListChanged.next(this.getJobs());
  }
  
  /**
   * @description Getter for currently selected job
   * @returns {JobData} Returns the selected job
   */
  public getSelectedJob(): JobData {
    return this.getJobs()[ this.selectedJobIndex ]; // use .getJobs so we return in line with the standard for how we want the jobs to be accessed. Meaning, for example, we return a copy of the array so this will ensure a copy is passed instead of the actual object.
  }

  /**
   * @description Getter for selected job index
   * @returns {number} Returns the index of the selected job
   */
  public getSelectedIndex(): number {
    return this.selectedJobIndex;
  }

  /**
   * @description Returns the loadingChanged Subject as an Observable. 
   * @returns {Observable<JobData[]>} - The jobListChanged Subject as an Observable 
   */
  public getJobListChanged(): Observable<JobData[]> {
    return this.jobListChanged.asObservable();
  }

  /**
   * @description Setter for setting the index of the selected job.
   * @param {number} index The index of the selected job
   */
  public setSelectedJob(index: number): void {
    this.selectedJobIndex = index;
  }
}
