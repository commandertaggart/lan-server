/// <reference types="node" />
import * as net from 'net';
import { EventEmitter } from 'events';
import { Message } from './messages/Message';
export declare class LANConnection extends EventEmitter {
    _socket: net.Socket;
    constructor(socket: net.Socket);
    private handleSocketData(data);
    send(message: Message): void;
    close(): void;
}
