import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-universal-nav-tab',
  templateUrl: './universal-nav-tab.component.html',
  styleUrls: ['./universal-nav-tab.component.scss']
})
export class UniversalNavTabComponent implements OnInit {
  @Input() tabIsActive: boolean;
  @Input() tabText: string;
  public styledTabText: string;

  constructor() { }

  ngOnInit(): void {
    this.stylizeTabText();
  }
  
  /**
   * @description Will capitalize the first letter of the tab text for display in the html. To be called once in ngOnInit()
   * @returns {void}
   */
  private stylizeTabText(): void {
    if (this.tabText) {
      let firstLetter = this.tabText.charAt(0);
      this.styledTabText = `${firstLetter.toUpperCase()}${this.tabText.substring(1)}`;
    }
  }

}
