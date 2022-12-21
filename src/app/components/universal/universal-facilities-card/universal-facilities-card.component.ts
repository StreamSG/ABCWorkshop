import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-universal-facilities-card',
  templateUrl: './universal-facilities-card.component.html',
  styleUrls: ['./universal-facilities-card.component.scss']
})
export class UniversalFacilitiesCardComponent implements OnInit {
  @Input() heading: string;
  @Input() address: string;
  @Input() data: {[key: string]: string};
  public isCardOpen: boolean = false; // closed by default

  constructor() { }

  ngOnInit(): void {
  }

}
