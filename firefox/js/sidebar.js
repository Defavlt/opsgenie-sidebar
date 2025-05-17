import { OPSGENIE_DOMAIN, defaultSettings, alert } from "./lib/shared.js";
import {h, app, text} from "./lib/hyperapp.js";
import {
    body, main, article, section, aside,
    table, thead, tbody, tfoot, tr, th, td,
    ul, li, nav, form, h1, h2, p, a, span, img, input, fieldset, label, legend, details, summary
} from "./lib/hyperapp.html.js";
import { Promisable, Spread } from "./lib/promisable.js";
import { mock_ui, mock_ack } from "./mock.js";

const Priority = {
    P1: 2,
    P2: 1,
    P3: 0,
    P4: 0,
    P5: 0
};

const Highlights = {
    2: "red",
    1: "yellow",
    0: "green"
};

const Status = {
	true: "RUNNING",
	false: "STOPPED"
}

const g = (m) => m;//browser.i18n.getMessage(m);
const gt = (m) => text(g(m));

const api = () => mock_ui(); //browser.storage.session.get("api");
const settings = async () => defaultSettings; //browser.storage.sync.get(defaultSettings);

const description = (message) => message;

const onUpdate = ({...state}) => [
    {...state},
    [Promisable("settings"), settings()],
    [Promisable("api"), api()]
];

const onOptions = ({...state}) => (
    //browser.runtime.sendMessage({ action: "options" }),
    {...state}
);

const start = ({status, ...state}) => (
    /*browser.runtime.sendMessage({
        action: "start"
    }),*/
    {...state, status:!status}
);

const onConfigChg = (key) => ({settings, ...state}, value) => (
    settings = {...settings, [key]: value},
    //browser.storage.sync.set(settings),
    {
        ...state,
        settings
    }
);

const ack = (settings, id, value) => ({api, ...state}) => (
	/*browser.runtime.sendMessage({
		action: "ack",
		id,
		note: "Action executed via Alert API"
	})*/

	mock_ack(settings, id, "Action executed via Alert API"),
	api.query.data
		.find(item => item.id == id)
		.acknowledged = !value,
	{ ...state, api: { ...api } }
);

const event = fn => (state, e) => [fn, e.target.value];

const query = ({api, settings}) =>
    api.query.data.length &&
    ul([
        ...api.query.data
            .sort((a, b) => Priority[a.priority] < Priority[b.priority])
            .map(
                item =>
                    li({class: "alert"}, [
                        p({}, [
							span({onclick:ack(settings, item.id, item.acknowledged), class: {badge:true, yes: item.acknowledged, action: true}}, [
								text("ACK")
							]),
							span({class:{badge: true, mono: true, [Highlights[Priority[item.priority]]]: true}}, [
								text(item.priority)
							]),
                            span({class:{badge: true, yes: true}}, [
								item.count > 9?
									text(`>9`):
									text(`${item.count}x`)
                            ]),
                            a({
								class: "message",
								href: alert(settings, item.id),
								target: "_blank",
								"data-tooltip": description(item.message),
								"data-flow": "bottom"
							}, [
                                text(item.message)
                            ])
                        ])
                    ])
            )
    ]) ||
    p([
        gt("noData")
    ])

const error = ({api}) =>
    ul([
        li([text(api.error)])
    ]);

const render = ({api, status, settings}) =>
    !settings && main([gt("loading")]) ||
    main([
        fieldset([
            summary([
                gt("Control")
            ]),

            section([
                input({type:"button", value:g("options"), onclick:onOptions}, [
                    gt("options")
                ]),

                input({type:"button", value:g("refresh"), onclick:onUpdate}, [
                    gt("refresh")
                ]),

                input({type:"button", value:g("start"), onclick:start}, [
                    gt("start")
                ])
            ]),
        ]),

        h1([
            span([text("Opsgenie Alerts")]),
			span({class: { status: true, on:status }}, [
				text(Status[status])
			])
        ]),

        api && api.time &&
        p({class: "tiny"}, [
            text(api.time.toLocaleString())
        ]),

        api &&
        (
            (api.error && error({api, settings})) ||
            (api.query && query({api, settings}))
        )
    ]);

const dispatch = app({
    init: [
        {
			status: false
		},
        [Promisable("settings"), settings()]
    ],

    view: render,
    node: document.getElementsByTagName("main")[0]
});

/*
browser.storage.sync.onChanged.addListener(
    async () => {
        dispatch(onUpdate)
    }
);

browser.storage.session.onChanged.addListener(
    async () => {
        dispatch(onUpdate);
    }
);*/
