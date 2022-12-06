import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-universal-dropdown-dots',
  templateUrl: './universal-dropdown-dots.component.html',
  styleUrls: ['./universal-dropdown-dots.component.scss']
})
export class UniversalDropdownDotsComponent implements OnInit {
  /**
   * @description Pass in an array of objects containing the dropdown text and callback function to be triggered when the dropdown list item is clicked.
   */
  @Input() dropdownContents: string[];
  @Output() optionClicked: EventEmitter<string> = new EventEmitter<string>();

  public expandDropdown: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }
  /**
   * @description When an option from dropdownContents is selected, will emit the string exactly as it appears in the array.
   * @param {string} option Selected option as passed from the ngFor
   */
  public onOptionClicked(option: string): void {
    this.optionClicked.next(option);
  }
}
