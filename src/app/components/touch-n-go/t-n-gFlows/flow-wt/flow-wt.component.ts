import { ChangeDetectionStrategy, Component, Input, OnChanges,SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-flow-wt',
  template: `
  <div class="co-float-left text-center">
    <h2>Wire Tech</h2>
    <p>Status: {{ task }}</p>
    <button class="btn btn-info"
    (click)="onAnotherReq()">Another Request</button>
  </div>`,
  styleUrls: ['./flow-wt.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class FlowWtComponent implements OnChanges {
  @Input() task: string | undefined; // Moved to top. Not included in anything? -Micah
  public showTechDisplay: boolean = false; // I believe this is hypothetical data for sending between the co tech and the field tech. -Micah

  /**
   * @description When the tech clicks the button, sets the boolean to true, simulating sending data to the CO tech. doesn't actually do anything.
   * @returns {void}
   */
  public onAnotherReq(): void {
    this.showTechDisplay = true;
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('flow updated!');
  }
}
