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
	return returnTwitchApiCall('channels/' + chan, {})
			.then(function(b) {return b.json()})
			.then(function(data) {
				return returnTwitchApiCall('streams/' + chan, {})
					.then(function(c) {return c.json()})
					.then(function(d) { 
						data.currentlyStreaming = d.stream != null ? true : false;
						return data;
					});
			})
			.then(function(dman) {
				console.log(dman);
				return(dman);
			});
}


for(let i = 0; i < channels.length; i++) {
	buildChannelInformation(channels[i]).then(function(dbag) {
		appendChannelItem(createChannelItem(dbag));
	})
}

function createChannelItem(args) {
	let outputNode = document.createElement('li')
	let channelName = args.display_name;
	let isStreaming = args.currentlyStreaming ? "Online" : "Offline";
	outputNode.innerHTML = `<div class="chan-item chan-icon">
								<img src="${args.logo}">
								<h3 class="chan-item chan-title">${args.display_name}</h3>
								<h3 class="chan-item chan-status">${isStreaming}</h3>
							</div>`;
	return outputNode;
}

function appendChannelItem(item) {
	let listNode = document.querySelector(".channels");
	listNode.appendChild(item);
}