import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-universal-inline-alert',
  templateUrl: './universal-inline-alert.component.html',
  styleUrls: ['./universal-inline-alert.component.scss']
})
export class UniversalInlineAlertComponent implements OnInit {
  @Input() heading: string;
  @Input() body: string;
  @Input() alertType: string; // Should be either warning, ??? or ???
  public alertIconStyle: {[key: string]: string};

  constructor() { }

  ngOnInit(): void {
    this.alertIconStyle = {
      'background-color': this.alertType === 'warning' ? 'red' : 'blue',
      'border-color': this.alertType === 'warning' ? 'darkred' : 'darkblue',
    };
  }

}
