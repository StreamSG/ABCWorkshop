import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  public menuItems: MenuItem[] = [
    { text: 'Home', routerLink: '' },
    { text: 'Alerts', routerLink: 'weather' },
    { text: 'Help', routerLink: 'help' },
    { text: 'Map', routerLink: '', disabled: true },
    { text: 'Prior Tickets', routerLink: '', disabled: true },
    { text: 'Tools', routerLink: '', disabled: true },
    { isHr: true },
    { text: 'Time sheet', routerLink: '', disabled: true },
    { text: 'System Health', routerLink: '', img: { path: 'assets/idkweather.png' }, disabled: true },
    { text: 'News', routerLink: '', disabled: true },
    { text: 'Safety', routerLink: '', disabled: true },
    { text: 'Profile', routerLink: '', disabled: true },
    { text: 'Mini-projects', dropdown: [
      { text: 'weTrack', routerLink: 'we-track' },
      { isHr: true },
      { text: 'Touch \'n\' Go', routerLink: 'touch-n-go', img: { path: 'assets/idkweather.png' } },
      { text: 'Ticket Generator', routerLink: 'ticket-generator' },
      { text: 'QC Timer', routerLink: 'qc-timer' },
    ]},
  ];
  
  constructor() { }

  ngOnInit(): void { }
}

export type MenuItem = {
  disabled?: boolean;
  text?: string;
  routerLink?: string;
  img?: {
    path: string;
    alt?: string;
    width?: string;
    height?: string;
  };
  dropdown?: MenuItem[];
  callback?: Function;
  /** * @property isHr should only be used by itself, as all other properties will be ignored when isHr is present */
  isHr?: true; 
}