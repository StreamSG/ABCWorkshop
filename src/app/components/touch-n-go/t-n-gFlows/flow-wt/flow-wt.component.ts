import { ChangeDetectionStrategy, Component, Input, OnChanges,SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-flow-wt',
  template: `<h2>Wire Tech</h2>
  Status: {{ task }}`,
  styleUrls: ['./flow-wt.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class FlowWtComponent implements OnChanges {
  ngOnChanges(changes: SimpleChanges): void {
    console.log('flow updated!');
  }
@Input() task: string | undefined;
}
