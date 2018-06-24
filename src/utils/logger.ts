export function log(message: string) {
  if (window && window['console']) {
    const cs = window['console'];
    if (cs) {
      cs.log(`${new Date()}: ${message} `);
    }
  }
}
