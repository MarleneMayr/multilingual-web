document.getElementById("selectorAll").addEventListener('click',
    function () {
        var checkboxes = document.getElementsByName('selector');
        for (var i = 0; i < checkboxes.length; i++) {
            checkboxes[i].checked = this.checked;
        }
    });

// save key to storage
function saveKey() {
    chrome.storage.sync.set(
        {
            azurekey: document.getElementById("key").value
        }, function () {
            var status = document.getElementById('status');
            status.textContent = 'New key saved.';
            setTimeout(function () {
                status.textContent = '';
            }, 1500);
            document.getElementById("key").value = "***"
        });
}

// save options to chrome.storage.
function saveOptions() {
    chrome.storage.sync.set(
        {
            translateHeadings: document.getElementById("selectorH").checked,
            translateParagraphs: document.getElementById("selectorP").checked,
            translateOthers: document.getElementById("selectorOthers").checked,
        }, function () {
            var status = document.getElementById('status');
            status.textContent = 'Options saved.';
            setTimeout(function () {
                status.textContent = '';
            }, 1500);
        });
}

// restore options from the preferences stored in chrome.storage.
function restoreOptions() {
    // defaults set to true
    chrome.storage.sync.get({
        translateHeadings: true,
        translateParagraphs: true,
        translateOthers: true,
        key
    }, function (items) {
        document.getElementById("selectorH").checked = items.translateHeadings
        document.getElementById("selectorP").checked = items.translateParagraphs
        document.getElementById("selectorOthers").checked = items.translateOthers
        if (key) {
            document.getElementById("key").value = "***"
        }
    });
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save').addEventListener('click', saveOptions);
document.getElementById('activate').addEventListener('click', saveKey);