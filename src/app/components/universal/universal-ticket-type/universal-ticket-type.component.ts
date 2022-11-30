import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

import { WeTrackTicket } from 'src/app/models/we-track-ticket.model';

@Component({
  selector: 'app-universal-ticket-type',
  templateUrl: './universal-ticket-type.component.html',
  styleUrls: ['./universal-ticket-type.component.scss']
})
export class UniversalTicketTypeComponent implements OnInit, AfterViewInit {
  @Input() ticketType: string; // Receive the type of ticket from parent
  @ViewChild('ticketTypeContainer') ticketTypeElement: ElementRef; // Grab the main html element so the html entity code can be inserted. String interpolation with {{ }} will not work.
  private typeSymbol: string; // The chosen symbol based on the ticketType input

  public static readonly ticketTypeSymbols = { // Each of the symbols based on the given ticket type
    FEATURE: '&And;',
    ISSUE: '&xotime;',
    IDEA: '&odot;',
    UNKNOWN: '?'
  }

  constructor() { }

  ngOnInit(): void {
    this.typeSymbol = this.ticketType ? ( // Match each ticket type to the list of symbols in ticketTypeSymbols
      this.ticketType === WeTrackTicket.STATIC_DATA.TYPE.FEATURE ? UniversalTicketTypeComponent.ticketTypeSymbols.FEATURE :
      this.ticketType === WeTrackTicket.STATIC_DATA.TYPE.ISSUE ? UniversalTicketTypeComponent.ticketTypeSymbols.ISSUE :
      this.ticketType === WeTrackTicket.STATIC_DATA.TYPE.IDEA ? UniversalTicketTypeComponent.ticketTypeSymbols.IDEA : 
      UniversalTicketTypeComponent.ticketTypeSymbols.UNKNOWN
    ) : UniversalTicketTypeComponent.ticketTypeSymbols.UNKNOWN; // If ticketType isn't truthy, default to unknown symbol
  }
    
  ngAfterViewInit(): void { // After the view is rendered, insert the html entity code into the DOM
    this.ticketTypeElement.nativeElement.innerHTML = this.typeSymbol;
  }

}
