import { HttpClient } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { ApiResponse, ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class TestService extends ApiService {
  protected serverURL: string = 'my/backend/path';
  protected apiResponse: SpecificApiResponse; // needs to be looked at how it's implemented

  public getResults(): SpecificApiResponse {
    return null;
  }

  constructor(injector: Injector) {
    super(injector);
  }
  
  // /**
  //  * @description - Calls the back end in order to get current job data based on given uuid. For use in homepage to load job data when the app is loaded or refreshed.
  //  * @param {string} uuid - the uuid to be passed to the back end as a seed to generate jobs.
  //  * @returns {void}
  //  */
  //  public call(uuid: string): void {
  //   // validate we're not already loading an API response and that we have the expected parameters
  //   if (!this.loading && uuid) {
  //     this.updateLoading(true);
  //     this.httpSubscription = this.http.get(`${this.serverURL}/${uuid}`)
  //       .subscribe({ 
  //         next: (response: any) => {
  //           // this.jobApiResults = new JobsResponse(response);
  //           this.apiResponse = response; // still testing, is this how it's implemented?
  //           this.isSuccessfullyCompleted = true;
  //           this.updateLoading(false);
  //         },
  //         error: (error: any) => {
  //           // this.jobApiResults = new JobsResponse(error.error);
  //           this.isSuccessfullyCompleted = false;
  //           this.updateLoading(false);
  //         }
  //       });
  //     }
  // }
}

interface SpecificApiResponse {
  flowStatus: string;
  flowStatusMessage: string;
  apiResponse: any;
  specificData: boolean[];
}

class Test {
  constructor() {
    const testService = new TestService(null);

    testService.call('extra/data/for/call');
    testService.getLoading().subscribe({
      next: (loading: boolean) => {
        if(!loading && testService.hasSuccessfullyCompleted()) {
          
        }
      }
    })
  }
}