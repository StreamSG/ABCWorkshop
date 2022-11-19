import { AfterViewInit, Component, OnInit } from '@angular/core';
import { WeTrackTicket } from 'src/app/models/we-track-ticket.model';
import { WeTrackService } from 'src/app/services/we-track.service';

@Component({
  selector: 'app-we-track',
  templateUrl: './we-track.component.html',
  styleUrls: ['./we-track.component.scss']
})
export class WeTrackComponent implements OnInit, AfterViewInit {

  public tickets: WeTrackTicket[] = [];

  constructor(private weTrackService: WeTrackService) { }

  ngOnInit(): void {
  }
  
  ngAfterViewInit(): void {
    this.onRefreshTickets();
  }

  public onRefreshTickets(): void {
    this.weTrackService.loadTickets()
      .then((tickets) => {this.tickets = tickets;})
      .catch((err) => console.error(err));
  }

  public onGenTicket(): void {
    // temporary way to add new tickets
    let tempTicket = new WeTrackTicket(
      ['Add a nice feature', 'Make this thing work', 'Do something cool', 'Work together :)', 'Reach for the stars', 'Achieve your dreams'][Math.floor(Math.random()*6)],
      'feature',
      'Blah blah blah this is a description',
      'eh',
      ['Micah', 'Aaron', 'Kerry', 'Raul', 'Someone else', 'Another person'][Math.floor(Math.random()*6)],
    );
    tempTicket.status = ['pending', 'in-progress', 'complete'][Math.floor(Math.random()*3)];
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
