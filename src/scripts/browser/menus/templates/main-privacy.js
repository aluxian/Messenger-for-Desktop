import prefs from 'browser/utils/prefs';

export default {
  label: 'Privacy',
  submenu: [{
    type: 'checkbox',
    label: 'Report App Stats and Crashes',
    checked: prefs.get('analytics-track'),
    click (menuItem) {
      prefs.set('analytics-track', menuItem.checked);
    }
  }, {
    type: 'separator'
  }, {
    type: 'checkbox',
    label: 'Block Sending Seen Status',
    checked: prefs.get('block-indicator-seen'),
    click (menuItem) {
      prefs.set('block-indicator-seen', menuItem.checked);
    }
  }, {
    type: 'checkbox',
    label: 'Block Sending Typing Status',
    checked: prefs.get('block-indicator-typing'),
    click (menuItem) {
      prefs.set('block-indicator-typing', menuItem.checked);
    }
  }]
};
