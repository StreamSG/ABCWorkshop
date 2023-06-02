import { Component, OnInit } from '@angular/core';
import { ApiLoadingService } from 'src/app/services/api-loading.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  // Sidebar menu items to be dynamically generated from the array below. See MenuItem documentation for implementation help. Far future feature: convert to class and add service file for more advanced control over sidebar elements (such as disabling and enabling at will).
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

/**
 * @description For use with the header sidebar menu. Allows the creation of an array of objects to generate the sidebar links
 */
export interface MenuItem {
  /** @property Greys out sidebar elements so they cannot be clicked */ 
  disabled?: boolean;
  /** @property The text to be displayed in the sidebar */
  text?: string;
  /** @property The path to route to when clicked */
  routerLink?: string;
  /** @property Image data for displaying at the end of the menu line item */
  img?: {
    /** @property Asset path for the image */
    path: string;
    /** @property Alt text for the image */
    alt?: string;
    /** @property Width of the image */
    width?: string;
    /** @property Height of the image */
    height?: string;
  };
  /** @property Allows for a dropdown menu of more MenuItems. Cannot be doubly nested. */
  dropdown?: MenuItem[];
  /** @property I found that the callback function is technically executed after the router loads the new page */
  callback?: Function;
  /** @property isHr should only be used by itself, as all other properties will be ignored when isHr is present */
  isHr?: true; 
}