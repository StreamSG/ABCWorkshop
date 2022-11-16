import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { SeededBanDataGenerator, SeededPLEGenerator } from 'src/app/models/seeded-random-number.model';

@Component({
  selector: 'app-ticket-generator',
  templateUrl: './ticket-generator.component.html',
  styleUrls: ['./ticket-generator.component.scss']
})
export class TicketGeneratorComponent implements OnInit {

  public banForm!: FormGroup;
  public seededBan!: SeededBanDataGenerator;
  public customerData!: {
    address: string,
    phone: string,
    circuitID: string,
  };

  public trainingForm!: FormGroup;
  public seededTraining!: SeededPLEGenerator;
  public trainingNumber!: number;
  public trainingDue!: string[];

  constructor() {}
  
  ngOnInit(): void {
    this.banForm = new FormGroup({
      'ban': new FormControl(null, [Validators.required, Validators.minLength(9), Validators.maxLength(9), Validators.pattern(/^[0-9]+$/gm)]),
    });

    this.trainingForm = new FormGroup({
      'uuid': new FormControl(null, [Validators.required, Validators.minLength(6), Validators.maxLength(6), Validators.pattern(/[a-z]+[a-z]+[0-9]+[0-9]+[0-9]+[a-z0-9]/g)]),
    })
  }

  onRandomBan() {
    this.banForm.patchValue({
      'ban': Math.floor(Math.random()*224000000)+100000000
    });
  }

  onBanFormSubmit() {
    const banData = this.banForm?.get('ban')?.value;
    if(banData && this.banForm.valid) {
      this.seededBan = new SeededBanDataGenerator(+banData);
      this.customerData = {
        address: this.seededBan.getAddress(),
        phone: this.seededBan.getPhoneNumber(),
        circuitID: this.seededBan.getCircuitID(),
      }
    }
  }

  onRandomUUID() {
    let genID = '';
    genID += String.fromCharCode(Math.floor(Math.random()*26)+97);
    genID += String.fromCharCode(Math.floor(Math.random()*26)+97);
    genID += Math.floor(Math.random()*10);
    genID += Math.floor(Math.random()*10);
    genID += Math.floor(Math.random()*10);

    const lastChar = Math.floor(Math.random()*36)+97;
    genID += lastChar > 122 ? lastChar-122 : String.fromCharCode(lastChar);

    this.trainingForm.patchValue({
      'uuid': genID,
    });
  }

  onTrainingFormSubmit() {
    const uuidData = this.trainingForm?.get('uuid')?.value;
    if(uuidData && this.trainingForm.valid) {
      this.seededTraining = new SeededPLEGenerator(uuidData);
      this.trainingNumber = this.seededTraining.getTrainingCount();
      this.trainingDue = this.seededTraining.getTrainingDue();
    }
  }
}
