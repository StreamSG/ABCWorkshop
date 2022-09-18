import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-office-info',
  templateUrl: './office-info.component.html',
  styleUrls: ['./office-info.component.scss']
})
export class OfficeInfoComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  openTouch() {
    console.log("touch-n-go initiated")

  }
}
