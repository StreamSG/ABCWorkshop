import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-qc-timer',
  templateUrl: './qc-timer.component.html',
  styleUrls: ['./qc-timer.component.scss']
})
export class QcTimerComponent implements OnInit {

  public timerLength = 60;
  public countdownTimer = ''+this.timerLength;

  constructor() { }

  ngOnInit(): void {

    const startTime = new Date().getTime();
    const endTime = startTime + this.timerLength*1000; // 60 seconds after

    let waitASec = () => {
      setTimeout(() => {
        const curTime = endTime - (new Date().getTime());

        if(curTime > 0) {
          this.countdownTimer = ''+Math.round(curTime/1000);
          waitASec();
        }
        else {
          this.countdownTimer = 'done';
        }
      }, 1000);
    };

    waitASec();
  }

}
