const switchBase = "https://wind-bow.gomix.me/twitch-api/";


function getTwitchChannelInfo(endPoint, callBack) {
	fetch(switchBase + endPoint)
		.then(function(blob) { return blob.json() })
		.then(function(data) { callBack(data); });
}