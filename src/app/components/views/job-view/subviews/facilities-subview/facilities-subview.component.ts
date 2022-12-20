import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-facilities-subview',
  templateUrl: './facilities-subview.component.html',
  styleUrls: ['./facilities-subview.component.scss']
})
export class FacilitiesSubviewComponent implements OnInit {
  public splData: {[key: string]: string} = {
    '1Splitter': '8',
    '2Network Port': '07',
    '3Cable': 'AMKR1234PA LMAFPT123',
    '4Strand': '123',
    '5Network Port ': 'NPN-231',
    '6Access Port': 'APN-490',
  };
  public cfstData: {[key: string]: string} = {
    '1Cable': 'PON112233 LMNOQRS',
    '2Strand': '290',
    '3Network Port': 'NPN-04',
    '4Access Port': 'APN-04'
  };
  public premData: {[key: string]: string} = {
    '1ONT': '1-2-3-2-1',
    '2Network Port': 'Unavail',
  };

  constructor() { }

  ngOnInit(): void {
  }

}
