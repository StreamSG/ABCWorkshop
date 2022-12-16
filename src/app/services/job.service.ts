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

  public getJobs(): JobData[] {
    return this.jobs.slice();
  }

  public getSelectedJob(): JobData {
    return this.getJobs()[ this.selectedJobIndex ];
  }

  public getSelectedIndex(): number {
    return this.selectedJobIndex;
  }

  public setSelectedJob(index: number): void {
    this.selectedJobIndex = index;
  }
}
