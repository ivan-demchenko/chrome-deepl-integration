import {
  GetClickedElementMsgResponse,
  SetClickedElementValueMsgResponse,
  TabMessagePayload,
} from "./types";

let clickedEl: HTMLInputElement = null;
const ALLOWED_TAGS = ["INPUT", "TEXTAREA"];

document.addEventListener(
  "contextmenu",
  (evt) => {
    const targetTagName = (evt.target as HTMLElement).tagName;
    if (ALLOWED_TAGS.indexOf(targetTagName) > -1)
      clickedEl = evt.target as HTMLInputElement;
  },
  true
);

chrome.runtime.onMessage.addListener(
  (request: TabMessagePayload, sender, sendResponse) => {
    if (request.type && request.type == "get-clicked-element") {
      sendResponse({ value: clickedEl.value } as GetClickedElementMsgResponse);
    }

    if (request.type && request.type == "set-clicked-element-value") {
      clickedEl.value = request.newValue;
      clickedEl = null;
      sendResponse({ done: true } as SetClickedElementValueMsgResponse);
    }
  }
);
