import { WeatherService } from '../services/weather.service';

export class WeatherAlertResponse {
  readonly flowStatus: string;
  readonly flowStatusMessage: string;
  // readonly id: string;
  // readonly sent: string;
  // readonly onset: string;
  // readonly expires: string;
  // readonly ends: string;
  // readonly status: string;
  // readonly messageType: string;
  // readonly category: string;
  // readonly severity: string;
  // readonly certainty: string;
  // readonly urgency: string;
  readonly event: string;
  // readonly headline: string;
  readonly description: string;
  // readonly instruction: string;
  // readonly response: string;
  readonly weatherAlerts: WeatherAlertInfo[];

  constructor(apiResponse: any) {
    try {
      if (typeof apiResponse.title === 'string') { // How we can validate the response of an API we can't control
        this.flowStatus = 'SUCCESS';
        this.flowStatusMessage = apiResponse.title;
      } else {
        this.flowStatus = 'FAILURE';
        this.flowStatusMessage = 'Unable to call API';
      }
      if (this.flowStatus === 'SUCCESS') {
        let tempWeatherAlerts = this.parseApiData(apiResponse);
        this.weatherAlerts = this.filterDuplicateAlerts(tempWeatherAlerts);
        this.description = Array.isArray(this.weatherAlerts) && this.weatherAlerts.length > 0 ? this.descriptionForToast(this.weatherAlerts) : 'Weather Alert Info Unknown';
      }
    } catch (e) {
      this.flowStatus = 'FAILURE';
      this.flowStatusMessage = 'Unable to parse API response';
    }
  }

  private parseApiData(apiResponse: any): WeatherAlertInfo[] {
    let tempWeatherAlerts = [];
    if (apiResponse) {
      for (let apiAlert of apiResponse.features) {
        let tempAlert = new WeatherAlertInfo(
          apiAlert.properties.id ? apiAlert.properties.id.slice(-5) : '', // We only need the last 5 digits of the alert to find updates to existing alerts
          apiAlert.properties.sent ? apiAlert.properties.sent : '',
          apiAlert.properties.onset ? apiAlert.properties.onset : '',
          apiAlert.properties.expires ? apiAlert.properties.expires : '',
          apiAlert.properties.ends ? apiAlert.properties.ends : '',
          apiAlert.properties.status ? apiAlert.properties.status : '',
          apiAlert.properties.messageType ? apiAlert.properties.messageType : '',
          apiAlert.properties.category ? apiAlert.properties.category : '',
          apiAlert.properties.severity ? apiAlert.properties.severity : '',
          apiAlert.properties.certainty ? apiAlert.properties.certainty : '',
          apiAlert.properties.urgency ? apiAlert.properties.urgency : '',
          apiAlert.properties.event ? apiAlert.properties.event : '',
          apiAlert.properties.headline ? apiAlert.properties.headline : '',
          apiAlert.properties.description ? apiAlert.properties.description : '',
          apiAlert.properties.instruction ? apiAlert.properties.instruction : '',
          apiAlert.properties.response ? apiAlert.properties.response : ''
        );
        tempWeatherAlerts.push(tempAlert);
      }
    }
    return tempWeatherAlerts;
  }

  private filterDuplicateAlerts(alerts: WeatherAlertInfo[]): WeatherAlertInfo[] {
    if (!alerts || !Array.isArray(alerts) || alerts.length === 0) { return []; } // early exit in case alerts not truthy, an array, or empty
    // Sort the alerts by the time they were sent from oldest to newest
    alerts = alerts.sort((a, b) => a.sent > b.sent ? 1 : -1);
    let filteredAlerts = [];
    // This nested loop will look at each alert, and only add it to the filtered array if there are no matching alerts that come after it. Essentially, creates an array of the latest update for each alert
    for (let i = 0; i < alerts.length; i++) { // loop through the first length-1 alerts
      let foundLaterDateAlert = false; // Prepare a variable to check if any matching later alerts exist
      for (let j = i+1; j < alerts.length; j++) { // loop through all the alerts after the current [i] alert. won't run when [i] loop is on its last iteration
        if (alerts[i].id === alerts[j].id) { // If a matching alert is found after the current alert..
          foundLaterDateAlert = true; // mark that we found a matching alert so we don't add alert [i] to the filtered array
          break; // exit the j loop since a match was found
        }
      }
      if (!foundLaterDateAlert) { // will always add the last alert!
        if(this.shouldAlertBeShown(alerts[i])) { // Verify if the alert is worth adding (such as not showing alerts of minor severity)
          filteredAlerts.push(alerts[i]);
        }
      }
    }
    return filteredAlerts;
  }

