import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-flow-co',
  standalone: true,
  template: `
  <h2 class="right">CO Tech</h2>
  <p  class="p-right">Status: {{ task }}</p>`,
  styleUrls: ['./flow-co.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlowCoComponent {
  @Input() task: string | undefined;
}
