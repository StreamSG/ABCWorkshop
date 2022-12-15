import * as moment from "moment";

export class WeatherAlertResponse {
  readonly flowStatus: string;
  readonly flowStatusMessage: string;
  readonly allActiveWeatherAlerts: WeatherAlertInfo[];
  readonly activeAlertDescription: string;
  readonly activeAlertEvent: string;
  readonly activeAlertHeadline: string;
  readonly activeAlertId: string;
  readonly activeAlertInstruction: string;
  readonly showAlertToast: boolean;

  constructor(apiResponse: any) {
    try {
      if (apiResponse && Array.isArray(apiResponse.features) && apiResponse.features.length > 0) {
        this.flowStatus = 'SUCCESS';
        this.flowStatusMessage = apiResponse.title;
      } else {
        this.flowStatus = 'FAILURE';
        this.flowStatusMessage = 'Unable to parse api response';
      }
      if (this.flowStatus === 'SUCCESS') {
        const tempAllActiveWeatherAlerts: WeatherAlertInfo[] = this.parseApiResponse(apiResponse);
        this.allActiveWeatherAlerts = this.filterDuplicateAlerts(tempAllActiveWeatherAlerts);
        this.activeAlertDescription = this.descriptionForToast(this.allActiveWeatherAlerts);
        // the below variables are set to 0 index of array because that will be up-to-date active alert
        this.activeAlertEvent = this.allActiveWeatherAlerts && this.allActiveWeatherAlerts[0] && this.allActiveWeatherAlerts[0].event ? this.allActiveWeatherAlerts[0].event : '';
        this.activeAlertHeadline = this.allActiveWeatherAlerts && this.allActiveWeatherAlerts[0] && this.allActiveWeatherAlerts[0].headline ? this.allActiveWeatherAlerts[0].headline : '';
        this.activeAlertId = this.allActiveWeatherAlerts && this.allActiveWeatherAlerts[0] && this.allActiveWeatherAlerts[0].id ? this.allActiveWeatherAlerts[0].id : '';
        this.activeAlertInstruction = this.allActiveWeatherAlerts && this.allActiveWeatherAlerts[0] && this.allActiveWeatherAlerts[0].instruction ? this.allActiveWeatherAlerts[0].instruction : '';
        this.showAlertToast = Array.isArray(this.allActiveWeatherAlerts) && this.allActiveWeatherAlerts.length > 0;
      }
    } catch (e) {
      this.flowStatus = 'FAILURE';
      this.flowStatusMessage = e;
    }
  }

  /* ***** Below is parsing that should be done on a backend but mocked here ***** */

  /**
   * @description - method to semi-mock backend parsing of National Weather Service Active Alerts API
   * @param {any} apiResponse - api response from National Weather Service Active Alerts API
   * @returns {WeatherAlertInfo[]} - parsed apiResponse for use in UI
   */
  private parseApiResponse(apiResponse: any): WeatherAlertInfo[] {
    const tempAllActiveWeatherAlertsArray: WeatherAlertInfo[] = [];
    try {
      if (apiResponse && Array.isArray(apiResponse.features) && apiResponse.features.length > 0) {
        for (let apiAlert of apiResponse.features) {
          const alertsToParse: WeatherAlertInfo = apiAlert && apiAlert.properties ? apiAlert.properties : null;
          const tempWeatherAlert: WeatherAlertInfo = {
            description: alertsToParse.description ? alertsToParse.description : '',
            event: alertsToParse.event ? alertsToParse.event : '',
            headline: alertsToParse.headline ? alertsToParse.headline : '',
            id: alertsToParse.id ? alertsToParse.id.slice(-5) : '',  // We only need the last 5 digits of the alert to find updates to alert
            instruction: alertsToParse.instruction ? alertsToParse.instruction : '',
            sent: alertsToParse.sent ? alertsToParse.sent : '',
            severity: alertsToParse.severity ? alertsToParse.severity : ''
          }
          tempAllActiveWeatherAlertsArray.push(tempWeatherAlert);
        }
      }
      return tempAllActiveWeatherAlertsArray;
    } catch (error) {
      console.log(error);
      return tempAllActiveWeatherAlertsArray;
    }
  }

