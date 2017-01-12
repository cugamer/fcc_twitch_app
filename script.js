const switchBaseURL = "https://wind-bow.gomix.me/twitch-api/";
const channels = [
	"test_channel", "freecodecamp", "imaqtpie"
]

function returnTwitchApiCall(endPoint, params) {
	if(Object.keys(params).length > 0  && params.constructor === Object) {
		endPoint += "?"
		for(key in params) {
			endPoint += `${key}=${params[key]}`
		}
	}
	return fetch(switchBaseURL + endPoint);
}

function buildChannelInformation(chan) {
	let workingChanData;
	return returnTwitchApiCall('channels/' + chan, {})
			.then(function(b) {
				workingChanData = b.json();
				return workingChanData;
			})
			.then(function() {
				return returnTwitchApiCall('streams/' + chan, {});
			})
			.then(function(data) {
				workingChanData.currentlyStreaming = data.stream != null ? true : false;
				return workingChanData;
			})
			.then(function(workingChanData) {
				console.log(workingChanData);
				return(workingChanData);
			});
}

// function channelFactory(channels) {
// 	let channelList = [];
	for(let i = 0; i < channels.length; i++) {
		buildChannelInformation(channels[i]).then(function(data) {
			appendChannelItem(createChannelItem(data));
		})
	}
// }

function createChannelItem(args) {
	let outputNode = document.createElement('li')
	let channelName = args.display_name;
	let isStreaming = args.currentlyStreaming ? "Online" : "Offline";
	let chanLogo = args.logo || "https://dummyimage.com/200x200/fff/000.png&text=03XF"
	outputNode.innerHTML = `<a href="https://www.twitch.tv/${args.display_name}" target="_blank">
								<div class="chan-container">
									<img class="chan-item chan-logo" src="${chanLogo}">
									<h3 class="chan-item chan-title">${args.display_name}</h3>
									<h3 class="chan-item chan-status">${isStreaming}</h3>
								</div>
							</a>`;
	return outputNode;
}

function appendChannelItem(item) {
	let listNode = document.querySelector(".channels");
	listNode.appendChild(item);
}