  private shouldAlertBeShown(alert: WeatherAlertInfo): boolean {
    return alert && alert.severity && alert.messageType && alert.onset && (alert.severity.includes('Severe') || alert.severity.includes('Moderate')) && !alert.messageType.includes('Cancel');
  }

  private descriptionForToast(weatherAlerts: WeatherAlertInfo[]): string {
    let returnedDescription: string;
    const weatherAlert: WeatherAlertInfo = weatherAlerts[0];
    if (weatherAlert && weatherAlert.headline) {
      returnedDescription = weatherAlert.headline;
    } else if (weatherAlert && weatherAlert.description && weatherAlert.description.indexOf('WHAT') > -1 && weatherAlert.description.indexOf('WHEN') > -1) {
      let tempDescriptionArray: string[] = weatherAlert.description.split('*');
      // tempDescriptionArray.forEach((msg) => {
      //   msg.trimStart();
      //   returnedDescription = msg.slice(msg.indexOf('...') + 3);
      // })
      returnedDescription = tempDescriptionArray[1].slice(tempDescriptionArray[1].indexOf('...') + 3);
    } else if (weatherAlert && weatherAlert.description) {
      returnedDescription = weatherAlert.description;
    } else if (weatherAlert && weatherAlert.event && weatherAlert.sent) {
      // parse date weatherAlert.sent
      returnedDescription = `${weatherAlert.event} issued at ${new Date(weatherAlert.sent)}`;
    } else {
      returnedDescription = 'Weather Alert Info Unknown';
    }
    return returnedDescription;
  }
  
  /**
     * @description - Takes in a description from the weather api, and parses out each block of data. The type of description, such as WHAT, WHERE, WHEN will be set as the to the output, and the corresponding text for each part will be set as the value. For example, an output may look like { 'WHAT': 'The weather is bad.', 'WHEN': 'Later tonight' }
     * @param desc - The weather description from the api
     * @returns {[key: string]: string} - Returns an object where the key is the WHAT/WHEN/WHERE/etc of the description, and the value is the corresponding text. 
     */
   private parseWeatherDescription(desc: string): {[key: string]: string} {
    // let re: RegExp = /\*\s[A-Z\s]*\.{3}[^\*]*/g; // working on grabbing every piece, but kinda not worth it tbh
    desc = desc.replace( /\n/g , ' '); // get rid of all new lines
    desc = desc.replace( /\s{2,}/g , ' '); // replace any groupings of spaces with just 1 space
    let mainParts: string[] = desc.split('*');
    mainParts.splice(0,1); // get rid of the first element, as the description will start with '*' so the first element is empty
    let output: {[key: string]: string} = {}; 
    for (let part of mainParts) {
      if (!part) {continue}; // ensure no elements are broke
      let subParts: string[] = part.split('...'); // split each description into the type and text, such as 'WHAT' and 'The weather is bad.' respectively
      if (!subParts || !Array.isArray(subParts) || subParts.length < 2 || !subParts[0] || !subParts[1]) { return; } // Ensure we have usable data
      output[subParts[0].trim()] = subParts[1].trim(); // store the type as the key (such as WHAT) and the description as the value
    }
    return output;
  }
}

/**
 * @description The important weather alert data as pulled from the weather.gov api. All of the variable names here match the variable names used in the api.
 * @param {string} id The unique ID for the alert
 * @param {string} sent Time the warning was sent
 * @param {string} onset expecting event beginning time (nullable)
 * @param {string} expires expiration time of the warning
 * @param {string} ends expected end time of the event (nullable)
 * @param {string} status For normal weather expect Actual, may only want to access when that is the case
 * @param {string} messageType The code denoting the type of the event message
 * @param {string} category The code denoting the category of the event
 * @param {string} severity How severe the weather event is
 * @param {string} certainty How certain the weather event is
 * @param {string} urgency How urgent the weather event is
 * @param {string} event A description of the event, such as 'Wind Advisory'
 * @param {string} headline The headline for the event (nullable)
 * @param {string} description The text describing the subject event
 * @param {string} instruction Recommended action (nullable)
 * @param {WeatherRecommendedResponse} response Specific type of recommended response
 */
 export class WeatherAlertInfo {
  constructor(
    public id: string,
    public sent: string,
    public onset: string,
    public expires: string,
    public ends: string,
    public status: string,
    public messageType: string,
    public category: string,
    public severity: string,
    public certainty: string,
    public urgency: string,
    public event: string,
    public headline: string,
    public description: string,
    public instruction: string,
    public response: string
  ){}
}
