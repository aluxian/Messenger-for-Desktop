import prefs from 'browser/utils/prefs';
import files from 'common/utils/files';

export default {
  label: 'Theme',
  submenu: Object.keys(global.manifest.themes).map((theme, index) => ({
    type: 'radio',
    label: global.manifest.themes[theme],
    checked: prefs.get('theme') === theme,
    click (menuItem, browserWindow) {
      files.getThemeCss(theme)
        .then((css) => browserWindow.webContents.send('fwd-webview', 'apply-theme', css))
        .catch(logError);
      prefs.set('theme', theme);
    }
  }))
};
