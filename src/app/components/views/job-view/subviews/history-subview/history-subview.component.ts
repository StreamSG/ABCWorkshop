import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-history-subview',
  templateUrl: './history-subview.component.html',
  styleUrls: ['./history-subview.component.scss']
})
export class HistorySubviewComponent implements OnInit {
  public historyData: {heading: string, date: string, subData: {[key: string]: string} }[] = [
    {
      heading: 'Interaction', date: '12/11/22',
      subData: {
        'Title': 'Interaction Account Activity - CSS',
        'Interaction Notes': 'Postal letter sent for account to cx address.',
      }
    },
    {
      heading: 'Dispatch', date: '11/27/22',
      subData: {
        'Status': 'COMPLETE',
        'Product Type': 'UMC',
        'Tech Notes': 'tr382v; did an install or something, idk i don\'t even work here.',
      }
    },
    {
      heading: 'Case', date: '08/01/22',
      subData: {
        'Case Creation Time': '08/01/22, 9:49 AM',
        'Case Status': 'Closed',
        'Notes': 'Cx just calling to say they are very happy with their service, and they have elected to pay more voluntarily to show their appreciation.'
      }
    },

  ];
  constructor() { }

  ngOnInit(): void {
  }

}
