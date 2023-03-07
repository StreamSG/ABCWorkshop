export class JobsResponse {
  readonly flowStatus: string;
  readonly flowStatusMessage: string;
  readonly apiResponse: any;
  readonly rawJobsData: any;
  readonly jobs: JobData[];

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
        this.rawJobsData = response.jobData;
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

// IMPORTANT INFO:
// The following interfaces are copied directly from the NestJS server ABCNest, and must match exactly
// HOWEVER:
// jobTypeColor: string is added to the JobData interface here, as that data is not calculated in the back end.
export interface JobData {
  accountNumber: number,
  firstName: string,
  lastName: string,
  streetAddress: string,
  city: City,
  appointment: string,
  email: string,
  phone: number,
  jobType: string,
  transportType: string,
  history: History[],
  facilities: Facility[],
  services: Service[],
  jobTypeColor: string,
}

export interface Facility {
  heading: string,
  address: string,
  cable?: number,
  pair?: number,
  port?: number,
}

export interface Service {
  type: string,
  transport?: string,
  equipment?: string,
  phone1?: number,
  phone2?: number,
  profile?: string,
}

export interface History {
  title: string,
  date: string,
  info: string[]
}

export interface City {
  state: string,
  city: string,
  zip?: number,
  lat: number,
  long: number
}