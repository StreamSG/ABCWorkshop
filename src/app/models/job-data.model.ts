export class JobData {
  readonly lat: number;
  readonly long: number;

  private seed: number;
  private seedIndex: number = 0; // To be incremented by one each number generated

  public accountNumber: number;
  public streetAddress: string;
  public jobType: string;
  public jobTypeColor: string;
  public appointmentWindow: string;
  public cityAndState: string ;

  public customer: {name: string, phone: string, email: string};
  
  /**
   * @description Using a latitude and longitude, will generate job ticket data using a seeded pseudorandom number generator.
   * @param {number} latitude The latitudinal coordinate of the job, between -90 and 90
   * @param {number} longitude The longitudinal coordinate of the job, between -90 and 90
   * @param {string} jobType (optional, defaults to 'Install') In order to choose what job types we show, the job type is to be passed in when the object is instantiated.
   * @param {string} cityAndState (optional, defaults to Heaven) From the master list of preselected alert-prone locations, pass the city and state in here
   */
  constructor(latitude?: number, longitude?: number, jobType?: string, cityAndState?: string) {
    const loc: City = locations[Math.floor(Math.random() * locations.length)];
    this.lat = latitude ? latitude : loc.lat;
    this.long = longitude ? longitude : loc.long;
    this.jobType = jobType ? jobType : ['Install', 'Repair', 'Helper', 'BSW', 'POTS'][Math.floor(Math.random() * 5)];
    this.jobTypeColor = this.jobType === 'Install' ? '#0764a9' : this.jobType === 'Repair' ? '#563064' : this.jobType === 'Helper' ? '#050' : this.jobType === 'BSW' ? '#3a2204' : this.jobType === 'POTS' ? '#5e5c13' : 'black';
    this.cityAndState = cityAndState ? cityAndState : `${loc.city}, ${loc.state}`;

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

    // If you're reading this, feel free to add more data to the arrays below! The more variety the better!
    const streetNames: string[] = ['Main Street', 'Church Street', 'High Street', 'Elm Street', 'Park Avenue', 'Walnut Street', 'Washington Street', '2nd Street', 'Chestnut Street', 'Broad Street', 'Maple Avenue', 'Oak Street', 'Maple Street', 'Center Street', 'Pine Street', 'River Road', 'Market Street', 'Washington Avenue', 'Water Street', 'Union Street', '3rd Street', 'South Street', '4th Street'];
    const aptWindows: string[] = ['8-10', '10-12', '12-2', '2-4', '8-12', '12-4', '4-8'];
    const firstNames: string[] = ['Aaron', 'Ed', 'Kerry', 'Micah', 'Raul', 'Tyler'];
    const lastNames: string[] = ['Smith', 'Jones', 'Collins', 'Doe', 'Simmons', 'Taylor'];
    
    this.accountNumber = Math.floor(this.nextRand()*1000000);
    this.streetAddress = `${Math.floor(this.nextRand() * Math.pow(10, Math.floor(this.nextRand()*3) + 3))} ${streetNames[Math.floor(this.nextRand() * streetNames.length)]}`;
    this.appointmentWindow = aptWindows[Math.floor(this.nextRand() * aptWindows.length)].toString();

    const custFirstI = Math.floor(this.nextRand() * firstNames.length);
    const custLastI = Math.floor(this.nextRand() * lastNames.length);
    this.customer = {
      name: `${firstNames[custFirstI]} ${lastNames[custLastI]}`,
      phone: `(${Math.floor(this.nextRand() * 900 + 100)}) ${Math.floor(this.nextRand() * 900 + 100)}-${Math.floor(this.nextRand() * 9000 + 1000)}`,
      email: this.generateEmail(firstNames[custFirstI], lastNames[custLastI]),
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

  /**
   * @description Generate a seeded email.
   * @param {string} first The user's first name
   * @param {string} last The user's last name
   * @returns {string} The finished email
   */
  private generateEmail(first: string, last: string): string {
    const domains: string[] = ['gmail', 'aol', 'adelphia', 'yahoo', 'bell', 'att', 'microsoft', 'outlook'];
    const topLevel: string[] = ['com', 'net', 'gov', 'co.uk', 'org', 'edu'];

    let email = '';
    email += this.nextRand() < 0.5 ? first.charAt(0) : first; // Add first name
    email += this.nextRand() < 0.5 ? '.' : '_'; // Add first/last spacer
    email += last; 
    email += Math.floor(this.nextRand() * Math.pow(10, Math.floor(this.nextRand()*2)+2)); // Add some amount of numbers
    email += `@${domains[Math.floor( this.nextRand() * domains.length)]}.${topLevel[Math.floor( this.nextRand() * topLevel.length)]}`; // add @ and domain
    return email;
  }
}

const locations = `AL,Montgomery,32.377716,-86.300568
AK,Juneau,58.301598,-134.420212
AZ,Phoenix,33.448143,-112.096962
AR,Little Rock,34.746613,-92.288986
CA,Sacramento,38.576668,-121.493629
CO,Denver,39.739227,-104.984856
CT,Hartford<br>,41.764046,-72.682198
DE,Dover,39.157307,-75.519722
HI,Honolulu,21.307442,-157.857376
FL,Tallahassee,30.438118,-84.281296
GA,Atlanta<br>,33.749027,-84.388229
ID,Boise,43.617775,-116.199722
IL,Springfield,39.798363,-89.654961
IN,Indianapolis,39.768623,-86.162643
IA,Des Moines,41.591087,-93.603729
KS,Topeka,39.048191,-95.677956
KY,Frankfort,38.186722,-84.875374
LA,Baton Rouge,30.457069,-91.187393
ME,Augusta,44.307167,-69.781693
MD,Annapolis,38.978764,-76.490936
MA,Boston,42.358162,-71.063698
MI,Lansing,42.733635,-84.555328
MN,St. Paul,44.955097,-93.102211
MS,Jackson,32.303848,-90.182106
MO,Jefferson City,38.579201,-92.172935
MT,Helena,46.585709,-112.018417
NE,Lincoln,40.808075,-96.699654
NV,Carson City,39.163914,-119.766121
NH,Concord,43.206898,-71.537994
NJ,Trenton,40.220596,-74.769913
NM,Santa Fe,35.68224,-105.939728
NC,Raleigh,35.78043,-78.639099
ND,Bismarck,46.82085,-100.783318
NY,Albany,42.652843,-73.757874
OH,Columbus,39.961346,-82.999069
OK,Oklahoma City,35.492207,-97.503342
OR,Salem,44.938461,-123.030403
PA,Harrisburg,40.264378,-76.883598
RI,Providence,41.830914,-71.414963
SC,Columbia,34.000343,-81.033211
SD,Pierre,44.367031,-100.346405
TN,Nashville,36.16581,-86.784241
TX,Austin,30.27467,-97.740349
UT,Salt Lake City,40.777477,-111.888237
VT,Montpelier,44.262436,-72.580536
VA,Richmond,37.538857,-77.43364
WA,Olympia,47.035805,-122.905014
WV,Charleston,38.336246,-81.612328
WI,43.074684,-89.384445
WY,Cheyenne,41.140259,-104.820236`.split('\n').map(function(el: string): City {
  const parts = el.split(',');
  return {state: parts[0], city: parts[1], lat: +parts[2], long: +parts[3]};
});

interface City {
  state: string,
  city: string,
  lat: number,
  long: number
}