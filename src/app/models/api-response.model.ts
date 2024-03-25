/**
 * @description This abstract model file is a parent for any model file which is used to process a back-end API response. Instead of copying and pasting the flowStatus code from a template, this abstract model can be extended to simplify implementation of a model file.
 */
export abstract class ApiResponseModel {
  protected readonly flowStatus: string;
  protected readonly flowStatusMessage: string;
  
  constructor(response: any) {
    try {
      if (response.flowStatus === 'SUCCESS' || response.flowStatus === 'FAILURE') {
        this.flowStatus = response.flowStatus;
        this.flowStatusMessage = response.flowStatusMessage;
      }
      else {
        this.flowStatus = 'FAILURE';
        this.flowStatusMessage = 'Unable to call API';
      }
      if (response.flowStatus === 'SUCCESS') {
        this.processResponse(response);
      }
    }
    catch (e) {
      this.flowStatus = 'FAILURE';
      this.flowStatusMessage = e.message;
    }
  }

  /**
   * @description A method called in the constructor of the parent abstract class, which is given the response from the API. The response should be parsed in order to store expected data into class variables in the child model file.
   * @param {any} response - The api response from the back end. Will be processed in the child class's implementation.
   */
  protected abstract processResponse(response: any): void;
}