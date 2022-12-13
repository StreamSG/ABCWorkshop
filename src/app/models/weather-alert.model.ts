export class WeatherAlertResponse {
  readonly flowStatus: string;
  readonly flowStatusMessage: string;
  readonly allActiveWeatherAlerts: WeatherAlertInfo[];
  readonly activeAlertDescription: string;
  readonly activeAlertEvent: string;
  readonly activeAlertHeadline: string;
  readonly activeAlertId: string;
  readonly activeAlertInstruction: string;

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
        const tempAllActiveWeatherAlerts: WeatherAlertInfo[] = this.parseApiResponse(apiResponse);
        console.log('returned array', tempAllActiveWeatherAlerts)
        this.allActiveWeatherAlerts = this.filterDuplicateAlerts(tempAllActiveWeatherAlerts);
        console.log('all active', this.allActiveWeatherAlerts)
        this.activeAlertDescription = this.descriptionForToast(this.allActiveWeatherAlerts);
        // the below variables are set to 0 index of array because that will be up-to-date active alert
        this.activeAlertEvent = this.allActiveWeatherAlerts && this.allActiveWeatherAlerts[0] && this.allActiveWeatherAlerts[0].event ? this.allActiveWeatherAlerts[0].event : '';
        this.activeAlertHeadline = this.allActiveWeatherAlerts && this.allActiveWeatherAlerts[0] && this.allActiveWeatherAlerts[0].headline ? this.allActiveWeatherAlerts[0].headline : '';
        this.activeAlertId = this.allActiveWeatherAlerts && this.allActiveWeatherAlerts[0] && this.allActiveWeatherAlerts[0].id ? this.allActiveWeatherAlerts[0].id : '';
        this.activeAlertInstruction = this.allActiveWeatherAlerts && this.allActiveWeatherAlerts[0] && this.allActiveWeatherAlerts[0].instruction ? this.allActiveWeatherAlerts[0].instruction : '';
      }
    } catch (e) {
      console.log({e})
      this.flowStatus = 'FAILURE';
      this.flowStatusMessage = 'Unable to parse API response';
    }
  }

  /**
   * @description - method to semi-mock backend parsing of National Weather Service Active Alerts API
   * @param {any} apiResponse - api response from National Weather Service Active Alerts API
   * @returns {WeatherAlertInfo[]} - parsed apiResponse for use in UI
   */
  private parseApiResponse(apiResponse: any): WeatherAlertInfo[] {
    const tempAllActiveWeatherAlertsArray: WeatherAlertInfo[] = [];
    if (apiResponse && Array.isArray(apiResponse.features) && apiResponse.features.length > 0) {
      for (let apiAlert of apiResponse.features) {
        const alertsToParse: WeatherAlertInfo = apiAlert && apiAlert.properties ? apiAlert.properties : null;
        let tempWeatherAlert: WeatherAlertInfo = {
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
  }

  private filterDuplicateAlerts(alerts: WeatherAlertInfo[]): WeatherAlertInfo[] {
    console.log({alerts})
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
    return alert && alert.severity && (alert.severity.includes('Severe') || alert.severity.includes('Moderate') || alert.severity.includes('Extreme'));
  }

  /**
   * @description - method to parse through description string and return value for ui consumption
   * @param {WeatherAlertInfo[]} allActiveWeatherAlerts - parsed active weather alert(s)
   * @returns {string} - parsed string to send to ui to show as active alert description
   */
  private descriptionForToast(allActiveWeatherAlerts: WeatherAlertInfo[]): string {
    let returnedDescription: string;
    if (Array.isArray(allActiveWeatherAlerts) && allActiveWeatherAlerts.length > 0) {
      const weatherAlert: WeatherAlertInfo = allActiveWeatherAlerts[0]; // setting to 0 index to use most recent alert
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
    return '';
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
