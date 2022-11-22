import { Component, OnInit } from '@angular/core';
import { Router, Routes } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  public navRoutes: Routes = [];

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.navRoutes = this.router.config;
  }

}
