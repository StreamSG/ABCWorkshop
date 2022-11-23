import { ChangeDetectionStrategy, Component, Input, OnChanges,SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-flow-wt',
  template: `
  <div class="left text-center">
    <h2>Wire Tech</h2>
    <p>Status: {{ task }}</p>
    <button class="btn btn-info">Another Request</button>
  </div>`,
  styleUrls: ['./flow-wt.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class FlowWtComponent implements OnChanges {
  ngOnChanges(changes: SimpleChanges): void {
    console.log('flow updated!');
  }
@Input() task: string | undefined;
}
