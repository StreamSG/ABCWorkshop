import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-flow-co',
  standalone: true,
  template: `
  <div class="co-float-right text-center">
  <h2>CO Tech</h2>
  <p>Status: {{ task }}</p>
  <button class="btn btn-info m-2">{{task === "Checking sync!" ? "sync" : "no sync"}}</button>
  <button class="btn btn-info">{{task === "Checking sync!" ? "sync" : "good sync"}}</button>`,
  styleUrls: ['./flow-co.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlowCoComponent {
  @Input() task: string | undefined;
}
