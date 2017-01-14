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
				for(prop in data) {
					workingChanData[prop] = data[prop];
				}
				return workingChanData;
			})
}

function channelBuilder(channels) {
	let chanPromiseList = [];
	channels.forEach(channel => {
		chanPromiseList.push(buildChannelInformation(channel));		
	});
	Promise.all(chanPromiseList).then(values => {
		values.sort(function(a, b) { 
			return a.display_name.toLowerCase() < b.display_name.toLowerCase() ? -1 : 1; 
		});
		values.forEach(function(val) {
			appendChannelItem(createChannelItem(val));
		});
	});
}

function createChannelItem(args) {
	let outputNode = document.createElement('li')
	let channelName = args.display_name;
	let isStreaming = args.stream != null 
	let chanStatus = isStreaming ? `${args.stream.game}: ${args.stream.channel.status}` : "Offline";
	let chanStatusClass = isStreaming ? "stream-on" : "stream-off";
	let chanLogo = args.logo || "https://dummyimage.com/200x200/fff/000.png&text=03XF"
	outputNode.innerHTML = 
			`<a href="https://www.twitch.tv/${args.display_name}" target="_blank" class="${chanStatusClass}">
				<div class="chan-container">
					<img class="chan-item chan-logo" src="${chanLogo}">
					<h3 class="chan-item chan-title">${args.display_name}</h3>
					<h3 class="chan-item chan-status">${chanStatus}</h3>
				</div>
			</a>`;
	return outputNode;
}

function appendChannelItem(item) {
	let listNode = document.querySelector(".channels");
	listNode.appendChild(item);
}

channelBuilder(channels);

const displayOptions = document.querySelectorAll('.disp-option');
console.log(displayOptions);

function openListItem(e) {
	if(!this.classList.value.includes("active")) {
		toggleItemDisp(this);
	}
}


function closeInactiveOptions() {
	displayOptions.forEach((option) => {
		if(!option.classList.value.includes("active") && option.classList.value.includes("disp-opt-open")) {
			// option.classList.toggle('disp-opt-open');
			// option.classList.toggle('disp-opt-close');
			toggleItemDisp(option)
		};
	});
}

function toggleItemDisp(target) {
	target.classList.toggle('disp-opt-open');
	target.classList.toggle('disp-opt-close');
}

function activateListOption() {
	console.log("called")
	displayOptions.forEach((option) => option.classList.remove('active'));
	const classes = this.classlist;
	this.classList += " active";
	closeInactiveOptions();
}

displayOptions.forEach((option) => option.addEventListener('click', activateListOption));
displayOptions.forEach((option) => option.addEventListener('mouseenter', openListItem));
displayOptions.forEach((option) => option.addEventListener('mouseleave', openListItem));