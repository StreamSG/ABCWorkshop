import { HttpClient } from '@angular/common/http';
import { Injector } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';

import { ApiResponseModel } from '../models/api-response.model';

export abstract class ApiService<ApiResults extends ApiResponseModel> { // idk if extends is needed
  protected abstract serverURL: string;
  protected apiResults: ApiResults;
  protected loadingChanged: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  protected loading: boolean;
  protected httpSubscription: Subscription;
  protected isSuccessfullyCompleted: boolean = false;
  // Dependencies
  private http: HttpClient;
  
  constructor(injector: Injector) {
    // Why this uses injector: child components receive any injected dependencies (such as a service file), and then need to pass it to this abstract class via super() within the child constructor. As such, any changes here to which dependencies are needed, would require you to update EVERY child class that uses this as a parent. However, using Injector, this class can simply use injector.get to retrieve any dependencies it needs, without requiring any changes to child class.
    this.http = injector.get(HttpClient);
  }

  /**
   * @description - Resets the state of the service. This should be called in clearJobData service if this service is a job specific API.
   * @returns {void}
   */
   public resetData(): void {
    this.apiResults = null;
    this.loading = false;
    this.loadingChanged.next(this.loading);
    this.isSuccessfullyCompleted = false;
    this.cancelRequest();
  } 
 
  /**
   * @description - Cancels any ongoing API call.
   * @returns {void}
   */
  protected cancelRequest(): void {
    if (this.httpSubscription) {
      if (!this.httpSubscription.closed) {
        this.httpSubscription.unsubscribe();
      }
    }
  }
 
  /**
   * @description - Returns the loadingChanged Subject as an Observable. Components should subscribe to this function, which should return the status of the API, and retrieve the API result when the loading has been updated from true to false. 
   * @returns {Observable<boolean>} - The loadingChanged Subject as an Observable
   */
  public getLoading(): Observable<boolean> {
    return this.loadingChanged.asObservable();
  }
 
  /**
   * @description - Updates the loadingChanged BehaviorSubject. This is called within the service's call() to update the status of the API. The loading variable is updated to true when the API is called, and updated to false when the response is retrieved.
   * @param {boolean} loading - The new value for loading
   * @returns {void}
   */
  protected updateLoading(loading: boolean): void {
    // this.isLoadingService.myLoadingStatus(someUniqueDataToThisFile, loading);
    this.loading = loading;
    this.loadingChanged.next(this.loading);
  }
 
  /**
   * @description - Returns the status of isSuccessfullyCompleted. This should be used in components to determine if an API should be called again.
   * @returns {boolean} - true if the API has successfully been called; false otherwise
   */
  public hasSuccessfullyCompleted(): boolean {
    return this.isSuccessfullyCompleted;
  }
 
  /**
   * @description - Returns the <yourModel> API result
   * @returns {ApiResults} - The API results for the inquireBillingAuthorization call
   */
  public getResults(): ApiResults {
    return this.apiResults;
  }

  protected abstract parseApiResponse(response: any): ApiResults;
 
  /**
   * @description - Calls the back end in order to get current job data based on given uuid. For use in homepage to load job data when the app is loaded or refreshed.
   * @param {string} params - the parameters to be passed appended to the 
   * @returns {void}
   */
  public call(params: string): void {
    // validate we're not already loading an API response and that we have the expected parameters
    if (!this.loading && params) {
      this.updateLoading(true);
      if (params.charAt(0) === '/') {
        params = params.substring(1);
      }
      this.httpSubscription = this.http.get(`${this.serverURL}/${params}`)
        .subscribe({ 
          next: (response: any) => {
            this.apiResults = this.parseApiResponse(response);
            this.isSuccessfullyCompleted = true;
            this.updateLoading(false);
          },
          error: (error: any) => {
            this.apiResults = this.parseApiResponse(error.error);
            this.isSuccessfullyCompleted = false;
            this.updateLoading(false);
          }
        });
      }
  }
}