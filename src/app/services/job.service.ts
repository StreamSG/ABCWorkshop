import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { JobData } from '../models/job-data.model';

@Injectable({
  providedIn: 'root'
})
export class JobService {
  // TODO - Pick locations that will have alerts prior to meeting!
  private jobs: JobData[] = [new JobData(), new JobData(), new JobData(), new JobData(), new JobData()];
  //   new JobData(41.4993, -81.6944, 'Install', 'Cleveland, OH'),
  //   new JobData(44.0805, -103.2310, 'Repair', 'Rapid City, SD'),
  //   new JobData(48.4779, -120.1862, 'Repair', 'Winthrop, WA'),
  //   new JobData(30.2672, -97.7431, 'Helper', 'Austin, TX'),
  //   new JobData(26.1224, -80.1373, 'BSW', 'Fort Something, FL'),
  //   new JobData(34.0195, -118.4912, 'POTS', 'Santa Monica, CA')
  // ]; 
  private jobListChanged: BehaviorSubject<JobData[]> = new BehaviorSubject<JobData[]>(this.jobs);
  private selectedJobIndex: number = 0;

  constructor() { }

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
