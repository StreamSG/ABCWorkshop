import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Comment } from 'src/app/models/we-track-ticket.model';

@Component({
  selector: 'app-we-track-comment',
  templateUrl: './we-track-comment.component.html',
  styleUrls: ['./we-track-comment.component.scss']
})
export class WeTrackCommentComponent implements OnInit {

  @Input() comment: Comment;
  @Output() deleteSelf = new EventEmitter<void>();
  public timeSinceComment: string = ' - ';

  constructor() { }

  ngOnInit(): void {
    const today = new Date();
    const then = typeof this.comment.date === 'string' ? new Date(this.comment.date) : this.comment.date;
    const daysBetween = (today.getTime() - then.getTime()) / (86400000); // ms in a day

    this.timeSinceComment += daysBetween < 1 ? 'Today' :
      daysBetween < 30 ? `${Math.floor(daysBetween)} day${daysBetween < 2 ? '' : 's'} ago` :
      daysBetween < 365 ? `${Math.floor(daysBetween/30)} month${Math.floor(daysBetween/30) < 2 ? '' : 's'} ago` :
      `${Math.floor(daysBetween/365*10)/10} year${Math.floor(daysBetween/365*10)/10 >= 1.1 ? 's' : ''} ago`;
  }

  public onDeleteComment(): void {
    this.deleteSelf.next();
  }

}
