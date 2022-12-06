import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-universal-dropdown-input-field',
  templateUrl: './universal-dropdown-input-field.component.html',
  styleUrls: ['./universal-dropdown-input-field.component.scss']
})
export class UniversalDropdownInputFieldComponent implements OnInit {
  @Input() labelTitle: string;
  @Input() dropdownOptions: string[];

  @Output() selectedOption: EventEmitter<string> = new EventEmitter<string>();

  public formValue: number = 0; // defaulted to first value

  constructor() { }

  ngOnInit(): void {
    // this.onValueChanged();
  }
  
  /**
   * @description Bound to (changed) event, will emit the selected value up to parent component.
   */
  public onValueChanged(): void {
    if(this.dropdownOptions && Array.isArray(this.dropdownOptions) && this.formValue && this.dropdownOptions[this.formValue]) {
      this.selectedOption.next(this.dropdownOptions[this.formValue]);
    }
    else {
      console.error('Error loading dropdownOptions and/or formValue');
    }
  }

}
