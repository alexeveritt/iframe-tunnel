export function packMessage(key: string, data?: string | object): string {
  const hasData = !!data;
  const isText = !hasData || typeof data === 'string';

  const packedObject: TunnelMessage = {
    key,
    hasData,
    isText,
    data
  };
  return JSON.stringify(packedObject);
}

export function unPackMessage(message: string): TunnelMessage {
  return JSON.parse(message) as TunnelMessage;
}
