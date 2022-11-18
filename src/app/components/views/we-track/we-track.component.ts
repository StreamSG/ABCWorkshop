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

  public onNewTicket(): void {
    // temporary way to add new tickets
    this.weTrackService.addNewTicket(
      new WeTrackTicket(
        'Title #' + (Math.floor(Math.random()*100)+1),
        'feature',
        'Blah blah blah this is a description',
        'eh',
        'Micah',
      ))
      .then((tickets) => { this.tickets = tickets; })
      .catch((err) => { console.error(err); });
  }

  public onDeleteTicket(): void {
    this.weTrackService.deleteTicket(0)
      .then((tickets) => { this.tickets = tickets });
  }

}
