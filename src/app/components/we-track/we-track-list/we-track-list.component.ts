import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { WeTrackTicket } from 'src/app/models/we-track-ticket.model';
import { WeTrackService } from 'src/app/services/we-track.service';

@Component({
  selector: 'app-we-track-list',
  templateUrl: './we-track-list.component.html',
  styleUrls: ['./we-track-list.component.scss']
})
export class WeTrackListComponent implements OnInit {
  public tickets: WeTrackTicket[] = [];

  constructor(private weTrackService: WeTrackService, private router: Router) { }

  ngOnInit(): void {
    this.onRefreshTickets(); // Initialize tickets from the database
  }
  
  /**
   * @description Create a request to the database for an updated list of tickets. When the promise resolves, sets this.tickets to the ticket response data
   * @returns {void}
   */
  public onRefreshTickets(): void {
    this.weTrackService.loadTickets()
      .then((tickets) => {this.tickets = tickets;})
      .catch((err) => console.error(err));
  }

  /**
   * @description Temporary method, allows for randomly generating a ticket for testing purposes.
   */
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

  /**
   * @description Deletes a specific ticket at the given index from the database. After promise resolves will update the local list from the returned array
   * @param {number} index The index of the ticket you'd like to delete
   * @returns {void}
   */
  public deleteTicket(index: number): void {
    this.weTrackService.deleteTicket(index)
      .then((tickets) => { this.tickets = tickets });
  }

  /**
   * @description Routes to the new ticket page
   * @returns {void}
   */
  public onNewTicket(): void {
    this.router.navigate(['we-track','new']);
  }
}
