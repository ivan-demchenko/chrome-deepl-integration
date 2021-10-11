# [deepl.com](http://deepl.com) plugin for Chrome

Imagine you're typing in the textarea on a page. You select a text, right click, translate and the original text is translated, right there, in the textarea.

## How to run

This is an early development. So, don't expect much.

You need a Deepl APi key. In order to get one, you need a credit card (it's free though).

If you have one, then do

```
echo "APIKEY=<input the key here>" > .env
```

After this,

```
git checkout git@github.com:raqystyle/chrome-deepl-integration.git
cd chrome-deepl-integration
npm i
npm run build
```

After that, in Chrome, go to [chrome://extensions/](chrome://extensions/) page, enable the `Developer mode`, then click `Load unpacked` and pick a directory `chrome-deepl-integration`.

Enjoy!