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

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "chrome-deepl",
    title: "Translate with Deepl",
    type: "normal",
    contexts: ["selection"],
  });

  chrome.contextMenus.onClicked.addListener(async (info, tab) => {
    if (info.menuItemId === "chrome-deepl") {
      const clickedEl = await sendTabMessage<GetClickedElementMsgResponse>(
        { type: "get-clicked-element" },
        info.frameId,
        tab
      );
      const rawResp = await fetch(
        `https://api-free.deepl.com/v2/translate?auth_key=${process.env.APIKEY}&text=${clickedEl.value}&target_lang=de`
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
