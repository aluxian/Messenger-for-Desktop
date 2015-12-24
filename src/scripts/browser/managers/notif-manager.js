import EventEmitter from 'events';

class NotifManager extends EventEmitter {

  constructor() {
    super();
    this.unreadCount = 0;
  }

}

export default NotifManager;
