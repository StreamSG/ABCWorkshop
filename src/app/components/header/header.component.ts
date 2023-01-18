import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

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
  ]

  public activeRoute: string = 'home';

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.activeRoute = this.router.url.substring(1);
  }

}

interface MenuLink {
  text?: string,
  routerLink?: string,
  imgPath?: string,
  hr?: boolean,
  dropdown?: MenuLink[],
}
