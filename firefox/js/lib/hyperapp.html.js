import { h } from "./hyperapp.js";

const EMPTY_ARR = [];
const EMPTY_OBJ = {};

/*const tag = tag => (
props = EMPTY_OBJ,
children = props.tag != null || Array.isArray(props) ? props : EMPTY_ARR) =>
h(tag, props === children ? EMPTY_OBJ : props, children);*/

const tag = tag => 
    (
        props = {}, 
        children = props.tag != null || Array.isArray(props)? props: []
    ) => 
        h(
            tag, 
            props === children? {}: props,
            children
        );

export const a = tag("a");
export const b = tag("b");
export const i = tag("i");
export const p = tag("p");
export const q = tag("q");
export const s = tag("s");
export const br = tag("br");
export const dd = tag("dd");
export const dl = tag("dl");
export const dt = tag("dt");
export const em = tag("em");
export const h1 = tag("h1");
export const h2 = tag("h2");
export const h3 = tag("h3");
export const h4 = tag("h4");
export const h5 = tag("h5");
export const h6 = tag("h6");
export const hr = tag("hr");
export const li = tag("li");
export const ol = tag("ol");
export const rp = tag("rp");
export const rt = tag("rt");
export const td = tag("td");
export const th = tag("th");
export const tr = tag("tr");
export const ul = tag("ul");
export const bdi = tag("bdi");
export const bdo = tag("bdo");
export const col = tag("col");
export const del = tag("del");
export const dfn = tag("dfn");
export const div = tag("div");
export const img = tag("img");
export const ins = tag("ins");
export const kbd = tag("kbd");
export const map = tag("map");
export const nav = tag("nav");
export const pre = tag("pre");
export const rtc = tag("rtc");
export const sub = tag("sub");
export const sup = tag("sup");
export const svg = tag("svg");
export const wbr = tag("wbr");
export const abbr = tag("abbr");
export const area = tag("area");
export const body = tag("body");
export const cite = tag("cite");
export const code = tag("code");
export const data = tag("data");
export const form = tag("form");
export const main = tag("main");
export const mark = tag("mark");
export const ruby = tag("ruby");
export const samp = tag("samp");
export const span = tag("span");
export const time = tag("time");
export const aside = tag("aside");
export const audio = tag("audio");
export const input = tag("input");
export const label = tag("label");
export const meter = tag("meter");
export const param = tag("param");
export const small = tag("small");
export const table = tag("table");
export const tbody = tag("tbody");
export const tfoot = tag("tfoot");
export const thead = tag("thead");
export const track = tag("track");
export const video = tag("video");
export const button = tag("button");
export const canvas = tag("canvas");
export const dialog = tag("dialog");
export const figure = tag("figure");
export const footer = tag("footer");
export const header = tag("header");
export const iframe = tag("iframe");
export const legend = tag("legend");
export const object = tag("object");
export const option = tag("option");
export const output = tag("output");
export const select = tag("select");
export const source = tag("source");
export const strong = tag("strong");
export const address = tag("address");
export const article = tag("article");
export const caption = tag("caption");
export const details = tag("details");
export const section = tag("section");
export const summary = tag("summary");
export const picture = tag("picture");
export const colgroup = tag("colgroup");
export const datalist = tag("datalist");
export const fieldset = tag("fieldset");
export const menuitem = tag("menuitem");
export const optgroup = tag("optgroup");
export const progress = tag("progress");
export const textarea = tag("textarea");
export const blockquote = tag("blockquote");
export const figcaption = tag("figcaption");

export { text } from "./hyperapp.js";
