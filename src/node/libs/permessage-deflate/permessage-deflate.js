import ClientSession from './client-session.js';
import ServerSession from './server-session.js';

import common from './common.js';

const VALID_OPTIONS = [
    'level',
    'memLevel',
    'strategy',
    'noContextTakeover',
    'maxWindowBits',
    'requestNoContextTakeover',
    'requestMaxWindowBits',
    'zlib'
];

const PermessageDeflate = {
    configure: function(options) {
        common.validateOptions(options, VALID_OPTIONS);
        const opts = this._options || {};
        for (const key in opts) options[key] = opts[key];
        return Object.create(this, { _options: { value: options } });
    },

    createClientSession: function() {
        return new ClientSession(this._options || {});
    },

    createServerSession: function(offers) {
        for (let i = 0, n = offers.length; i < n; i++) {
            if (ServerSession.validParams(offers[i]))
                return new ServerSession(this._options || {}, offers[i]);
        }
        return null;
    },

    name: 'permessage-deflate',
    type: 'permessage',
    rsv1: true,
    rsv2: false,
    rsv3: false
};

export default PermessageDeflate;
