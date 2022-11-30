import { Component, OnInit } from '@angular/core';
import { TouchNGoService } from 'src/app/shared/touch-n-go.service';

@Component({
  selector: 'app-office-info',
  templateUrl: './office-info.component.html',
  styleUrls: ['./office-info.component.scss']
})

export class OfficeInfoComponent implements OnInit {
  tngActive: boolean = false;

  public officeInfo: any = [
    {wirecenterNumber: '456123',
    wirecenterName: 'Capitol',
    wirecenterAddress: '1234 Some Rd.',
    wirecenterMapLink: '/office-info',
    wirecenterTelephoneNumber: '123-456-7890',
    wirecenterTelephoneNumberLink: 'tel:1234567890',
    wirecenterTechOnDutyFirstName: 'Mary',
    wirecenterTechOnDutyLastName: 'Smith',
    wirecenterTechOnDutyCellphoneNumber: '890-567-1234',
    wirecenterTechOnDutyCellphoneNumberLink: 'tel:8905671234',
  }];

  constructor(private tngService: TouchNGoService) {}

  ngOnInit(): void {
  }

  openTouch() {
    this.tngService.tngShow();
    console.log("touch-n-go initiated");
    this.tngActive = true;
  }
}
