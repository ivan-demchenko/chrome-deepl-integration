chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "chrome-deepl",
    title: "Translate with Deepl",
    type: "normal",
    contexts: ["selection"],
  });

  chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "chrome-deepl") {
      chrome.tabs.sendMessage(
        tab.id,
        { type: "get-clicked-element" },
        { frameId: info.frameId },
        (clickedEl) => {
          fetch(
            `https://api-free.deepl.com/v2/translate?auth_key=${process.env.APIKEY}&text=${clickedEl.value}&target_lang=de`
          )
            .then((resp) => resp.json())
            .then((deeplResp) => {
              chrome.tabs.sendMessage(
                tab.id,
                {
                  type: "set-clicked-element-value",
                  newValue: deeplResp.translations[0].text,
                },
                { frameId: info.frameId },
                (data) => {
                  console.log(data);
                }
              );
            })
            .catch((e) => {
              console.error(e);
            });
        }
      );
    }
  });
});
