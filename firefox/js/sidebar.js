import { OPSGENIE_DOMAIN, defaultSettings } from "./lib/shared.js";
import {h, app, text} from "./lib/hyperapp.js";
import {
    body, main, article, section, aside,
    table, thead, tbody, tfoot, tr, th, td,
    ul, li, nav, form, h1, h2, p, a, span, img, input, fieldset, label, legend, details, summary
} from "./lib/hyperapp.html.js";
import { Promisable, Spread } from "./lib/promisable.js";

const Priority = {
	P1: 2,
	P2: 1,
	P3: 0,
	P4: 0,
	P5: 0
};

const g = (m) => browser.i18n.getMessage(m);
const gt = (m) => text(g(m));

const api = () => browser.storage.session.get("api");

const description = (message) => (
	message = message.split(":"),
	message[message.length - 1].trim()
);

const onUpdate = ({...state}) => [
	{...state},
	[Promisable("api"), api()]
];

const onConfigChg = (key) => ({settings, ...state}, value) => (
	settings = {...settings, [key]: value},
	browser.storage.sync.set(settings),
	{
		...state,
		settings: {
			...settings,
			[key]: value
		}
	}
);

const event = fn => (state, e) => [fn, e.target.value];

const query = ({api}) =>
	api.query.data.length &&
	ul([
		...api.query.data
			.sort((a, b) => Priority[a.priority] < Priority[b.priority])
			.map(
				alert =>
					li([
						a({
							href:"https://duckduckgo.com/",
							"data-tooltip": description(alert.message),
							"data-flow": "bottom"
						}, [
							span({class:{badge: true, yes: alert.acknowledged}}, [
								text("ACK")
							]),
							span({class:{badge: true, yes: true}}, [
								text(alert.count + "x")
							]),
							span({class:"message"}, [
								text(alert.message)
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

const render = ({api, settings}) =>
	settings &&
	main([
		details([
			fieldset([
				summary([
					gt("settings")
				]),

				input({type:"button", value:g("refresh"), onclick:onUpdate}, [
					gt("refresh")
				]),

				label([
					gt("interval"),
					input({
						type: "number",
						min: 1000,
						max: 60000,
						value: settings.timeInterval,
						oninput:event(onConfigChg("timeInterval"))
					})
				]),

				label([
					gt("enable"),
					input({
						type: "checkbox",
						checked: settings.enabled,
						oninput:event(onConfigChg("enabled"))
					})
				])
			])
		]),

		h1([
			span([text("Opsgenie Alerts")])
		]),

		api && api.time &&
		p({class: "tiny"}, [
			text(api.time.toUTCString())
		]),

		api &&
		(
			(api.error && error({api, settings})) ||
			(api.query && query({api, settings}))
		)
	]);

const dispatch = app({
	init: [
		{settings: {...defaultSettings}},
		[Promisable("settings"), browser.storage.sync.get(defaultSettings)]
	],

	view: render,
	node: document.getElementsByTagName("main")[0]
});

browser.storage.session.onChanged.addListener(
	async () => {
		dispatch(onUpdate);
	}
);

browser.runtime.sendMessage({
	action: "start"
});
