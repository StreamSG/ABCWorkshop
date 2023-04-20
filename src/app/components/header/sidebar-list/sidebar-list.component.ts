import { Component, Input, OnInit } from '@angular/core';

import { MenuLink } from '../header.component';

@Component({
  selector: 'app-sidebar-list',
  templateUrl: './sidebar-list.component.html',
  styleUrls: ['./sidebar-list.component.scss']
})
export class SidebarListComponent implements OnInit {
  @Input() menuLink: MenuLink;

  constructor() { }

  ngOnInit(): void { }
}
