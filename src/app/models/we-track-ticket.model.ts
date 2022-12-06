export class WeTrackTicket {

  // Should this just be an interface?

  public static STATIC_DATA = {
    TYPE: {
      FEATURE: 'feature',
      ISSUE: 'issue',
      IDEA: 'idea',
    },
    STATUS: {
      PENDING: 'pending',
      ASSIGNED: 'assigned',
      IN_PROGRESS: 'in-progress',
      COMPLETE: 'complete',
      CANCELLED: 'cancelled',
    },
    PRIORITY: {
      LOW: 'low',
      MEDIUM: 'medium',
      HIGH: 'high',
      URGENT: 'urgent',
    },
    TAGS: {
      
    }
  }
  
  public static readonly TYPE = {
    FEATURE: 'feature',
    ISSUE: 'issue',
    IDEA: 'idea',
  };
  
  public static STATUS = {
    PENDING: 'pending',
    ASSIGNED: 'assigned',
    IN_PROGRESS: 'in-progress',
    COMPLETE: 'complete',
    CANCELLED: 'cancelled',
  }

  public static PRIORITY = {
    LOW: 'low',
    MEDIUM: 'medium',
    HIGH: 'high',
    URGENT: 'urgent',
  }
  
  constructor(
    // Definite parameters
    public title: string,
    public type: string,
    public description: string,
    public importance: string,
    public submitter: string,
    
    // Optional parameters
    public assignee: string = '',
    public status: string = WeTrackTicket.STATIC_DATA.STATUS.PENDING,
    public creationDate: Date = new Date(),
    public editDate: Date = new Date(),
    public comments: Comment[] = [],
    public tags: string[] = [],
  ) {}
}

export interface Comment {
  name: string,
  comment: string,
  date: Date,
}