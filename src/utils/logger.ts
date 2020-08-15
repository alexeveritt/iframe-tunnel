export function log(message: string) {
  const consoleProperty: string = 'console';
  if (window && window[consoleProperty]) {
    const cs = window[consoleProperty];
    if (cs) {
      cs.log(`${new Date()}: ${message} `);
    }
  }
}
