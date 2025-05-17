export const OPSGENIE_DOMAIN = {
    "US": "opsgenie.com",
    "EU": "eu.opsgenie.com",
};

export const defaultSettings = {
    enabled: false,
    enableNotifications: false,
    enableAlertActions: true,
    region: 'EU',
    customerName: '',
    username: '',
    apiKey: '',
    query: '',
    timeInterval: 1,
    popupHeight: 300
};

export function opsgenieDomain(customerName) {
    const domainSuffix = customerName !== '' ? '.' : '';

    return `https://${customerName}${domainSuffix}app.opsgenie.com`;
};

export const url = (settings) => `https://api.${OPSGENIE_DOMAIN[settings.region]}/v2/alerts?limit=100&sort=createdAt&query=${encodeURI(settings.query)}`;

export const alert = (settings, guid) => `https://${settings.customerName}.app.${OPSGENIE_DOMAIN[settings.region]}/alert/detail/${guid}/details`;
export const ack = (settings, guid) => `https://${settings.customerName}.app.${OPSGENIE_DOMAIN[settings.region]}/alerts/${guid}/acknowledge`;
