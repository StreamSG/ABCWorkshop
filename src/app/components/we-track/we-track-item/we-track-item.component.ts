import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { WeTrackTicket } from 'src/app/models/we-track-ticket.model';
import { WeTrackService } from 'src/app/services/we-track.service';

@Component({
  selector: 'app-we-track-item',
  templateUrl: './we-track-item.component.html',
  styleUrls: ['./we-track-item.component.scss']
})
export class WeTrackItemComponent implements OnInit {

  @Input() weTrackTicketIndex: number;
  @Input() weTrackTicket: WeTrackTicket;

  @Output() deleteThisTicket = new EventEmitter<void>();

  public isActive = false;
  public statusColor: string = '';
  public prettyCreationDate: string = '';

  public ellipsesStyleWrap = {
    'text-overflow': 'ellipsis',
    'overflow' : 'hidden',
    'white-space': 'nowrap',
  };

  constructor(private weTrackService: WeTrackService, private router: Router) { }

  ngOnInit(): void {
    this.statusColor = this.getStatusColor(this.weTrackTicket.status);
    let tempPrettyDate = new Date(this.weTrackTicket.creationDate).toISOString().slice(0,10);
    this.prettyCreationDate = tempPrettyDate.slice(5,10) + '-' + tempPrettyDate.slice(0,4);
  }

  public onActivateTicketItem(): void {
    this.isActive = !this.isActive;
  }

  public onDeleteTicket(): void {
    this.deleteThisTicket.next();
  }

  public onEditTicket(): void {
    this.weTrackService.selectedTicket = this.weTrackTicketIndex;
    this.router.navigate(['we-track','edit']);
  }

  private getStatusColor(status: string): string {
    switch(status) {
      case WeTrackTicket.STATUS.PENDING:
        return 'orange';
      case WeTrackTicket.STATUS.IN_PROGRESS:
        return 'yellow';
      case WeTrackTicket.STATUS.COMPLETE:
        return 'green';
      case WeTrackTicket.STATUS.ASSIGNED:
        return 'blue';
      case WeTrackTicket.STATUS.CANCELLED:
        return 'red';
      default:
        return 'yellow';
    }
  }

}
