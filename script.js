const switchBaseURL = "https://wind-bow.gomix.me/twitch-api/";
const channels = [
	"test_channel",
	"freecodecamp",
	"doublelift", 
	"imaqtpie",
	"adsasfdafdasdf"
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
	let workingChanData = {
		channelName: chan
	};
	return returnTwitchApiCall('channels/' + chan, {})
			.then(function(b) {
				return b.json();
			})
			.then(function(data) {
				for(prop in data) {
					workingChanData[prop] = data[prop];
				}
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
			});
}

function channelBuilder(channels) {
	let chanPromiseList = [];
	channels.forEach(channel => {
		chanPromiseList.push(buildChannelInformation(channel));		
	});
	Promise.all(chanPromiseList).then(values => {
		values.sort(function(a, b) { 
			return a.channelName.toLowerCase() < b.channelName.toLowerCase() ? -1 : 1; 
		});
		values.forEach(function(val) {
			console.log(val)
			if(val.error == "Not Found") {
				appendChannelItem(createChannelListItem(val));
			} else {
				appendChannelItem(createChannelListItem(val));
			}
		});
	});
}

function appendChannelItem(item) {
	let listNode = document.querySelector(".channels");
	listNode.appendChild(item);
}

function createChannelListItem(args) {
	let outputNode = document.createElement('li');
	let channelExists = args.error == "Not Found" ? false : true;
	args.isStreaming = args.stream != null;
	args.chanStatus = args.stream ? `${args.stream.game}: ${args.stream.channel.status}` : "Offline";
	args.chanLogo = args.logo || "https://dummyimage.com/200x200/fff/000.png&text=03XF";
	outputNode.innerHTML = channelExists ? createExistsChannelContent(args) : createNonExistsChannelContent(args);
	return outputNode;
}

function createExistsChannelContent(args) {
	let chanStatusClass = args.isStreaming ? "stream-on" : "stream-off";
	return `<div class="chan-container ${chanStatusClass}">
				<img class="chan-item chan-logo" src="${args.chanLogo}">
				<h3 class="chan-item chan-title">${args.channelName}</h3>
				<h3 class="chan-item chan-status"><a href="https://www.twitch.tv/${args.channelName}" target="_blank"class="chan-link">${args.chanStatus}</a></h3>
			</div>`
}
function createNonExistsChannelContent(args) {
	return `<div class="chan-container">
				<img class="chan-item chan-logo" src="${args.chanLogo}">
				<h3 class="chan-item chan-title">${args.channelName}</h3>
				<h3 class="chan-item chan-status">This channel cannot be found and may not exist</h3>
			</div>`;
}

channelBuilder(channels);



// Control display of channel options list items
const displayOptions = document.querySelectorAll('.disp-option');

function toggleItemDisp(target) {
	target.classList.toggle('disp-opt-open');
	target.classList.toggle('disp-opt-close');
}

function clearAllLIActives() {
	displayOptions.forEach((option) => option.classList.remove('active'));
}

function displayNonActiveListItem(e) {
	if(!this.classList.value.includes("active")) {
		toggleItemDisp(this);
	}
}

function closeInactiveOptions() {
	displayOptions.forEach((option) => {
		const value = option.classList.value;
		if(!value.includes("active") && value.includes("disp-opt-open")) {
			toggleItemDisp(option);
		};
	});
}

function addActiveToListItem(target) {
	target.classList += " active";
}

function handleDispListOptionClick(target) {
	clearAllLIActives();
	addActiveToListItem(target);
	closeInactiveOptions();
}

function handleDispAllClick() {
	handleDispListOptionClick(this);
	toggleChannelList('stream-on', 'remove');
	toggleChannelList('stream-off', 'remove');
}

function handleDispOnlineClick() {
	handleDispListOptionClick(this);
	toggleChannelList('stream-on', 'remove');
	toggleChannelList('stream-off', 'add');
}

function handleDispOfflineClick() {
	handleDispListOptionClick(this);
	toggleChannelList('stream-on', 'add');
	toggleChannelList('stream-off', 'remove');
}

displayOptions.forEach((option) => option.addEventListener('mouseenter', displayNonActiveListItem));
displayOptions.forEach((option) => option.addEventListener('mouseleave', displayNonActiveListItem));

document.querySelector('.disp-all').addEventListener('click', handleDispAllClick);
document.querySelector('.disp-online').addEventListener('click', handleDispOnlineClick);
document.querySelector('.disp-offline').addEventListener('click', handleDispOfflineClick);

function getChannelNodeList() {
	return document.querySelectorAll('.chan-link');
}

function toggleChannelList(targetClass, action) {
	getChannelNodeList().forEach((channel) => {
		if(channel.classList.value.includes(targetClass)) { channel.classList[action]("hidden"); }
	})
}