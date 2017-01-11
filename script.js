const switchBaseURL = "https://wind-bow.gomix.me/twitch-api/";
const channels = [
	"test_channel", "freecodecamp", "lefrenchrestream"
]

function getTwitchApiCall(endPoint, params, cb) {
	if(Object.keys(params).length > 0  && params.constructor === Object) {
		endPoint += "?"
		for(key in params) {
			endPoint += `${key}=${params[key]}`
		}
	}
	console.log(switchBaseURL + endPoint)
	fetch(switchBaseURL + endPoint)
		.then(function(blob) { return blob.json() })
		.then(function(data) { cb(data); });
}

for(let i = 0; i < channels.length; i++) {
	getTwitchApiCall("channels/" + channels[i],
							{},
							function(b) {console.log(b)});
}

function createChannelItem(args) {
	let outputNode = document.createElement('li')
	outputNode.innerHTML = `Here is a list item`;
	return outputNode;
}

function appendChannelItem(item) {
	let listNode = document.querySelector(".channels");
	listNode.appendChild(item);
}

appendChannelItem(createChannelItem("asdf"))