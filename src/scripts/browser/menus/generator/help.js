import $ from '../expressions';

export function helpLink(label, url, action) {
  return {
    label: label,
    click: $.all(
      $.openUrl(url),
      $.analytics.trackEvent('Menu', 'Link', action)
    )
  };
}

export function helpDonate(name, url, action) {
  return {
    label: 'Donate ' + name,
    click: $.all(
      $.openUrl(url),
      $.analytics.trackEvent('Menu', 'Link', 'donate_' + action),
      $.analytics.trackGoal(1, 1)
    )
  };
}
