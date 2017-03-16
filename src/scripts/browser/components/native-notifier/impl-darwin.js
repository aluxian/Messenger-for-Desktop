import $ from 'nodobjc';

import BaseNativeNotifier from 'browser/components/native-notifier/base';

/* eslint-disable babel/new-cap */
class DarwinNativeNotifier extends BaseNativeNotifier {

  constructor () {
    super();

    // Flag that this notifier has been implemented
    this.isImplemented = true;

    // Obj-C setup
    $.framework('Foundation');
    this.pool = $.NSAutoreleasePool('alloc')('init');

    // Get the notification center
    this.center = $.NSUserNotificationCenter('defaultUserNotificationCenter');

    // Create a notifications delegate
    this.Delegate = $.NSObject.extend(global.manifest.name + 'NotificationDelegate');
    this.Delegate.addMethod('userNotificationCenter:didActivateNotification:',
      [$.void, [this.Delegate, $.selector, $.id, $.id]], ::this.didActivateNotification);
    this.Delegate.addMethod('userNotificationCenter:shouldPresentNotification:',
      ['c', [this.Delegate, $.selector, $.id, $.id]], ::this.shouldPresentNotification);
    this.Delegate.register();

    // Set the delegate
    this.delegate = this.Delegate('alloc')('init');
    this.center('setDelegate', this.delegate);
  }

  shouldPresentNotification (self, cmd, center, notif) {
    log('shouldPresentNotification', notif('identifier'), 'true');
    return true;
  }

  didActivateNotification (self, cmd, center, notif) {
    const type = parseInt(notif('activationType').toString(), 10);
    const identifier = notif('identifier').toString();
    const tag = identifier.split(':::')[0];

    const payload = {
      tag,
      type: DarwinNativeNotifier.ACTIVATION_TYPES[type],
      identifier
    };

    if (payload.type === 'replied') {
      payload.response = notif('response');
      if (payload.response) {
        payload.response = payload.response.toString().replace('{\n}', '');
      }
    }

    log('didActivateNotification', JSON.stringify(payload));
    this.emit('notif-activated-' + identifier, payload);
    this.emit('notif-activated', payload);
  }

  fireNotification ({title, subtitle, body, tag = title, canReply, icon, onClick, onCreate}) {
    const identifier = tag + ':::' + Date.now();
    const data = {title, subtitle, body, tag, canReply, onClick, onCreate, identifier};

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
      notification('setContentImage', contentImage);
    }

    // Deliver
    log('delivering notification', JSON.stringify(data));
    this.center('deliverNotification', notification);

    // Click callback
    if (onClick) {
      this.on('notif-activated-' + identifier, onClick);
    }

    // Creation callback
    if (onCreate) {
      onCreate(data);
    }
  }

  removeNotification (identifier) {
    const deliveredNotifications = this.center('deliveredNotifications');
    for (let i = 0; i < deliveredNotifications('count'); i++) {
      const deliveredNotif = deliveredNotifications('objectAtIndex', $(i)('unsignedIntValue'));
      const deliveredIdentifier = deliveredNotif('identifier');
      if (deliveredIdentifier && deliveredIdentifier.toString() === identifier) {
        log('removing notification', identifier, deliveredNotif);
        this.center('removeDeliveredNotification', deliveredNotif);
        break;
      }
    }
  }

}

export default DarwinNativeNotifier;