  /**
   * @description Loops through param alerts, and will return a new array containing only the newest alerts of each ID. Every alert sent out has a unique ID associated with it, and the last 5 characters, typically like 001.1, are the same for alerts that are an update for a previous alert. So if an alert is made for rain, it may be called 001.1. Then, if an alert is made to say the rain will be longer, that second alert will also have the ID 001.1. This method will only return that second alert, because it is the most recent for that unique ID.
   * @param {WeatherAlertInfo[]} alerts The full array of WeatherAlertInfo to be filtered down to the latest update of each alert.
   * @returns {WeatherAlertInfo[]} The filtered array of WeatherAlertInfo, which will only contain the latest update of each alert from the passed "alert" parameter.
   */
  private filterDuplicateAlerts(alerts: WeatherAlertInfo[]): WeatherAlertInfo[] {
    if (!alerts || !Array.isArray(alerts) || alerts.length === 0) {
      return [];
    }

    alerts = alerts.sort((a, b) => a.sent < b.sent ? 1 : -1); // Sort the alerts by the time they were sent from newest to oldest
    let filteredAlerts: WeatherAlertInfo[] = [];
    let alertIdsThatHaveBeenAdded: string[] = [];
    for (let alert of alerts) {
      if (alert && alert.id && alertIdsThatHaveBeenAdded.indexOf( alert.id ) === -1) {
        alertIdsThatHaveBeenAdded.push( alert.id ); // Always add the newest
        if (this.shouldAlertBeShown(alert)) {
          filteredAlerts.push( alert );
        }
      }
    }
    return filteredAlerts;
  }

  /**
   * @description Will check if the alert is worth showing to the user by seeing if the alert severity is Moderate, Severe, or Extreme.
   * @param {WeatherAlertInfo} alert The alert to inspect
   * @returns {boolean} Returns if the alert is worth showing
   */
  private shouldAlertBeShown(alert: WeatherAlertInfo): boolean {
    return alert && alert.severity && (alert.severity.includes('Severe') || alert.severity.includes('Moderate') || alert.severity.includes('Extreme'));
  }

  /**
   * @description - method to parse through description string and return value for ui consumption, returning the headline is priority so as to limit the size of toast on ui. next is parsing through the description
   * @param {WeatherAlertInfo[]} allActiveWeatherAlerts - parsed active weather alert(s)
   * @returns {string} - parsed string to send to ui to show as active alert description
   */
  private descriptionForToast(allActiveWeatherAlerts: WeatherAlertInfo[]): string {
    let returnedDescription: string = '';
    try {
      if (Array.isArray(allActiveWeatherAlerts) && allActiveWeatherAlerts.length > 0 && allActiveWeatherAlerts[0]) {
        const weatherAlert: WeatherAlertInfo = allActiveWeatherAlerts[0]; // setting to 0 index to use most recent alert or the only active alert
        if (weatherAlert.headline) {
          returnedDescription = weatherAlert.headline;
        } else if (weatherAlert.description && weatherAlert.description.match(/WHAT/) && weatherAlert.description.match(/WHEN/)) {
          const tempDescriptionObject: {[key: string]: string} = this.parseWeatherDescription(weatherAlert.description);
          returnedDescription = `${tempDescriptionObject['WHEN']} ${tempDescriptionObject['WHAT']}`;
        } else if (weatherAlert.description) {
          returnedDescription = weatherAlert.description;
        } else if (weatherAlert.event && weatherAlert.sent && weatherAlert.severity) {
          const dateTimeForToast: string = moment(weatherAlert.sent).calendar(); // returns time formatted as 'Today at 9:48 AM'
          returnedDescription = `${weatherAlert.severity} ${weatherAlert.event} issued at ${dateTimeForToast}`;
        } else {
          returnedDescription = 'Weather Alert Info Unknown';
        }
      }
      return returnedDescription;
    } catch (e) {
      console.log(e);
      return returnedDescription;
    }
  }

  /**
     * @description Takes in a description from the weather api, and parses out each block of data. The type of description, such as WHAT, WHERE, WHEN will be set as the to the output, and the corresponding text for each part will be set as the value. For example, an output may look like { 'WHAT': 'The weather is bad.', 'WHEN': 'Later tonight' }
     * @param desc The weather description from the api
     * @returns - {[key: string]: string} Returns an object where the key is the WHAT/WHEN/WHERE/etc of the description, and the value is the corresponding text.
     */
   private parseWeatherDescription(desc: string): {[key: string]: string} {
    desc = desc.replace( /\n/g , ' '); // get rid of all new lines
    desc = desc.replace( /\s{2,}/g , ' '); // replace any groupings of spaces with just 1 space
    let mainParts: string[] = desc.split('*');
    mainParts.splice(0,1); // get rid of the first element, as the description will start with '*' so the first element is empty
    let returnedObject: {[key: string]: string} = {};
    for (let part of mainParts) {
      if (!part) {continue}; // ensure no elements are broke
      let subParts: string[] = part.split('...'); // split each description into the type and text, such as 'WHAT' and 'The weather is bad.' respectively
      if (!subParts || !Array.isArray(subParts) || subParts.length < 2 || !subParts[0] || !subParts[1]) { return; } // Ensure we have usable data
      returnedObject[subParts[0].trim()] = subParts[1].trim(); // store the type as the key (such as WHAT) and the description as the value
    }
    return returnedObject;
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
 export interface WeatherAlertInfo {
    id?: string;
    event?: string;
    headline?: string;
    description?: string;
    instruction?: string;
    sent?: string;
    onset?: string;
    expires?: string;
    ends?: string;
    status?: string;
    messageType?: string;
    category?: string;
    severity?: string;
    certainty?: string;
    urgency?: string;
    response?: string;
}
