import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-h2',
  templateUrl: './h2.component.html',
  styleUrls: ['./h2.component.scss']
})
export class H2Component implements OnInit {
  @Input() headerText: string;
  @Input() subHeader: string;
  @Input() blackText: boolean;
  @Input() blueText: boolean;
  @Input() redText: boolean;
  @Input() textMuted: boolean;

  constructor() { }

  ngOnInit(): void {
  }

}
