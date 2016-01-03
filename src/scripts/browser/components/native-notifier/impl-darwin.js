import manifest from '../../../../package.json';
import $ from 'nodobjc';

import BaseNativeNotifier from './base';

class DarwinNativeNotifier extends BaseNativeNotifier {

  constructor() {
    super();

    // Flag that this notifier has been implemented
    this.impl = true;

    // Obj-C imports
    $.framework('Foundation');

    // Get the notification center
    this.center = $.NSUserNotificationCenter('defaultUserNotificationCenter');

    // Create a notifications delegate
    this.Delegate = $.NSObject.extend(manifest.productName + 'NotificationDelegate');
    this.Delegate.addMethod('userNotificationCenter:didActivateNotification:',
      [$.void, [this.Delegate, $.selector, $.id, $.id]], ::this.didActivateNotification);
    this.Delegate.addMethod('userNotificationCenter:shouldPresentNotification:',
      ['c', [this.Delegate, $.selector, $.id, $.id]], ::this.shouldPresentNotification);
    this.Delegate.register();

    // Set the delegate
    this.delegate = this.Delegate('alloc')('init');
    this.center('setDelegate', this.delegate);
  }

  shouldPresentNotification(self, cmd, center, notif) {
    log('shouldPresentNotification', notif('identifier'), 'true');
    return true;
  }

  didActivateNotification(self, cmd, center, notif) {
    const type = parseInt(notif('activationType').toString(), 10);
    const identifier = notif('identifier').toString();
    const tag = identifier.split(':::')[0];

    const payload = {
      tag: tag,
      type: DarwinNativeNotifier.ACTIVATION_TYPES[type],
      identifier: identifier
    };

    if (payload.type == 'replied') {
      payload.response = notif('response');
      if (payload.response) {
        payload.response = payload.response.toString().replace('{\n}', '');
      }
    }

    log('didActivateNotification', payload);
    this.emit('notif-activated-' + tag, payload);
    this.emit('notif-activated', payload);
  }

  fireNotification({title, subtitle, body, tag = title, canReply, icon, onClick}) {
    const identifier = tag + ':::' + Date.now();

    // Create
    const notification = $.NSUserNotification('alloc')('init');
    notification('setTitle', $.NSString('stringWithUTF8String', title));
    notification('setIdentifier', $.NSString('stringWithUTF8String', identifier));
    notification('setHasReplyButton', !!canReply);

    if (subtitle) {
      const str = $.NSString('stringWithUTF8String', subtitle);
      notification('setSubtitle', str);
    }

    if (body) {
      const str = $.NSString('stringWithUTF8String', body);
      notification('setInformativeText', str);
    }

    if (icon) {
      const contentImageUrl = $.NSURL('URLWithString', $(icon));
      const contentImage = $.NSImage('alloc')('initByReferencingURL', contentImageUrl);
      notification('setContentImage', contentImage); // TODO: download icon in bg
    }

    // Deliver
    log('delivering notification', {title, subtitle, body, tag, canReply, onClick});
    this.center('deliverNotification', notification);

    // Click callback
    if (onClick) {
      this.on('notif-activated-' + tag, onClick);
    }
  }

}

export default DarwinNativeNotifier;
