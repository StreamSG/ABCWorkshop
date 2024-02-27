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

  protected abstract processResponse(response: any): void;
}