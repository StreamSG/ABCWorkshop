import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';

import { FlowWtComponent } from './t-n-gFlows/flow-wt/flow-wt.component';
import { FlowCoComponent } from './t-n-gFlows/flow-co/flow-co.component';

const flowState = [
  {
    component: () =>
      import('./t-n-gFlows/flow-wt/flow-wt.component').then(
        (it) => it.FlowWtComponent
      ),
    inputs: {
      value: 'Checking Sync',
    },
  },
  {
    component: () =>
      import('./t-n-gFlows/flow-co/flow-co.component').then(
        (it) => it.FlowCoComponent
      ),
    inputs: {
        value: 'Sync check requested!'
      },
  },
]



@Component({
  selector: 'app-touch-n-go',
  templateUrl: './touch-n-go.component.html',
  styleUrls: ['./touch-n-go.component.scss']
})

export class TouchNGoComponent {
  @ViewChild('display', { read: ViewContainerRef })
  display!: ViewContainerRef;

  createComponentsBasedOnConfig() {
    flowState.forEach(async (flowState) => {
      const componentFlow = await flowState.component();
      const componentRef = this.display.createComponent(componentFlow);

      Object.entries(flowState.inputs).forEach(([key, value]) => {
        componentRef.setInput(key, value);
      });
    });
  }

  createComponent() {
    this.display.clear();
    const flowWtRef = this.display.createComponent(FlowWtComponent);
    flowWtRef.setInput('task', 'standing by!');

    const flowCoRef = this.display.createComponent(FlowCoComponent)
    flowCoRef.setInput('task', 'awaiting info!');
  }

  constructor() { }

  ngOnInit(): void {
  }

  checkSync() {
    console.log('checking sync!');
    const flowWtRef = this.display.createComponent(FlowWtComponent);
    flowWtRef.setInput('task', 'Checking sync!');
    const flowCoRef = this.display.createComponent(FlowCoComponent)
    flowCoRef.setInput('task', 'Sync check requested!');
  };
  checkTone() {
    console.log('checking tone!');
    const flowWtRef = this.display.createComponent(FlowWtComponent);
    flowWtRef.setInput('task', 'Requested tone!');
    const flowCoRef = this.display.createComponent(FlowCoComponent)
    flowCoRef.setInput('task', 'Tone requested!');
  }

  checkShort() {
    console.log('checking short!');
    const flowWtRef = this.display.createComponent(FlowWtComponent);
    flowWtRef.setInput('task', 'Requested short!');
    const flowCoRef = this.display.createComponent(FlowCoComponent)
    flowCoRef.setInput('task', 'Short requested!');
  }
}