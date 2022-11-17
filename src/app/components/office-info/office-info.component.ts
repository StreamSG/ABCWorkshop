import { Component, OnInit } from '@angular/core';
import { TouchNGoService } from 'src/app/shared/touch-n-go.service';

@Component({
  selector: 'app-office-info',
  templateUrl: './office-info.component.html',
  styleUrls: ['./office-info.component.scss']
})

export class OfficeInfoComponent implements OnInit {
  tngActive: boolean = false;

  constructor(private tngService: TouchNGoService) {}

  ngOnInit(): void {
  }

  openTouch() {
    this.tngService.tngShow();
    console.log("touch-n-go initiated");
    this.tngActive = true;
  }
}
