import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

export interface FullScreenModalOptions {
  dimBackground?: boolean,
  areYouSure?: {
    headerText: string,
    mainText: string,
  },
}

export interface FullScreenModalClosingPayload {
  closeType: string,
}

@Component({
  selector: 'app-universal-full-screen-modal',
  templateUrl: './universal-full-screen-modal.component.html',
  styleUrls: ['./universal-full-screen-modal.component.scss']
})
export class UniversalFullScreenModalComponent implements OnInit {
  @Input() showModal: boolean;
  @Input() modalOptions: FullScreenModalOptions;

  @Output() closeModal: EventEmitter<FullScreenModalClosingPayload> = new EventEmitter<FullScreenModalClosingPayload>();

  public modalType: string;

  readonly STATIC_DATA = {
    MODAL_TYPES: {
      ARE_YOU_SURE: 'are-you-sure',
    },
    CLOSING_TYPES: {
      CANCEL: 'cancel',
    },
  }

  constructor() { }

  ngOnInit(): void {
    if(this.modalOptions) {
      if(this.modalOptions.areYouSure) {
        this.modalType = this.STATIC_DATA.MODAL_TYPES.ARE_YOU_SURE;
      }
    }
  }

  public onCloseModal(closingPayload: FullScreenModalClosingPayload): void {
    this.closeModal.next(closingPayload);
  }

  public stopPropagation(event: Event): void {
    event.stopPropagation();
  }
}
