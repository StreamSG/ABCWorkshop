import { Injectable } from '@angular/core';
import { start } from '@popperjs/core';

@Injectable({
  providedIn: 'root'
})

export class TouchNGoService {
  tngActive: boolean = false;  

  constructor() {}

  tngShow() {
    console.log('Touch-N-Go started!');
  }
  tngHide() {
    console.log('Touch-N-Go stopped!');
  }
  
}
