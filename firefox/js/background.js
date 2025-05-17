import {defaultSettings, opsgenieDomain, OPSGENIE_DOMAIN, url, alert, ack} from "./lib/shared.js";
import {mock} from "./mock.js";

browser.runtime.onInstalled.addListener(async details => {
    if (details.reason === 'install') {
        browser.runtime.openOptionsPage();
    }
});

browser.runtime.onMessage.addListener((msg, sender, respond) => {
    (async () => {
        const settings = await browser.storage.sync.get(defaultSettings);
        switch(msg.action) {
            case "ack":
                return post_ack(settings, msg.id, msg.note);

			case "options":
				browser.runtime.openOptionsPage();
				return;

            case "reload":
                return reload(settings);

            case "start":
                return start(settings);

            case "update":
                return respond(
                    update(settings)
                );

            default:
                // handle errors...
                return null;
        }
    })();
});

browser.storage.sync.onChanged.addListener(
    async (changes) => {
        if (changes.settings && changes.settings.newValue) {
			browser.runtime.sendMessage({
				action: "reload"
			});
        }
    }
)

const start = async (settings) => {
	let id = browser.storage.session.get("intervalID");
	if (id)
		clearInterval(id);

    id = setInterval(
        update,
        settings.timeInterval < 5000?
			settings.timeInterval < 60 && settings.timeInterval > 0?
				settings.timeInterval * 1000:
				5000:
				5000,
        settings
    );

	console.log("start", id);
    browser.storage.session.set({"intervalID": id});
};

const reload = async (settings) => {
    start(settings);
};

const query = json => {
    const data = json.data;

    return {
        took: parseFloat(json.took),
        data: json.data.map(alert => ({
            ...alert,
            count: parseInt(alert.count),
            lastOccurredAt: new Date(alert.lastOccuredAt),
            createdAt: new Date(alert.createdAt),
            updatedAt: new Date(alert.updatedAt)
        }))
    };
};

const api = async (settings, json) => {
    await browser.storage.session.set({
        api: {
            query: query(json),
            error: null,
            time: new Date(),
            ogUrl: url(settings)
        }
    });
};

const error = async (settings, message, placeholders) => {
    console.log("error", message, placeholders);
    console.log("\ti18n", browser.i18n.getMessage(message, placeholders));
    return await browser.storage.session.set({
        api: {
            query: null,
            error: browser.i18n.getMessage(message, placeholders),
            time: new Date()
        }
    });
};

const get = async (settings) => {
    return mock();
    return await fetch(url(settings), {
        credentials: "omit",
        cache: "no-store",
        redirect: "error",
        referrerPolicy: "no-referrer",

        headers: {
            "Accept": "application/json",
            "Authorization": `GenieKey ${settings.apiKey}`
        }
    });
};

const post_ack = async (settings, id, note) => {
    mock_ack();

    /*return await fetch(ack(settings, id), {
        method: "POST",
        body: JSON.stringify({
            user: `${settings.username}`,
            source: `User actions`,
            note
        }),
        credentials: "omit",
        cache: "no-store",
        redirect: "error",
        referrerPolicy: "no-referrer",

        headers: {
            "Content-Type": "application/json"
            "Authorization": `GenieKey ${settings.apiKey}`
        }
    });*/
};

const update = async (settings) => {
    if (!settings.enabled)
        return;

    let response;

    try {
        response = await get(settings);
    } 
    
    catch(exc) {
        return error(settings, "networkFailure", [settings.timeInterval, exc]);
    }

    if (!response.ok || response.status != 200) {
        let body;
        let msg;
        
        try {
            body = await response.json();
            msg = body.message;
        }

        catch(exc) {
            msg = await response.text();
        }

        return error(settings, "clientFailue", [settings.timeInterval, msg]);
    }

    try {
        return api(settings, await response.json());
    }

    catch(exc) {
        return error(settings, "clientFailure", [settings.timeInterval, exc]);
    }
};
