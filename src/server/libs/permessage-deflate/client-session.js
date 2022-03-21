import Session from './session.js';

import common from './common.js';

class ClientSession extends Session {
    generateOffer() {
        const offer = {};

        if (this._acceptNoContextTakeover) offer.client_no_context_takeover = true;

        if (this._acceptMaxWindowBits !== undefined) {
            if (common.VALID_WINDOW_BITS.indexOf(this._acceptMaxWindowBits) < 0) {
                throw new Error('Invalid value for maxWindowBits');
            }
            offer.client_max_window_bits = this._acceptMaxWindowBits;
        } else {
            offer.client_max_window_bits = true;
        }

        if (this._requestNoContextTakeover) offer.server_no_context_takeover = true;

        if (this._requestMaxWindowBits !== undefined) {
            if (common.VALID_WINDOW_BITS.indexOf(this._requestMaxWindowBits) < 0) {
                throw new Error('Invalid value for requestMaxWindowBits');
            }
            offer.server_max_window_bits = this._requestMaxWindowBits;
        }

        return offer;
    }

    activate(params) {
        if (!ClientSession.validParams(params)) return false;

        if (this._acceptMaxWindowBits && params.client_max_window_bits) {
            if (params.client_max_window_bits > this._acceptMaxWindowBits) return false;
        }

        if (this._requestNoContextTakeover && !params.server_no_context_takeover) return false;

        if (this._requestMaxWindowBits) {
            if (!params.server_max_window_bits) return false;
            if (params.server_max_window_bits > this._requestMaxWindowBits) return false;
        }

        this._ownContextTakeover = !(this._acceptNoContextTakeover || params.client_no_context_takeover);
        this._ownWindowBits = Math.min(this._acceptMaxWindowBits || common.MAX_WINDOW_BITS, params.client_max_window_bits || common.MAX_WINDOW_BITS);

        this._peerContextTakeover = !params.server_no_context_takeover;
        this._peerWindowBits = params.server_max_window_bits || common.MAX_WINDOW_BITS;

        return true;
    }

    static validParams(params) {
        if (!common.validParams(params)) return false;

        if (Object.hasOwnProperty.call(params, 'client_max_window_bits')) {
            if (common.VALID_WINDOW_BITS.indexOf(params.client_max_window_bits) < 0) return false;
        }
        return true;
    }
}

export default ClientSession;
