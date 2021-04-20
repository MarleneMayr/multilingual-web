var translatedMark = "mw-translated";
var highlightMark = "mw-lit";
var selectors = "";
var language = "en";
var subscriptionKey = "";

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
   switch (request.task) {
      case "mw-init":
         loadOptions();
         break;

      case "translate page":
         if (subscriptionKey == "") return;
         if (individualMode) deactivateIndividualMode();
         language = request.languageCode;
         iterateTexts(document);
         sendResponse({ fromcontent: "Content recieved language code." });
         break;

      case "activate individual":
         if (subscriptionKey == "") return;
         individualMode = true;
         language = request.languageCode;
         activateIndividualMode();
         break;

      case "deactivate individual":
         deactivateIndividualMode();
         sendResponse();
         break;

      default:
         break;
   }
});

function loadOptions() {
   subscriptionKey = chrome.storage.sync.get(['azurekey'], function (result) {
      console.log('Value currently is ' + result.key);
   });
   chrome.storage.sync.get({
      translateHeadings: true,
      translateParagraphs: true,
      translateOthers: true
   }, function (items) {
      resetSelectors(items);
   });
}

function resetSelectors(options) {
   selectors = "";
   if (options.translateHeadings) {
      selectors += `h1:not(${translatedMark}), h2:not(${translatedMark}), h3:not(${translatedMark}), h4:not(${translatedMark}), h5:not(${translatedMark}), h6:not(${translatedMark})`;
   }
   if (options.translateParagraphs) {
      if (selectors !== "") selectors += ", ";
      selectors += `p:not(.${translatedMark})`;
   }
   if (options.translateOthers) {
      if (selectors !== "") selectors += ", ";
      selectors += `span:not(${translatedMark}), label:not(${translatedMark})`;
   }
}

function iterateTexts(root) {
   var textfields = root.querySelectorAll(selectors);
   if (root !== document && root.matches(selectors)) requestTranslation(root, language);
   for (var j = 0; j < textfields.length; j++) {
      requestTranslation(textfields[j], language);
   }
}

function requestTranslation(textElement, languageCode) {
   var text = textElement.textContent;
   console.log(`${languageCode} text: ${text}`);

   var endpoint = "https://api.cognitive.microsofttranslator.com";
   var location = "global";

   axios({
      baseURL: endpoint,
      url: '/translate',
      method: 'post',
      headers: {
         'Ocp-Apim-Subscription-Key': subscriptionKey,
         'Ocp-Apim-Subscription-Region': location,
         'Content-type': 'application/json'
      },
      params: {
         'api-version': '3.0',
         'to': [`${languageCode}`]
      },
      data: [{
         'text': `${text}`
      }],
      responseType: 'json'
   })
      .then(function (response) {
         insertTranslation(textElement, response.data[0].translations[0].text);
      })
}

function insertTranslation(referenceNode, translatedText) {
   var translated = referenceNode.cloneNode(true);
   translated.innerHTML = translatedText.italics();
   translated.style.color = "gray";
   translated.classList.add(translatedMark); // mark as translated
   translated.classList.remove("mw-lit");

   referenceNode.classList.add(translatedMark); // mark as translated
   referenceNode.style.marginBottom = "0";
   referenceNode.parentNode.insertBefore(translated, referenceNode.nextSibling);
}

// highlight elements on mouseover - translate on click
var individualMode = false;

function activateIndividualMode() {
   clearPrev();
   document.addEventListener("mouseover", highlighter);
   document.addEventListener("mouseout", unhighlighter);
   document.addEventListener("click", translateSelected);
}

function deactivateIndividualMode() {
   clearPrev();
   document.removeEventListener("mouseover", highlighter);
   document.removeEventListener("mouseout", unhighlighter);
   document.removeEventListener("click", translateSelected);
}

var prev;
function highlighter(event) {
   if (event.target === document.body ||
      (prev && prev === event.target)) {
      return;
   }

   if (event.target) {
      prev = event.target;
      prev.classList.add(highlightMark);
   }
}

function unhighlighter(event) {
   clearPrev();
}

function clearPrev() {
   if (prev) {
      prev.classList.remove(highlightMark);
      prev = undefined;
   }
}

function translateSelected() {
   if (prev && !prev.classList.contains(translatedMark))
      iterateTexts(prev);
}