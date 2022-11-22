import { Component, OnInit } from '@angular/core';

import { HelpService } from 'src/app/services/help/help-service.service';
import { LearningPaths } from 'src/app/services/help/help.model';

@Component({
  selector: 'app-help-view',
  templateUrl: './help-view.component.html',
  styleUrls: ['./help-view.component.scss']
})
export class HelpViewComponent implements OnInit {
  public learningPaths: LearningPaths[];

  constructor(private helpService: HelpService) { }

  ngOnInit(): void {
    this.learningPaths = this.helpService.getLearningPaths();
  }

}
