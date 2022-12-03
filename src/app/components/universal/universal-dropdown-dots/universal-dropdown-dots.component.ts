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
  @Output() optionClicked = new EventEmitter<string>();

  public expandDropdown = false;

  constructor() { }

  ngOnInit(): void {
  }

  public onOptionClicked(option: string): void {
    this.optionClicked.next(option);
  }

  public stopPropagation(event: Event): void {
    event.stopPropagation();
  }
}
