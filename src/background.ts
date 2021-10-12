import {
  GetClickedElementMsgResponse,
  SetClickedElementValueMsgResponse,
  TabMessagePayload,
} from "./types";

const sendTabMessage = <T>(
  payload: TabMessagePayload,
  frameId: number,
  tab: chrome.tabs.Tab
) => {
  return new Promise<T>((res) => {
    chrome.tabs.sendMessage(tab.id, payload, { frameId }, (response: T) => {
      res(response);
    });
  });
};

const languagesMap = {
  BG: "Bulgarian",
  CS: "Czech",
  DA: "Danish",
  DE: "German",
  EL: "Greek",
  "EN-GB": "English (British)",
  "EN-US": "English (American)",
  ES: "Spanish",
  ET: "Estonian",
  FI: "Finnish",
  FR: "French",
  HU: "Hungarian",
  IT: "Italian",
  JA: "Japanese",
  LT: "Lithuanian",
  LV: "Latvian",
  NL: "Dutch",
  PL: "Polish",
  "PT-PT": "Portuguese (excluding Brazilian Portuguese)",
  "PT-BR": "Portuguese (Brazilian)",
  RO: "Romanian",
  RU: "Russian",
  SK: "Slovak",
  SL: "Slovenian",
  SV: "Swedish",
  ZH: "Chinese",
};

chrome.runtime.onInstalled.addListener(() => {
  const rootMenuItem = chrome.contextMenus.create({
    id: "chrome-deepl",
    title: "Translate with Deepl to...",
    contexts: ["editable"],
  });

  for (let key in languagesMap) {
    chrome.contextMenus.create({
      id: `chrome-deepl-${key}`,
      title: languagesMap[key],
      parentId: rootMenuItem,
      contexts: ["editable"],
    });
  }

  chrome.contextMenus.onClicked.addListener(async (info, tab) => {
    if (info.parentMenuItemId && info.parentMenuItemId === "chrome-deepl") {
      const targetLang = (info.menuItemId as string).substr(
        "chrome-deepl-".length
      );
      const clickedEl = await sendTabMessage<GetClickedElementMsgResponse>(
        { type: "get-clicked-element" },
        info.frameId,
        tab
      );
      const rawResp = await fetch(
        `https://api-free.deepl.com/v2/translate?auth_key=${process.env.APIKEY}&text=${clickedEl.value}&target_lang=${targetLang}`
      );
      const deeplResp = await rawResp.json();
      await sendTabMessage<SetClickedElementValueMsgResponse>(
        {
          type: "set-clicked-element-value",
          newValue: deeplResp.translations[0].text,
        },
        info.frameId,
        tab
      );
    }
  });
});
