import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { Comment } from 'src/app/models/we-track-ticket.model';

@Component({
  selector: 'app-we-track-comment',
  templateUrl: './we-track-comment.component.html',
  styleUrls: ['./we-track-comment.component.scss']
})
export class WeTrackCommentComponent implements OnInit {
  @Input() comment: Comment; // Comment data passed down from we-track-item component
  @Output() deleteSelf: EventEmitter<void> = new EventEmitter<void>(); // Emits to we-track-item to delete this comment
  
  public timeSinceComment: string = ' - '; // Stylized time to display since the comment was posted
  public readonly staticCommentDropdownOptions: {DELETE: string}= {
    DELETE: 'Delete'
  }
  public commentDropdownOptions: string[] = [this.staticCommentDropdownOptions.DELETE];

  constructor() { }

  ngOnInit(): void {
    // Calculate time since comment was posted, and display as fancy text
    const startDate: Date = this.comment && this.comment.date ? 
      typeof this.comment.date === 'string' ? new Date(this.comment.date) : this.comment.date : // Ensure comment.date is of the correct type
      new Date(); // default to today if comment or comment.date doesn't exist
    this.timeSinceComment += this.createFancyTimeBetween(typeof this.comment.date === 'string' ? new Date(this.comment.date) : this.comment.date);
  }

  /**
   * @description When the user selects an option from the comment list, compares to the static list of options, and executes code based off of that option. Currently only deletes.
   */
  public onCommentOptionClicked(optionClicked: string): void {
    switch(optionClicked) { // Look for a matching option from the static list staticCommentDropdownOptions.
      case this.staticCommentDropdownOptions.DELETE:
        this.deleteSelf.next();
        break;
      default:
        console.error('Error parsing dropdown option selection: ' + optionClicked);
        break;
    }
  }

  // Could this method be moved into a service file or a model? Don't see anywhere obvious -Micah
  /**
   * @description Calculates the time between two dates, and returns that time as a string to be displayed in the UI. If the time is less than a day, shows up as "Today", otherwise shows as N days/months/years, as is relevant.
   * @param {Date} startDate The start of the date range
   * @param {Date} endDate (optional) The end of the date range, defaults to current time.
   * @returns {string} The stylized time between the dates is given as a string.
   */
  private createFancyTimeBetween(startDate: Date, endDate: Date = new Date()): string {
    const daysBetween: number = (endDate.getTime() - startDate.getTime()) / (86400000); // ms in a day

    return daysBetween < 1 ? 'Today' : // Less than a day
      daysBetween < 30 ? `${Math.floor(daysBetween)} day${daysBetween < 2 ? '' : 's'} ago` : // Less than a month
      daysBetween < 365 ? `${Math.floor(daysBetween/30)} month${Math.floor(daysBetween/30) < 2 ? '' : 's'} ago` : // Less than a year
      `${Math.floor(daysBetween/365*10)/10} year${Math.floor(daysBetween/365*10)/10 >= 1.1 ? 's' : ''} ago`; // Greater than a year
  }
}