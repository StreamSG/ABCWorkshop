import { Component } from '@angular/core';

@Component({
  selector: 'app-merged-objects',
  template: `
    <ul>
      <li *ngFor="let item of mergedItems">{{item}}</li>
    </ul>
  `,
})
export class ProfessorComponent {
  mergedItems: string[] = [];

  constructor() {
    const yourInfoObj = { name: "your name", age: "your age", email: "your email", hobby: "" };
    const topFiveMovieObj = { movieOne: "", movieTwo: "second", movieThree: "three", movieFour: "four", movieFive: "five" };

    const mergedObj = { ...yourInfoObj, ...topFiveMovieObj };
    this.mergedItems = Object.values(mergedObj).filter(item => item !== "");
  }
}
