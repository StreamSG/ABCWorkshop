import { AfterViewInit, Component, OnInit } from '@angular/core';
import { WeTrackTicket } from 'src/app/models/we-track-ticket.model';
import { WeTrackService } from 'src/app/services/we-track.service';

@Component({
  selector: 'app-we-track',
  templateUrl: './we-track.component.html',
  styleUrls: ['./we-track.component.scss']
})
export class WeTrackComponent implements OnInit {

  constructor() {}

  ngOnInit(): void {
      
  }

}

// import { Component, OnDestroy, OnInit } from '@angular/core';
// import { Subject, takeUntil } from 'rxjs';
// import { WeTrackTicket } from 'src/app/models/we-track-ticket.model';
// import { WeTrackService } from 'src/app/services/we-track.service';

// @Component({
//   selector: 'app-we-track',
//   templateUrl: './we-track.component.html',
//   styleUrls: ['./we-track.component.scss']
// })
// export class WeTrackComponent implements OnInit, OnDestroy {
//   private ngUnsubscribe = new Subject();
//   public tickets: WeTrackTicket[] = [];

//   constructor(private weTrackService: WeTrackService) { }

//   ngOnInit(): void {
//     this.callAndSubscribeWeTrackTickets();
//   }

//   /**
//    * @description -
//    * @returns {void}
//    */
//   public callAndSubscribeWeTrackTickets(): void {
//     this.weTrackService.call();
//     this.weTrackService.getLoading().pipe(takeUntil(this.ngUnsubscribe)).subscribe((loading: boolean) => {
//       if (!loading) {
//         this.tickets = this.weTrackService.getResults();
//       }
//     });
//   }

//   ngOnDestroy(): void {
//     // this.ngUnsubscribe.next();
//     this.ngUnsubscribe.complete();
//   }
// }
