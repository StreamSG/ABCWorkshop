import { ApiResponseModel } from "./api-response.model";

export class JobsResponse extends ApiResponseModel {
  private jobs: JobData[];

  constructor(response: any) {
    super(response);
  }

  public getJobs(): JobData[] {
    return this.jobs.slice();
  }

  protected processResponse(response: any): void {
    this.jobs = response.jobs;
    
    if (!Array.isArray(this.jobs)) {
      return;
    }
    
    for (let i = 0; i < this.jobs.length; i++) { // for client-side calculations and data generation for display improvements
      const jobType: string = this.jobs[i]?.jobType;
      this.jobs[i].prettyPhone = this.prettifyPhone(this.jobs[i].phone);
      this.jobs[i].jobTypeColor = this.parseJobTypeColor(jobType);
    }
  }

  /**
   * @description Takes in a job type and matches it to a corresponding job color for use in webpage styling.
   * @param {string} jobType The job type received from the back end.
   * @returns {string} Color code or name to use in webpage styling.
   */
  private parseJobTypeColor(jobType: string): string {
    return jobType === 'Install' ? '#0764a9' : jobType === 'Repair' ? '#563064' : jobType === 'Helper' ? '#050' : jobType === 'BSW' ? '#3a2204' : jobType === 'POTS' ? '#5e5c13' : 'black';
  }

  /**
   * @description Takes the customer phone number and styles it as a string, such as (123) 555-1234
   * @param {number} phone Customer 10 digit phone number
   * @returns {string} Stylized phone number
   */
  private prettifyPhone(phone: number): string {
    const str = `${phone}`;
    return `(${str.substring(0,3)}) ${str.substring(3,6)}-${str.substring(6,9)}`
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
  location: Location,
  appointment: string,
  email: string,
  phone: number,
  prettyPhone: string,
  jobType: string,
  transportType: string,
  history: History[],
  facilities: Facility[],
  services: Services,
  jobTypeColor: string,
}

export interface Facility {
  heading: string,
  address: string,
  cable?: number,
  pair?: number,
  port?: number,
}

export interface Services {
  equipment: string[];
  internetSpeed?: number;
  potsNumber?: number;
  voipNumbers?: number[];
  uversePackage?: string;
}

export interface History {
  title: string,
  date: string,
  info: string[]
}

export interface Location {
  streetAddress: string,
  state: string,
  city: string,
  zip?: number,
  lat: number,
  long: number
}