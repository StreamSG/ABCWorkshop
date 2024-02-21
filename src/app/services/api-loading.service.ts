import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

/**
 * @description This is an example implementation of the power of using an abstract service file. Allows for APIs to "register" with this service, so that it can monitor what service files are waiting on a response at a given time.
 */
@Injectable({
  providedIn: 'root'
})
export class ApiLoadingService {
  private apiList: ApiData[] = []; // Start with none, to be populated as each api is registered.
  private apiListChanged: BehaviorSubject<ApiData[]> = new BehaviorSubject<ApiData[]>([]);

  constructor() { }

  /**
   * @description - To be called in the constructor of the abstract api service file, so that each api service can register with this here service
   * @param {string} apiName - The name of the service file to be logged in this service, to also be displayed in the api list page
   * @returns {number} - The unique ID chosen for the given api name at the time of registration. Not to be used as a lookup tool!
   */
  public registerApi(apiName: string): number {
    this.apiList.push(new ApiData(apiName));
    return this.apiList.length - 1;
  }

  /**
   * @description - Used to alert the service file that the given api ID (as returned from the registerApi method) has changed its loading state. Will internally update the necessary info, and then broadcast the changes to all subscribed locations throughout the application.
   * @param {number} apiId - The unique ID for the given api service file, as returned from the registerApi method.
   * @param {boolean} isLoading - The current loading state of the given api service file. Depending on the input, will log certain data to the record for the unique ID
   * @returns {void}
   */
  public updateApi(apiId: number, isLoading: boolean): void {
    if (this.apiList[apiId].isBeingCalled === isLoading) { // ignore duplicate calls of this method. Not sure if needed?
      console.log(`The updateApi method was called twice in a row for ${this.apiList[apiId].name}! Now you know why this is needed. Or you know if you have a bug to fix.`)
      return;
    }
    
    // Data to update when the api is first called:
    if (isLoading) {
      this.apiList[apiId].lastCall = new Date();
      this.apiList[apiId].totalCalls++;
    }

    // Data to update when the api finishes its call:
    else {
      this.apiList[apiId].totalCallLength += new Date().getTime() - this.apiList[apiId].lastCall.getTime();
    }
    
    // Data to update every time:
    this.apiList[apiId].isBeingCalled = isLoading;
    this.apiListChanged.next(this.apiList);
  }

  /**
   * @description - For subscribing to be notified when any of the registered api service files has a change in their loading state.
   * @returns {Observable<ApiData[]>} - Returns an updated list of api 
   */
  public getAllLoading(): Observable<ApiData[]> {
    return this.apiListChanged.asObservable();
  }

  /**
   * @description - Loops through the list of registered api service files and counts how many are actively waiting on an api response.
   * @returns {number} - The current number of registered service files waiting on an api response.
   */
  public getNumberOfLoadingApis(): number {
    let loadingApiCount = 0;
    for (let api of this.apiList) {
      loadingApiCount += api.isBeingCalled ? 1 : 0;
    }
    return loadingApiCount;
  }

  /**
   * @description - Returns a copy of the list of all registered apis.
   * @returns {ApiData[]} - A copy of the list of all registered apis.
   */
  public getApiList(): ApiData[] {
    return this.apiList.slice();
  }
}

export class ApiData {
  public isBeingCalled: boolean = false;
  public lastCall: Date = undefined;
  public totalCalls: number = 0;
  public totalCallLength: number = 0;
  
  constructor(public name: string) { }
}
