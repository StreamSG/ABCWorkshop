import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiLoadingService {
  private apiList: ApiData[] = []; // Start with none, to be populated as each api is registered.
  private apiListChanged: BehaviorSubject<ApiData[]> = new BehaviorSubject<ApiData[]>([]);

  constructor() { }

  public registerApi(apiName: string): number {
    this.apiList.push({
      name: apiName,
      isBeingCalled: false,
      lastCall: new Date(), // or is undefined better?
      totalCalls: 0,
      totalCallLength: 0,
    });

    return this.apiList.length - 1;
  }

  public updateApi(apiIndex: number, isLoading: boolean): void {
    if (this.apiList[apiIndex].isBeingCalled === isLoading) { // ignore duplicate calls of this method. Not sure if needed?
      console.log(`The updateApi method was called twice in a row for ${this.apiList[apiIndex].name}! Now you know why this is needed. Or you know if you have a bug to fix.`)
      return;
    }
    
    this.apiList[apiIndex].isBeingCalled = isLoading;
    if (isLoading) {
      this.apiList[apiIndex].lastCall = new Date();
      this.apiList[apiIndex].totalCalls++;
    }
    else {
      this.apiList[apiIndex].totalCallLength += new Date().getTime() - this.apiList[apiIndex].lastCall.getTime();
    }

    this.apiListChanged.next(this.apiList);
  }

  public getAllLoading(): Observable<ApiData[]> {
    return this.apiListChanged.asObservable();
  }

  public getNumberOfLoadingApis(): number {
    let loadingApiCount = 0;
    for (let api of this.apiList) {
      loadingApiCount += api.isBeingCalled ? 1 : 0;
    }
    return loadingApiCount;
  }

  public getApiList(): ApiData[] {
    return this.apiList.slice();
  }
}

export interface ApiData {
  name: string;
  isBeingCalled: boolean;
  lastCall: Date;
  totalCalls: number;
  totalCallLength: number;
}
