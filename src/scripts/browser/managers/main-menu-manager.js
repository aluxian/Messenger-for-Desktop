import template from '../menus/main';

import Menu from 'menu';
import EventEmitter from 'events';

class MainMenuManager extends EventEmitter {

  create() {
    if (!this.menu) {
      this.menu = Menu.buildFromTemplate(template);
      log('app menu created');
    }
  }

  set() {
    if (this.menu) {
      Menu.setApplicationMenu(this.menu);
      log('app menu set');
    }
  }

}

export default MainMenuManager;
