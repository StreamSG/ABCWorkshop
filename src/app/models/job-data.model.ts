export class JobData {
  private lat: number;
  private long: number;

  private seed: number;
  private seedIndex: number = 0; // To be incremented by one each number generated

  public accountNumber: number;
  public streetAddress: string;
  public jobType: string;
  public jobTypeColor: string;
  public appointmentWindow: string;
  public cityAndState: string ;

  public customer: {name: string, phone: string, email: string};

  private streetNames: string[] = ['Main Street', 'Church Street', 'High Street', 'Elm Street', 'Park Avenue', 'Walnut Street', 'Washington Street', '2nd Street', 'Chestnut Street', 'Broad Street', 'Maple Avenue', 'Oak Street', 'Maple Street', 'Center Street', 'Pine Street', 'River Road', 'Market Street', 'Washington Avenue', 'Water Street', 'Union Street', '3rd Street', 'South Street', '4th Street'];
  private aptWindows: string[] = ['8-10', '10-12', '12-2', '2-4', '8-12', '12-4', '4-8'];
  private firstNames: string[] = ['Aaron', 'Ed', 'Kerry', 'Micah', 'Raul', 'Tyler'];
  private lastNames: string[] = ['Smith', 'Jones', 'Collins', 'Doe', 'Simmons', 'Taylor'];
  // background e4e9ec
  /**
   * @description Using a latitude and longitude, will generate job ticket data using a seeded pseudorandom number generator.
   * @param {number} latitude The latitudinal coordinate of the job, between -90 and 90
   * @param {number} longitude The longitudinal coordinate of the job, between -90 and 90
   * @param {string} jobType (optional, defaults to 'Install') In order to choose what job types we show, the job type is to be passed in when the object is instantiated.
   * @param {string} cityAndState (optional, defaults to Heaven) From the master list of preselected alert-prone locations, pass the city and state in here
   */
  constructor(latitude: number, longitude: number, jobType: string = 'Install', cityAndState: string = 'Cleveland, OH') {
    this.lat = latitude && latitude >= -90 && latitude <= 90 ? latitude : 0;
    this.long = longitude && longitude >= -90 && longitude <= 90 ? longitude : 0;
    this.jobType = jobType;
    this.jobTypeColor = jobType === 'Install' ? '#0764a9' : jobType === 'Repair' ? '#563064' : jobType === 'Helper' ? '#050' : jobType === 'BSW' ? '#3a2204' : jobType === 'POTS' ? '#5e5c13' : 'black';
    this.cityAndState = cityAndState;

    // generate a seed from the lat and long, that will be basically be a unique number
    let latAsStr: string = this.lat.toString()
      .substring(0, 6)
      .replace('-', '1')
      .replace('.', '1'); // remove decimal place and negative symbol
    let longAsStr: string = this.long.toString()
      .substring(0, 6)
      .replace('-', '1')
      .replace('.', '1'); 
    this.seed = +`${latAsStr}${longAsStr}`; // if lat=123 and long=456 will create a number 123456
    
    this.accountNumber = Math.floor(this.nextRand()*1000000);
    this.streetAddress = `${Math.floor(this.nextRand() * Math.pow(10, Math.floor(this.nextRand()*3) + 3))} ${this.streetNames[Math.floor(this.nextRand() * this.streetNames.length)]}`;
    this.appointmentWindow = this.aptWindows[Math.floor(this.nextRand() * this.aptWindows.length)].toString();

    const custFirstI = Math.floor(this.nextRand() * this.firstNames.length);
    const custLastI = Math.floor(this.nextRand() * this.lastNames.length);
    this.customer = {
      name: `${this.firstNames[custFirstI]} ${this.lastNames[custLastI]}`,
      phone: `(${Math.floor(this.nextRand() * 900 + 100)}) ${Math.floor(this.nextRand() * 900 + 100)}-${Math.floor(this.nextRand() * 9000 + 1000)}`,
      email: this.generateEmail(this.firstNames[custFirstI], this.lastNames[custLastI]),
    }
  }

  /**
   * @description Will generate the next number in the seed from the sequence, by incrementing the seed index and executing a prime number-based formula to produce a pseudorandom number.
   * @returns {number} The next pseudorandom number produced from the seed, between 0 and 1 
   */
  private nextRand(): number {
    this.seedIndex++;
    let a = (this.seed + this.seedIndex) * 15485863; // primes and formula taken from https://en.wikipedia.org/wiki/Pseudorandom_number_generator#Implementation
    return (a * a * a % 2038074743) / 2038074743;
  }

  private generateEmail(first: string, last: string): string {
    const domains: string[] = ['gmail', 'aol', 'adelphia', 'yahoo', 'bell', 'att', 'microsoft', 'outlook'];
    const topLevel: string[] = ['com', 'net', 'gov', 'co.uk', 'org', 'edu'];

    let email = '';
    email += this.nextRand() < 0.5 ? first.charAt(0) : first;
    email += this.nextRand() < 0.5 ? '.' : '_';
    email += last;
    email += Math.floor(this.nextRand() * Math.pow(10, Math.floor(this.nextRand()*2)+2));
    email += `@${domains[Math.floor( this.nextRand() * domains.length)]}.${topLevel[Math.floor( this.nextRand() * topLevel.length)]}`;
    return email;
  }
}