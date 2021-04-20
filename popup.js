window.onload = init;
function init() {
	document.getElementById('translate').addEventListener('click', translatePage);
	document.getElementById('individual-on').addEventListener('click', individualOn);
	document.getElementById('individual-off').addEventListener('click', individualOff);
	document.getElementById("options").addEventListener('click', openOptions);
}

function translatePage() {
	chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
		chrome.tabs.sendMessage(
			tabs[0].id,
			{
				task: 'translate page',
				languageCode: document.getElementById('target').value
			},
			function (response) {
				window.close();
			}
		);
	});
}

function individualOn() {
	chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
		chrome.tabs.sendMessage(
			tabs[0].id,
			{
				task: 'activate individual',
				languageCode: document.getElementById('target').value
			});
	});
}

function individualOff() {
	chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
		chrome.tabs.sendMessage(
			tabs[0].id,
			{
				task: 'deactivate individual',
			},
			function () {
				window.close();
			});
	});
}

function openOptions() {
	chrome.runtime.openOptionsPage();
}

// onclick on the icon, i.e. on opening the popup, initialize page script
chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
	chrome.tabs.sendMessage(tabs[0].id, { task: 'mw-init' });
});