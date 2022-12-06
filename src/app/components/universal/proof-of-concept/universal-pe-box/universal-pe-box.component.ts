import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-universal-pe-box',
  templateUrl: './universal-pe-box.component.html',
  styleUrls: ['./universal-pe-box.component.scss']
})
export class UniversalPeBoxComponent implements OnInit {

  public rays: number[]; // For storing the angles for each ray div
  private rayCount = 9; // The total number of rays
  private rotationStartingOffset = -3; // An offset to tweak the starting angle the ray div group

  constructor() { }

  ngOnInit(): void {
    // Populate the rays array with angles for each ray div in the ngFor
    for(let i = 0; i < this.rayCount; i++) {
      this.rays.push(Math.round(i * (90/this.rayCount)) + this.rotationStartingOffset );
    }
  }
}
