export class JobsResponse {
  readonly flowStatus: string;
  readonly flowStatusMessage: string;
  readonly jobData: any;
  readonly apiResponse: any;
  readonly jobs: any[];

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
        // save data from response
        this.apiResponse = response;
        this.jobData = response.jobData;
        this.jobs = response.jobData.jobs;
        for (let i = 0; i < this.jobs.length; i++) {
          const jobType = this.jobs[i].jobType;
          this.jobs[i].jobTypeColor = this.parseJobTypeColor(jobType);
        }
      }
    }
    catch (e) {
      this.flowStatus = 'FAILURE';
      this.flowStatusMessage = 'Unable to parse API response';
    }
  }

  private parseJobTypeColor(jobType: string): string {
    return jobType === 'Install' ? '#0764a9' : jobType === 'Repair' ? '#563064' : jobType === 'Helper' ? '#050' : jobType === 'BSW' ? '#3a2204' : jobType === 'POTS' ? '#5e5c13' : 'black';
  }
}