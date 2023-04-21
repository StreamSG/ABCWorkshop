import { Component, OnInit } from '@angular/core';
import { ApiLoadingService } from 'src/app/services/api-loading.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  public menuLinks: MenuLink[] = [
    { text: 'Home', routerLink: '' },
    { text: 'Alerts', routerLink: 'weather' },
    { text: 'Help', routerLink: 'help' },
    { text: 'Map', routerLink: '' },
    { text: 'Prior Tickets', routerLink: '' },
    { text: 'Tools', routerLink: '' },
    { hr: true },
    { text: 'Time sheet', routerLink: '' },
    { text: 'System Health', routerLink: '', imgPath: 'assets/idkweather.png' },
    { text: 'News', routerLink: '' },
    { text: 'Safety', routerLink: '' },
    { text: 'Profile', routerLink: '' },
    { text: 'Mini-projects', dropdown: [
      { text: 'weTrack', routerLink: 'we-track' },
      { hr: true },
      { text: 'Touch \'n\' Go', routerLink: 'touch-n-go' },
      { text: 'Ticket Generator', routerLink: 'ticket-generator' },
      { text: 'QC Timer', routerLink: 'qc-timer' },
    ]},
  ];

  public spinIcon: boolean = false; // we aren't calling anything right away!
  
  // TODO - everything relating to ApiLoadingService is implemented in a temporary way!! Gross code, beware!
  constructor(private apiLoadingService: ApiLoadingService) { }

  ngOnInit(): void {
    this.apiLoadingService.getAllLoading().subscribe({
      next: () => {
        this.spinIcon = this.apiLoadingService.getNumberOfLoadingApis() > 0;
      }
    })
  }
}

export interface MenuLink {
  text?: string,
  routerLink?: string,
  imgPath?: string,
  hr?: boolean,
  dropdown?: MenuLink[],
}
