import {h, app, text} from "./hyperapp.js";

const Spread = key => (state, data) =>
    "_" == key?
        state:
        ({
            ...state,
            [key]:
                Array.isArray(data)?
                    [...data]:
                    {...data}
        });

// Payload: { action(state, data), payload }
const Promisable = (key, delay=0) => (dispatch, payload) =>
    new Promise(r => setTimeout(r, delay))
    .then(() =>
        Array.isArray(payload)? 
            payload[1].then(d => dispatch(payload[0], d)):
            "action" in payload && "promise" in payload?
                payload.promise.then(d => dispatch(payload.action, d)):
                payload.then(d => dispatch(Spread(key), key in d? d[key]: d)));

export { Spread, Promisable };
