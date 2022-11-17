/**
 * @description Allows for random numbers to be generated from a seed. Input the seed at creation, (ideally the ban), and then call next() to get the next random number. Whenever you re-generate a page, call resetSeed so that it will start over from a "zeroed" seed
 * @param {number} seed The seed for the random numbers. Inputting the same seed will always produce the same sequence of random numbers
 */
 export class SeededRandomNumber {

  private seed: number;
  private counter: number;

  // Got prime numbers and formula from https://en.wikipedia.org/wiki/Pseudorandom_number_generator
  private mult1: number = 15485863; //9293787934331213n; I tried these two primes originally but I was having trouble with BigInts
  private mult2: number = 2038074743; //14159265358979323846264338327950n; This ends in a 0 so I don't think it's a prime but whatever, too long


  constructor(seed: number) {
    this.counter = 1;
    this.seed = seed;
  }

  /**
   * @description Will return the next random number in the sequence based off of the seed.
   * @returns {number} A number from 0 to 1
   */
  public next(): number {
    this.counter++;
    let a = this.seed*this.counter*this.counter*this.mult1;
    return ( a * a * a % this.mult2 ) / this.mult2;
  }

  /**
   * @description Will return the Nth random number from the seed sequence that you'd like to generate
   * @param count The Nth random number in the seed sequence you'd like to generate
   * @returns {number} A number from 0 to 1
   */
  public nextNumberAtCount(count: number): number {
    let a = this.seed * count * count * this.mult1;
    return ( a * a * a % this.mult2 ) / this.mult2;
  }

  /**
   * @description Set the seed back to "zero" as if you were beginning to use it for the first time
   */
  public resetSeed(): void {
    this.counter = 1;
  }

  /**
   * @description 
   * @param index 
   */
  public setSeedIndex(index: number) {
    this.counter = index;
  }

  /**
   * @description Essentailly the same as "new SeedRng(seed)"
   */
  public setNewSeed(seed: number) {
    this.seed = seed;
    this.counter = 1;
  }

  /**
   * @description Generates 
   * @returns 
   */
  public nextLetter(): string { // 97 to 122
    const nextNum = Math.min(Math.floor(this.next()*26)+97, 122);

    return String.fromCharCode(nextNum).toUpperCase();
  }

  /**
   * 
   * @returns 
   */
  public getCounter(): number {
    return this.counter;
  }

}

/**
 * @description Given a 9 digit BAN, will generate account data from the BAN. Includes street address, phone number, and circuit ID.
 * @param {number} ban A 9-digit number
 */
export class SeededBanDataGenerator extends SeededRandomNumber {

  // Arrays of potential variables to be randomly selected to place together to generate a 
  private streetNames: string[] = "Devon Lafayette Cypress Kings Jewel Great Baker Steam Summer Bath Autumn Farmer Archer Walnut Chapel Congress University Grime Sunny Lower".split(" ");
  private streetTypes: string[] = "Street Road Lane Boulevard Drive".split(" ");
  private cityNames: string[] = "Austin Seattle Boston Chicago Portland Denver Cleveland Atlanta Akron Arronton Orlando".split(" ");
  private stateNames: string[] = "TX NV CA OK KA MS AR LA MI AL TN KY IL WI MI OH NC SC GA FL CN".split(" "); // I think that's all ATT states and I think I got them spelled right
  private regionNames: string[] = "mw sw se nw".split(" ");

  // This allows for the seed to generate a specific bit of data every time. Uses the number here as the count for a seed.
  // Long explanation: the way a seeded RNG works, it has a "counter" that is incremented each time a number is generated, which is factored into the number generation formula. It increments each time a number is generated in order to generate a new number each time. Given a seed, generating a random number with the same counter will always produce the same "random" number. So seed 12345 and counter 1 will generate a number, and then the counter is incremented to 2. Then a number is generated with seed 12345 and counter 2, and it is a new number. If the counter is set back to 1, it will generate the same number as the first time.
  // Each of these seed codes is a corresponding "counter" in the rng. That way streetNum, for example, given a set seed, will always generate the same number.
  private seedCodes = {
    streetNum: 1,
    streetName: 2,
    streetType: 3,
    cityName: 4,
    stateName: 5,
    zip: 6,
    phone: 7,

    circuitID: 1000, // draws 13 seeded numbers
  };

  constructor(ban:number) {
    super(ban);
  }

  /**
   * @description Generates a street address, such as `1234 Jones Street`
   * @returns {string} Returns the street address
   */
  public getStreet(): string {
    const number = Math.floor(this.nextNumberAtCount(this.seedCodes.streetNum)*10000);
    const streetNameIndex = Math.floor(this.nextNumberAtCount(this.seedCodes.streetName) * this.streetNames.length);
    const name = this.streetNames[ streetNameIndex ];
    const streetTypeIndex = Math.floor(this.nextNumberAtCount(this.seedCodes.streetType) * this.streetTypes.length);
    const type = this.streetTypes[ streetTypeIndex ];
    return `${number} ${name} ${type}`;
  }

