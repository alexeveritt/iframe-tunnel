declare const enum Target {
    Client = 0,
    Host = 1
}


interface TunnelMessage {
    key: string;
    data?: string | object;
}

interface IQueueEvent {
    payload: string;
}
