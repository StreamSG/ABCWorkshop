import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tests-subview',
  templateUrl: './tests-subview.component.html',
  styleUrls: ['./tests-subview.component.scss']
})
export class TestsSubviewComponent implements OnInit {
  public readonly tests1: string[] = ['7330 Historical Trending', 'LPA', 'NID Check', 'Quality Check', 'SELT Check', 'SHM TECH', 'Speed Test', 'TIME PATTERN ANALYSIS']
  public readonly tests2: string[] = ['AB JACK Test', 'BBNMS Audit Tool', 'Bonding Test Tool', 'CPE Real Time', 'Gateway Check', 'Neighborhood Check', 'Troubleshoot Cx Registration', 'Troubleshoot Sync-No-Service'];

  constructor() { }

  ngOnInit(): void {
  }

}
