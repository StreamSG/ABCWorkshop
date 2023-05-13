import { Component, OnInit } from '@angular/core';

import { JobData } from 'src/app/models/jobs-response.model';
import { JobService } from 'src/app/services/job.service';

@Component({
  selector: 'app-job-subview',
  templateUrl: './job-subview.component.html',
  styleUrls: ['./job-subview.component.scss']
})
export class JobSubviewComponent implements OnInit {
  public job: JobData;
  public voipBody: string;
  public equipment: EquipmentDisplayData[];
  
  constructor(private jobService: JobService) { }

  ngOnInit(): void {
    this.job = this.jobService.getSelectedJob();
    if (this.job && this.job.services && this.job.services.voipNumbers && this.job.services.voipNumbers.length > 0) {
      this.voipBody = `Phone number${this.job.services.voipNumbers.length > 1 ? 's' : ''}: `;
      for (let number of this.job.services.voipNumbers) {
        this.voipBody += `${number}, `;
      }
      this.voipBody = this.voipBody.substring(0,this.voipBody.length-2) // remove any trailing 
    }

    if (this.job && this.job.services.equipment) {
      this.equipment = [];
      for (let equipmentItem of this.job.services.equipment) {
        this.equipment.push(this.generateEquipmentDataObject(equipmentItem));
      }
    }
  }

  private generateEquipmentDataObject(equipment: string): EquipmentDisplayData {
    if (equipment.match(/jack/i)) { // If it's a jack
      return {
        src: `assets/${equipment.match(/010/) || equipment.match(/slim/i) ? 'fjack' : 'abjack'}.png`,
        alt: 'jack',
        header: 'JACK',
        body: equipment
      };
    }
    else if (equipment.match(/ont/i)) {
      return {
        src: `assets/${equipment[0] === 'i' ? 'bgw320' : '010jack'}.png`,
        alt: 'ONT',
        header: 'ONT',
        body: 'ONT-1234LMNO',
        id: equipment,
      };
    }
    else if (equipment === '5268' || equipment.match(/^\d{3}$/)) { // if it's an RG
      return {
        src: `assets/bgw${equipment.match(/320/) ? '320' : '210'}.png`,
        alt: equipment,
        header: 'ROUTER/GATEWAY',
        body: equipment,
        id: `GUID: ...${Math.floor(Math.random()*10000)}`,
      };
    }
    else { // STB
      return {
        src: 'assets/stb.png',
        alt: equipment,
        header: 'SET TOP BOX',
        body: equipment,
        id: `GUID: ...${Math.floor(Math.random()*10000)}`,
      };
    }
  }
}

interface EquipmentDisplayData {
  src: string;
  alt: string;
  header: string;
  body: string;
  id?: string;
}