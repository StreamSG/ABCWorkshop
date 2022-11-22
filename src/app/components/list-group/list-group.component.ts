import { Component, Input, OnInit, Type } from '@angular/core';

import { LearningPaths } from '../../services/help/help.model';


@Component({
  selector: 'app-list-group',
  templateUrl: './list-group.component.html',
  styleUrls: ['./list-group.component.scss']
})
export class ListGroupComponent implements OnInit {
  @Input() listData: any; // generic list data
  @Input() learningPaths: LearningPaths[]; // sets the list type to output learning path links

  constructor() { }

  ngOnInit(): void {
  }

}
