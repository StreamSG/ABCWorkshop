import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SeededBanDataGenerator, SeededPLEGenerator } from 'src/app/models/seeded-random-number.model';

@Component({
  selector: 'app-ticket-generator',
  templateUrl: './ticket-generator.component.html',
  styleUrls: ['./ticket-generator.component.scss']
})
export class TicketGeneratorComponent implements OnInit {

  public banForm!: FormGroup; // The form for inputting a ban
  public seededBan!: SeededBanDataGenerator; // Allows ban data to be generated from a ban seed
  public customerData!: { // To store the generated data, so that it doesn't need to be recalculated each time it's bound in the dom
    address: string,
    phone: string,
    circuitID: string,
  };

  public trainingForm!: FormGroup; // The form for inputting a uuid
  public seededTraining!: SeededPLEGenerator; // Allows courses to be generated from a uuid seed
  public trainingNumber!: number; // Number of trainings due
  public trainingDue!: string[]; // Array of training titles

  constructor() {}
  
  public ngOnInit(): void {
    this.banForm = new FormGroup({
      'ban': new FormControl(null, [
        Validators.required, 
        Validators.minLength(15), 
        Validators.maxLength(15), 
        Validators.pattern(/^[0-9]+$/m) // Only allow numbers
      ]),
    });

    this.trainingForm = new FormGroup({
      'uuid': new FormControl(null, [
        Validators.required, 
        Validators.minLength(7), 
        Validators.maxLength(7), 
        Validators.pattern(/[a-z]+[a-z]+[0-9]+[0-9]+[0-9]+[a-z0-9]+[0-9]/) // only allow 2 letters, 3 numbers, and then a letter OR number, and then finally another number
      ]), 
    });
  }

  /**
   * @description For use to generate a random BAN when the Generate ban button is pressed
   * @returns {void}
   */
  public onRandomBan(): void {
    this.banForm.patchValue({
      'ban': ''+(Math.floor(Math.random()*2.99*Math.pow(10,14))+Math.pow(10,14)) // generate a random ban between 100-000-000-000-000 and 399-999-999-999-999
    });
  }

  /**
   * @description For use to generate address, phone, and circuit ID from the given ban inte the ban form field
   * @returns {void}
   */
  public onBanFormSubmit(): void {
    const banData = this.banForm?.get('ban')?.value;
    if(banData && this.banForm.valid) {
      this.seededBan = new SeededBanDataGenerator(+banData); // create seeded random number generator
      this.customerData = { // create and store address, phone, and circuit ID to be displayed in DOM
        address: this.seededBan.getAddress(), 
        phone: this.seededBan.getPhoneNumber(),
        circuitID: this.seededBan.getCircuitID(),
      }
    }
  }

  /**
   * @description For use to generate a random UUID when the Generate uuid button is pressed
   * @returns {void}
   */
  public onRandomUUID(): void {
    let genID = ''; // generate a random ban: 2 letters, 3 numbers, and a letter or number
    genID += String.fromCharCode(Math.floor(Math.random()*26)+97);
    genID += String.fromCharCode(Math.floor(Math.random()*26)+97);
    genID += Math.floor(Math.random()*10);
    genID += Math.floor(Math.random()*10);
    genID += Math.floor(Math.random()*10);

    const lastChar = Math.floor(Math.random()*36)+97;
    genID += lastChar > 122 ? lastChar-123 : String.fromCharCode(lastChar); // if the ascii code is past z, return the ascii code as a number (0-9). Otherwise convert ascii code to letter
    genID += Math.floor(Math.random()*10);

    this.trainingForm.patchValue({
      'uuid': genID,
    });
  }

  /**
   * @description For use to generate a list of trainings due based off of the given UUID in the uuid form
   * @returns {void}
   */
  public onTrainingFormSubmit(): void {
    const uuidData = this.trainingForm?.get('uuid')?.value;
    if(uuidData && this.trainingForm.valid) {
      this.seededTraining = new SeededPLEGenerator(uuidData);
      this.trainingNumber = this.seededTraining.getTrainingCount();
      this.trainingDue = this.seededTraining.getTrainingDue();
    }
  }
}
