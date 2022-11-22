import { Injectable } from '@angular/core';
import { LearningPaths } from './help.model';

@Injectable({
  providedIn: 'root'
})
export class HelpService {
  private learningPaths: LearningPaths[] = [ // move to db
    {codeLanguage: 'HTML5', tutorialLinks: [
      {urlName: 'MDN Documentation', url: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element'},
      {urlName: 'Cheat Sheet', url: 'https://digital.com/tools/html-cheatsheet/'}
    ]},
    {codeLanguage: 'CSS3', tutorialLinks: [
      {urlName: 'MDN Documentation', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/Reference'},
      {urlName: 'CSS Tricks Almanac', url: 'https://css-tricks.com/almanac/'}
    ]},
    {codeLanguage: 'JavaScript', tutorialLinks: [{urlName: 'Modern JavaScript from the Beginning (Udemy)', url: 'https://www.udemy.com/course/modern-javascript-from-the-beginning/'}]},
    {codeLanguage: 'Angular', tutorialLinks: [{urlName: 'Angular - The Complete Guide (Udemy)', url: 'https://www.udemy.com/course/the-complete-guide-to-angular-2/'}]},
    // {codeLanguage: 'NestJS', tutorialLinks: [{urlName: 'NestJS: The Complete Developers Guide', url: 'https://www.udemy.com/course/nestjs-the-complete-developers-guide/'}]}
  ];

  constructor() { }

  /**
   * @description - getter method that returns an array of typed learning paths for help view
   * @returns {LearningPaths[]} - returns array of learning paths for consumption in help view
   */
  public getLearningPaths(): LearningPaths[] {
    return this.learningPaths;
  }

  /**
   * @description - setter method to add new learning path to the existing paths - this method should only be able to be used by an admin of types
   * @param {LearningPaths} newLearningPath - new learning path to be added to existing array
   */
  public setNewLearningPath(newLearningPath: LearningPaths): void {
    // @micah - this and the already existing learning paths could have integration into your db
    this.learningPaths.push(newLearningPath);
  }
}
