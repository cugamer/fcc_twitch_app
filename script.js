const switchBaseURL = "https://wind-bow.gomix.me/twitch-api/";
const channels = [
	"test_channel", "freecodecamp", "imaqtpie", "timthetatman"
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
				return b.json();
			})
			.then(function(data) {
				workingChanData = data;
				return returnTwitchApiCall('streams/' + chan, {});
			})
			.then(function(blob) {
				return blob.json();
			})
			.then(function(data) {
				workingChanData.currentlyStreaming = data.stream != null ? true : false;
				return workingChanData;
			})
			.then(function(workingChanData) {
				return(workingChanData);
			});
}

function channelFactory(channels) {
	let chanPromiseList = [];
	for(let i = 0; i < channels.length; i++) {
		chanPromiseList.push(buildChannelInformation(channels[i]));
	}
	Promise.all(chanPromiseList).then(values => {
		values.sort(function(a, b) { 
			return a.display_name.toLowerCase() < b.display_name.toLowerCase() ? -1 : 1; })
		values.forEach(function(val) {
			appendChannelItem(createChannelItem(val));
		});
	})
}

function createChannelItem(args) {
	let outputNode = document.createElement('li')
	let channelName = args.display_name;
	let isStreaming = args.currentlyStreaming ? "Online" : "Offline";
	let chanLogo = args.logo || "https://dummyimage.com/200x200/fff/000.png&text=03XF"
	outputNode.innerHTML = 
			`<a href="https://www.twitch.tv/${args.display_name}" target="_blank" class="streaming-${isStreaming.toLowerCase()}">
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

channelFactory(channels);