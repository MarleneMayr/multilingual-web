document.getElementById("translate").addEventListener('click', translatePage);
function translatePage() {
	chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
		chrome.tabs.sendMessage(
			tabs[0].id,
			{
				task: "translate page",
				languageCode: document.getElementById("target").value
			},
			function (response) {
				window.close();
			}
		);
	});
}

document.getElementById("individual-on").addEventListener('click', individualOn);
function individualOn() {
	chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
		chrome.tabs.sendMessage(
			tabs[0].id,
			{
				task: "activate individual",
				languageCode: document.getElementById("target").value
			});
	});
}

const indOff = document.getElementById("individual-off").addEventListener('click', individualOff)
function individualOff() {
	chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
		chrome.tabs.sendMessage(
			tabs[0].id,
			{
				task: "deactivate individual",
			},
			function (response) {
				window.close();
			});
	});
}

// onclick on the icon, i.e. on opening the popup, initialize page script
chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
	chrome.tabs.sendMessage(tabs[0].id, { task: "mw-init" });
});