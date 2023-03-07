import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-universal-facilities-card',
  templateUrl: './universal-facilities-card.component.html',
  styleUrls: ['./universal-facilities-card.component.scss']
})
export class UniversalFacilitiesCardComponent implements OnInit {
  @Input() facility: Facility;
  @Input() transportType: string;
  @Input() facilityIndex: number;

  public isCardOpen: boolean = false; // closed by default
  public isFiber: boolean;

  constructor() { }

  ngOnInit(): void {
    this.isFiber = this.transportType && this.transportType.substring(0,4) === 'FTTP';
  }

}

interface Facility {
  heading: string,
  address: string,
  cable?: number,
  pair?: number,
  port?: number,
}