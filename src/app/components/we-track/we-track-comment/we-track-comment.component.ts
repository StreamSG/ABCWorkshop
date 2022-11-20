import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-we-track-comment',
  templateUrl: './we-track-comment.component.html',
  styleUrls: ['./we-track-comment.component.scss']
})
export class WeTrackCommentComponent implements OnInit {

  @Input() comment: {name: string, comment: string};

  constructor() { }

  ngOnInit(): void {
  }

}
