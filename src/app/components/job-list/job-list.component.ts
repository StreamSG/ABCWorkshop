import { Component, OnInit } from '@angular/core';
import { JobData } from 'src/app/models/job-data.model';

@Component({
  selector: 'app-job-list',
  templateUrl: './job-list.component.html',
  styleUrls: ['./job-list.component.scss']
})
export class JobListComponent implements OnInit {

  // TODO - Pick locations that will have alerts prior to meeting!
  public readonly jobs: JobData[] = [
    new JobData(41.4993, -81.6944, 'Install', 'Cleveland, OH'),
    new JobData(44.0805, -103.2310, 'Repair', 'Rapid City, SD'),
    new JobData(30.2672, -97.7431, 'Helper', 'Austin, TX'),
    new JobData(26.1224, -80.1373, 'BSW', 'Fort Something, FL'),
    new JobData(34.0195, -118.4912, 'POTS', 'Santa Monica, CA')
  ]; 

  constructor() { }

  ngOnInit(): void {
  }

}
