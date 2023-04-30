import { Component, OnInit } from '@angular/core';

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
    { text: 'System Health', routerLink: '', img: { path: 'assets/idkweather.png' } },
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
  
  constructor() { }

  ngOnInit(): void { }
}

export interface MenuLink {
  text?: string,
  routerLink?: string,
  img?: MenuImage
  hr?: boolean,
  dropdown?: MenuLink[],
  callback?: Function, // With this setup, HRs cannot have callbacks, but any other configuration can
}

export interface MenuImage {
  path: string,
  alt?: string,
  width?: string,
  height?: string,
}
