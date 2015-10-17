import Menu from 'menu';
import EventEmitter from 'events';

class BaseMenu extends EventEmitter {

  /**
   * Build the menu based on a platform-specific template.
   */
  constructor(template) {
    super();

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

export default BaseMenu;
