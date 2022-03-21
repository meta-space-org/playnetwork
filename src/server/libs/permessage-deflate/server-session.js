import Session from './session.js';

import common from './common.js';

class ServerSession extends Session {
    constructor(options, params) {
        super(options);
        this._params = params;
    }

    generateResponse() {
        const response = {};

        // https://tools.ietf.org/html/rfc7692#section-7.1.1.1
        this._ownContextTakeover = !this._acceptNoContextTakeover && !this._params.server_no_context_takeover;

        if (!this._ownContextTakeover) response.server_no_context_takeover = true;

        // https://tools.ietf.org/html/rfc7692#section-7.1.1.2
        this._peerContextTakeover = !this._requestNoContextTakeover && !this._params.client_no_context_takeover;

        if (!this._peerContextTakeover) response.client_no_context_takeover = true;

        // https://tools.ietf.org/html/rfc7692#section-7.1.2.1
        this._ownWindowBits = Math.min(this._acceptMaxWindowBits || common.MAX_WINDOW_BITS, this._params.server_max_window_bits || common.MAX_WINDOW_BITS);

        // In violation of the spec, Firefox closes the connection if it does not
        // send server_max_window_bits but the server includes this in its response
        if (this._ownWindowBits < common.MAX_WINDOW_BITS && this._params.server_max_window_bits) response.server_max_window_bits = this._ownWindowBits;

        // https://tools.ietf.org/html/rfc7692#section-7.1.2.2
        let clientMax = this._params.client_max_window_bits;
        if (clientMax) {
            if (clientMax === true) clientMax = common.MAX_WINDOW_BITS;
            this._peerWindowBits = Math.min(this._requestMaxWindowBits || common.MAX_WINDOW_BITS, clientMax);
        } else {
            this._peerWindowBits = common.MAX_WINDOW_BITS;
        }

        if (this._peerWindowBits < common.MAX_WINDOW_BITS) response.client_max_window_bits = this._peerWindowBits;

        return response;
    }

    static validParams(params) {
        if (!common.validParams(params)) return false;

        if (Object.hasOwnProperty.call(params, 'client_max_window_bits')) {
            if ([true].concat(common.VALID_WINDOW_BITS).indexOf(params.client_max_window_bits) < 0) return false;
        }
        return true;
    }
}

export default ServerSession;
