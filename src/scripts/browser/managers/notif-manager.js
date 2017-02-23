import EventEmitter from 'events';

class NotifManager extends EventEmitter {

  constructor () {
    super();
    this.unreadCount = ''; // number as string; empty string means 0
  }

}

export default NotifManager;
