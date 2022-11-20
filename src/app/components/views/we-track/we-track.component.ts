import { AfterViewInit, Component, OnInit } from '@angular/core';
import { WeTrackTicket } from 'src/app/models/we-track-ticket.model';
import { WeTrackService } from 'src/app/services/we-track.service';

@Component({
  selector: 'app-we-track',
  templateUrl: './we-track.component.html',
  styleUrls: ['./we-track.component.scss']
})
export class WeTrackComponent implements OnInit {

  public tickets: WeTrackTicket[] = [];

  constructor(private weTrackService: WeTrackService) { }

  ngOnInit(): void {
    // this.onRefreshTickets();
  }
  
  // ngAfterViewInit(): void {
  // }

  public onRefreshTickets(): void {
    this.weTrackService.loadTickets()
      .then((tickets) => {this.tickets = tickets;})
      .catch((err) => console.error(err));
  }

  public onGenTicket(): void {
    // temporary way to add new tickets
    let tempTicket = new WeTrackTicket(
      ['Add a nice feature', 'Make this thing work', 'Do something cool', 'Work together :)', 'Reach for the stars', 'Achieve your dreams'][Math.floor(Math.random()*6)],
      ['issue','feature'][Math.round(Math.random())],
      'Blah blah blah this is a description',
      ['low','medium','high','urgent'][Math.floor(Math.random()*4)],
      ['Micah', 'Aaron', 'Kerry', 'Raul', 'Someone else', 'Another person'][Math.floor(Math.random()*6)],
    );
    tempTicket.status = ['pending', 'in-progress', 'complete', 'cancelled', 'assigned'][Math.floor(Math.random()*5)];
    this.weTrackService.addNewTicket(tempTicket)
      .then((tickets) => { this.tickets = tickets; })
      .catch((err) => { console.error(err); });
  }

  public onDeleteTicket(): void {
    this.deleteTicket(0);
  }

  public deleteTicket(index: number) {
    this.weTrackService.deleteTicket(index)
      .then((tickets) => { this.tickets = tickets });
  }

}
