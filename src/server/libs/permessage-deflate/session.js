import { Buffer } from 'safe-buffer';
import zlib from 'zlib';

import common from './common.js';

import performance from '../performance.js';

class Session {
    constructor(options) {
        this._level = common.fetch(options, 'level', zlib.constants.Z_DEFAULT_COMPRESSION);
        this._memLevel = common.fetch(options, 'memLevel', zlib.constants.Z_DEFAULT_MEMLEVEL);
        this._strategy = common.fetch(options, 'strategy', zlib.constants.Z_DEFAULT_STRATEGY);

        this._acceptNoContextTakeover = common.fetch(options, 'noContextTakeover', false);
        this._acceptMaxWindowBits = common.fetch(options, 'maxWindowBits', undefined);
        this._requestNoContextTakeover = common.fetch(options, 'requestNoContextTakeover', false);
        this._requestMaxWindowBits = common.fetch(options, 'requestMaxWindowBits', undefined);

        this._queueIn = [];
        this._queueOut = [];

        this._zlib = common.fetch(options, 'zlib', zlib);
    }

    processIncomingMessage(message, callback) {
        if (!message.rsv1)
            return callback(null, message);
        if (this._lockIn)
            return this._queueIn.push([message, callback]);

        const inflate = this._getInflate();
        const chunks = [];
        let length = 0;
        const self = this;

        if (this._inflate)
            this._lockIn = true;

        let return_ = function(error, message) {
            return_ = function() { };

            inflate.removeListener('data', onData);
            inflate.removeListener('error', onError);
            if (!self._inflate)
                self._close(inflate);

            self._lockIn = false;
            const next = self._queueIn.shift();
            if (next)
                self.processIncomingMessage.apply(self, next);

            callback(error, message);
        };

        const onData = function(data) {
            chunks.push(data);
            length += data.length;
        };

        const onError = function(error) {
            return_(error, null);
        };

        inflate.on('data', onData);
        inflate.on('error', onError);

        inflate.write(message.data);
        inflate.write(Buffer.from([0x00, 0x00, 0xff, 0xff]));

        inflate.flush(function() {
            // override message data to have access to the uncompressed data without changes to driver
            message.data = {
                rawData: message.data,
                data: Buffer.concat(chunks, length)
            };

            // remove opcode to prevent websocket driver from crashing when parsing object as text
            message.opcode = null;
            return_(null, message);
        });
    }

    processOutgoingMessage(message, callback) {
        if (this._lockOut)
            return this._queueOut.push([message, callback]);

        const deflate = this._getDeflate();
        const chunks = [];
        let length = 0;
        const self = this;

        if (this._deflate)
            this._lockOut = true;

        let return_ = function(error, message) {
            return_ = function() { };

            deflate.removeListener('data', onData);
            deflate.removeListener('error', onError);
            if (!self._deflate)
                self._close(deflate);

            self._lockOut = false;
            const next = self._queueOut.shift();
            if (next)
                self.processOutgoingMessage.apply(self, next);

            callback(error, message);
        };

        const onData = function(data) {
            chunks.push(data);
            length += data.length;
        };

        const onError = function(error) {
            return_(error, null);
        };

        deflate.on('data', onData);
        deflate.on('error', onError);
        deflate.write(message.data);

        const onFlush = function() {
            const rawData = message.data;
            const data = Buffer.concat(chunks, length);
            message.data = data.slice(0, data.length - 4);

            performance.events.fire('deflateOut', rawData, message.data);

            message.rsv1 = true;
            return_(null, message);
        };

        if (deflate.params !== undefined)
            deflate.flush(zlib.constants.Z_SYNC_FLUSH, onFlush);
        else
            deflate.flush(onFlush);
    }

    close() {
        this._close(this._inflate);
        this._inflate = null;

        this._close(this._deflate);
        this._deflate = null;
    }

    _getInflate() {
        if (this._inflate)
            return this._inflate;

        const windowBits = Math.max(this._peerWindowBits, common.MIN_WINDOW_BITS);
        const inflate = this._zlib.createInflateRaw({ windowBits: windowBits });

        if (this._peerContextTakeover)
            this._inflate = inflate;
        return inflate;
    }

    _getDeflate() {
        if (this._deflate)
            return this._deflate;

        const windowBits = Math.max(this._ownWindowBits, common.MIN_WINDOW_BITS);

        const deflate = this._zlib.createDeflateRaw({
            windowBits: windowBits,
            level: this._level,
            memLevel: this._memLevel,
            strategy: this._strategy
        });

        const flush = deflate.flush;

        // This monkey-patch is needed to make Node 0.10 produce optimal output.
        // Without this it uses Z_FULL_FLUSH and effectively drops all its context
        // state on every flush.
        if (deflate._flushFlag !== undefined && deflate.params === undefined)
            deflate.flush = function(callback) {
                const ws = this._writableState;
                if (ws.ended || ws.ending || ws.needDrain) {
                    flush.call(this, callback);
                } else {
                    this._flushFlag = zlib.constants.Z_SYNC_FLUSH;
                    this.write(Buffer.alloc(0), '', callback);
                }
            };

        if (this._ownContextTakeover)
            this._deflate = deflate;
        return deflate;
    }

    _close(codec) {
        if (!codec || !codec.close)
            return;
        try {
            codec.close();
        } catch (error) { }
    }
}

export default Session;
