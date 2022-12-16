import { Injectable } from '@angular/core';
import { JobData } from '../models/job-data.model';

@Injectable({
  providedIn: 'root'
})
export class JobService {
  // TODO - Pick locations that will have alerts prior to meeting!
  private jobs: JobData[] = [
    new JobData(41.4993, -81.6944, 'Install', 'Cleveland, OH'),
    new JobData(44.0805, -103.2310, 'Repair', 'Rapid City, SD'),
    new JobData(30.2672, -97.7431, 'Helper', 'Austin, TX'),
    new JobData(26.1224, -80.1373, 'BSW', 'Fort Something, FL'),
    new JobData(34.0195, -118.4912, 'POTS', 'Santa Monica, CA')
  ]; 

  private selectedJobIndex: number;

  constructor() { }

  /**
   * @description Getter for master array of jobs
   * @returns {JobData[]} Returns a copy of the master array of jobs
   */
  public getJobs(): JobData[] {
    return this.jobs.slice();
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
   * @description Setter for setting the index of the selected job.
   * @param {number} index The index of the selected job
   */
  public setSelectedJob(index: number): void {
    this.selectedJobIndex = index;
  }
}
