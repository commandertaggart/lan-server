/// <reference types="node" />
import * as net from 'net';
import { EventEmitter } from 'events';
import { LANConnection } from './LANConnection';
export declare class LANServerInfo {
    type: string;
    name: string;
    address: string;
    port: number;
    constructor(type: string, name: string, address: string, port: number);
    connect(callback: (connection: LANConnection) => void): void;
}
export declare class LANServer extends EventEmitter {
    _: {
        type: string;
        name: string;
        advertise: boolean;
        port: number;
        autostart: boolean;
        address: {
            port: number;
            family: string;
            address: string;
        };
    };
    _server: net.Server;
    constructor(type: string, options?: Object);
    start(): void;
    stop(): void;
    private _advertisingSocket;
    startAdvertising(): void;
    stopAdvertising(): void;
    private handleSearchPacket(data, remote);
    handleServerError(err: Error): void;
    handleServerConnection(socket: net.Socket): void;
    private static _searches;
    private static _searchTimer;
    private static _searchSocket;
    private static _searchNonce;
    static search(type: string, callback: (found: LANServerInfo) => void): void;
    static stopSearch(type?: string, callback?: (found: LANServerInfo) => void): void;
    private static searchInterval();
    private static handleSearchResult(data, remote);
    static advertisingPort: number;
}
