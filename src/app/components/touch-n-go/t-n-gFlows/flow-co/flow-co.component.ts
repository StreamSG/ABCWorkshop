import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-flow-co',
  standalone: true,
  template: `
  <h2>CO Tech</h2>
  Status: {{ task }}`,
  styleUrls: ['./flow-co.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlowCoComponent {
  @Input() task: string | undefined;
}
