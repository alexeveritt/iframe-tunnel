export function attachDOMMessageEvent(callback) {
  if (window) {
    const supportedEventListener = window.addEventListener
      ? 'addEventListener'
      : 'attachEvent';
    const eventListener = window[supportedEventListener];
    const messageEvent =
      supportedEventListener === 'attachEvent' ? 'onmessage' : 'message';

    eventListener(messageEvent, callback, false);
  }
}
