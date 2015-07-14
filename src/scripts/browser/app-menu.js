import Menu from 'menu';
import EventEmitter from 'events';

class AppMenu extends EventEmitter {

  /**
   * Build a menu based on a platform-specific template.
   */
  constructor() {
    super();

    // Read the template json
    const template = require(`../../menus/${process.platform}.json`);

    // Set handlers and create the menu
    this.wireUpCommands(template);
    this.menu = Menu.buildFromTemplate(template);
  }

  /**
   * Make the menu of this instance the default.
   */
  makeDefault() {
    Menu.setApplicationMenu(this.menu);
  }

  /**
   * Create click handlers for menu entries that have a defined command.
   *
   * @param {Array} submenu
   */
  wireUpCommands(submenu) {
    submenu.forEach((item) => {
      if (item.command) {
        const existingOnClick = item.click;

        item.click = () => {
          this.emit(item.command, item);

          if (existingOnClick) {
            existingOnClick();
          }
        };
      }

      if (item.submenu) {
        this.wireUpCommands(item.submenu);
      }
    });
  }

}

export default AppMenu;
