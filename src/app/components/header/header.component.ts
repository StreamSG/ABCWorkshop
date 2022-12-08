import { Component, OnInit } from '@angular/core';
import { WeatherAlert, WeatherService } from 'src/app/services/weather.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  public weatherAlerts: WeatherAlert[];

  constructor(private weatherService: WeatherService) { }

  ngOnInit(): void {

  }

}