  /**
   * @description Generates an entire address, including street address, city, state, and ZIP code
   * @returns {string} Returns the entire generated address
   */
  public getAddress(): string {
    const street: string = this.getStreet();

    const cityIndex = Math.floor(this.nextNumberAtCount(this.seedCodes.cityName) * this.cityNames.length);
    const city: string = this.cityNames[cityIndex];

    const stateIndex = Math.floor(this.nextNumberAtCount(this.seedCodes.stateName) * this.stateNames.length);
    const state: string = this.stateNames[stateIndex];

    const zip: number = Math.floor(this.nextNumberAtCount(this.seedCodes.zip) * 90000 + 10000);

    return `${street}, ${city}, ${state} ${zip}`;
  }
  
  /**
   * @description Generates a phone number
   * @returns {string} Returns the stylized phone number as a string. Example: '123-456-7890'
   */
  public getPhoneNumber(): string {
    const phoneNum: string = String(Math.floor( this.nextNumberAtCount(this.seedCodes.phone) *9000000000 + 1000000000 ));
    return `${phoneNum.substring(0,3)}-${phoneNum.substring(3,6)}-${phoneNum.substring(6,11)}`;
  }

  /**
   * @description Generate a circuit ID
   * @returns {string} Returnes the circuit id as a string. Example: 'AB.CDEF.123456..mw'
   */
  public getCircuitID(): string {
    this.setSeedIndex(this.seedCodes.circuitID)
    let output = '';

    for(let i = 0; i < 12; i++) {
      if(i < 6) {
        output += this.nextLetter() + (i === 1 || i === 5 ? '.' : '');
      }
      else {
        output += Math.floor(this.next()*10);
      }
    }

    const regionIndex: number = Math.floor(this.next() * this.regionNames.length);
    output += '..' + this.regionNames[regionIndex];

    return output;
  }

}

export class SeededPLEGenerator extends SeededRandomNumber {

  private courseNames: string[] = [ 
    'Climbing a Ladder', 'Circle of Safety', 'Safely Greeting the Customer', 
    'Don\'t Get Shocked', 'Cleaver? I Hardly Know \'er!', 'Working Without Tools',
    'What\'s the deal with all that fiber?', 'Getting the most out of every second',
    'On the Clock, Off the Record', 'Time Micro-management', 'Drop it like it\'s a hot wire',
    'Staring Into the Known', 'Finding Your Innter Technican', 'Clean Climbing',
    'Maintaining a Balance Between Work and More Work', 'If you can read this, you\'re to close',
    'Jep and Step: The Rise and Fall of the Modern Technican', 'Service no Sync',
    'Did you hear about Pluto? That\'s messed up, right?', 'Gasses You Should and Shouldn\'t Breathe',
    'Drinking 37 Gallons of Water Per Day', 'How to keep your family happy when you work 82 hours a week',
    'Weird Smells', 'When to Burn Your Clothes', 'We\'d Clone You If We Could', 'Bounce that Port',
    'Every CO Has a Secret Dungeon, And You Can\'t Go In', 'When You Have to Install Service For Your Ex',
    'The Basics of Leading a Complex Life', 'What to Do When Nothing\'s Due', 'All Aboard the Train Train!',
    'If it ain\'t safe, don\'t break it!', 'Why You Have to Work Harder Than Everyone Else', 
    'Smoke and Fears', 'Ski down those Mountains of Regret', 'Island in the Shun', 'Soft Head, Hard Hat',
    'Which Pedal Makes It Go "Vroom!"', 'Stop Going to Breakfast First' 
  ];

  private seedCodes = { // used to allow for different methods to pull different numbers from the seed without overlap.
    completedCourseCount: 1, 
    

    courseListScramble: 100
  };

  private userTrainingCount: number;

  constructor(uuid: string) {
    let uuidAsNum = '';

    for(let str of uuid) { // loop through each character of the uuid, and build out a number by appending each character ascii code to the end of the built string
      uuidAsNum += '' + (isNaN(Number(str)) ? str.charCodeAt(0) : str);
    }

    super(Number(uuidAsNum)); // Set the seed for the random number generator to be the built string, converted to a number (as the string only contains numbers).

    this.userTrainingCount = Math.floor( this.nextNumberAtCount(this.seedCodes.completedCourseCount) * this.courseNames.length ); // 0 to courseNameCount

  }

  /**
   * @returns {number} Returns the number of trainings that the UUID seed has due.
   */
  public getTrainingCount(): number {
    return this.userTrainingCount;
  }

  /**
   * @description Generate a list of training due. Uses a full list of training, and randomly picks a random number of trainings from the list. Can pick anywhere from 0 to the full length of trainings. The list is generated on demand.
   * @returns {string[]} Returns the trainings as an array of strings
   */
  public getTrainingDue(): string[] { 

    let outputCourses: string[] = [];
    let courseNamesCopy = this.courseNames.slice();

    this.setSeedIndex(this.seedCodes.courseListScramble);

    while(outputCourses.length < this.userTrainingCount) { // as userTrainingCount is determined in the constructor, grab random courses from a copy of the master array, until userTrainingCount number of courses have been pulled.
      const trainingToComplete = courseNamesCopy.splice( Math.floor(this.next() * courseNamesCopy.length), 1)[0];
      outputCourses.push(trainingToComplete);
    }

    return outputCourses;
  }
}