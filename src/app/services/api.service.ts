import { HttpClient } from '@angular/common/http';
import { Injector } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';

import { ApiResponseModel } from '../models/api-response.model';
import { ApiLoadingService } from './api-loading.service';

/**
 * @description This abstract service file is a parent for any service files which will call a back-end API. Instead of copying and pasting the standard getLoading(), updateLoading(), loadingChanged, etc from a template file, this abstract service can be extended to simplify implementation of an API service.
 * @generics \<ApiResults extends ApiResponseModel\> - The generic for this class needs to be the corresponding model file which will process the API response. The model file should extend ApiResponseModel in order to inherit necessary functionality.
 */
export abstract class ApiService<ApiResults extends ApiResponseModel> {
  // To be implemented in child service files
  protected abstract serverUrl: string;
  /** @description In the child class, this needs to be set as the type of the model file which the response will be passed to in the respective child class. This allows the abstract class to create an instance of the model file once it receives the api response. */
  protected abstract apiResultsConstructor: new (response: any) => ApiResults;
  // Class variables
  protected apiResults: ApiResults;
  protected loadingChanged: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  protected loading: boolean;
  protected httpSubscription: Subscription;
  protected isSuccessfullyCompleted: boolean = false;
  private apiUniqueId: number;
  // Dependencies
  private http: HttpClient;
  private apiLoadingService: ApiLoadingService; 
  
  /**
   * @param {string} apiName - A unique name for your service file, to be used in the ApiLoadingService monitor.
   * @param {Injector} injector - The Injector from \@angular/core. Allows for shared dependencies to be modified or added from the parent class without needing to adjust every child.
   */
  constructor(apiName: string, injector: Injector) {
    // Why this uses injector: child components receive any injected dependencies (such as a service file), and then need to pass it to this abstract class via super() within the child constructor. As such, any changes here to which dependencies are needed in this abstract class, would require you to update EVERY child class that has this as a parent. However, using Injector, this class can simply use injector.get to retrieve any dependencies it needs, without requiring any changes to child class. All service files will function the same, but makes child class implementation future-proof for dependencies.
    this.http = injector.get(HttpClient);
    this.apiLoadingService = injector.get(ApiLoadingService);

    this.apiUniqueId = this.apiLoadingService.registerApi(apiName);
  }

  /**
   * @description - Resets the state of the service.
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
    this.apiLoadingService.updateApi(this.apiUniqueId, loading);
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
   * @description - Returns the generic <ApiResults> model
   * @returns {ApiResults} - The API results from the call
   */
  public getResults(): ApiResults {
    return this.apiResults;
  }

  /**
   * @description - Makes a get request to the back end to the path of passed params. Can optionally include an options object for use in the http request.
   * @param {string} params - the parameters to be passed appended to the server url when calling the api. Should be passed as individual arguments to the child's call() method, and then concatenated to be passed here.
   * @param {object} [options = {}] - optional, for passing any get request options
   * @returns {void}
   */
  protected get(params: string, options: object = {}): void {
    // validate we're not already loading an API response and that we have the expected parameters
    if (!this.loading && params) {
      this.updateLoading(true);
      if (params && params.length > 0 && params.charAt(0) === '/') {
        params = params.substring(1);
      }
      this.httpSubscription = this.http.get(`${this.serverUrl}/${params}`, options).subscribe({ 
        next: (response: any) => {
          this.apiResults = new this.apiResultsConstructor(response); // Creates an instance of the model file
          this.isSuccessfullyCompleted = true;
          this.updateLoading(false);
        },
        error: (error: any) => {
          console.log(error);
          console.log(error.error);
          this.apiResults = new this.apiResultsConstructor(error.error); // Creates an instance of the model file
          this.isSuccessfullyCompleted = false;
          this.updateLoading(false);
        }
      });
    }
  }

  /**
   * @description - Makes a post request to the back end to the path of passed params. The body data for the request is passed as the second parameter, and can optionally include an options object for use in the http request.
   * @param {string} params - the parameters to be passed appended to the server url when calling the api. Should be passed as individual arguments to the child's call() method, and then concatenated to be passed here.
   * @param {any} body - The body of the post request
   * @param {object} [options = {}] - optional, for passing any post request options
   * @returns {void}
   */
   protected post(params: string, body: any, options: object = {}): void {
    // validate we're not already loading an API response and that we have the expected parameters
    if (!this.loading && params) {
      this.updateLoading(true);
      if (params && params.length > 0 && params.charAt(0) === '/') {
        params = params.substring(1);
      }
      this.httpSubscription = this.http.post(`${this.serverUrl}/${params}`, body, options).subscribe({ 
        next: (response: any) => {
          this.apiResults = new this.apiResultsConstructor(response); // Creates an instance of the model file
          this.isSuccessfullyCompleted = true;
          this.updateLoading(false);
        },
        error: (error: any) => {
          this.apiResults = new this.apiResultsConstructor(error.error); // Creates an instance of the model file
          this.isSuccessfullyCompleted = false;
          this.updateLoading(false);
        }
      });
    }
  }
}