export class WeTrackTicket {

  // Should this just be an interface?
  
  static TYPE = {
    FEATURE: 'feature',
    ISSUE: 'issue',
  };

  static STATUS = {
    PENDING: 'pending',
    ASSIGNED: 'assigned',
    INPROGRESS: 'inprogress',
    COMPLETE: 'complete',
    CANCELLED: 'cancelled',
  }
  
  constructor(
    // Definite parameters
    public title: string,
    public type: string,
    public description: string,
    public importance: string,
    public submitter: string,
    
    // Optional parameters
    public assignee = '',
    public creationDate = new Date(),
    public status = WeTrackTicket.STATUS.PENDING,
  ) {}
  

}