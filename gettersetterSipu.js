var GETTERSETTER = (function (GETTERSETTER, $, undefined) {
	"use strict";
	//네임스페이스 트리 만들기. attribute 값을 이용한다.
	var MASTERDATANODE = "json-master-sipu";
	var DATANAME = "";

	function getNode(dataName) {
		var temp = {};
		var node = document.getElementsByTagName("*");
		var datatag = dataName;
		var attrValue = "None";
		for (var i = 0; i < node.length; i++) {
			if (node[i].hasAttribute(datatag) || node[i].getAttribute(datatag) !== null) {
				if (node[i].getAttribute(datatag).length > 0) {
					attrValue = node[i].getAttribute(datatag);
				}
				if (!temp[attrValue]) {
					temp[attrValue] = [];
				}
				temp[attrValue].push(node[i]);
			}
		}
		return temp;
	}

	function checkUrl(url) {
		var re = /^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/;
		if (!re.test(url)) {
			console.log()("url error");
			return false;
		}
	}

	function setNodeFunc(node) {
		switch (node.tagName) {
		case "A":
			node.Set = function (address) {
				checkUrl(address);
				node.setAttribute("href", address);
			};
			node.Get = function () {
				return node.getAttribute("href");
			};
			break;
		case "IMG":
			node.Set = function (address) {
				checkUrl(address);
				node.setAttribute("src", address);
			};
			node.Get = function () {
				return node.getAttribute("src");
			};
			break;
		default:
			node.Set = function (args) {
				node.innerHTML = args;
			};
			node.Get = function () {
				return node.innerHTML;
			};
			break;
		}
	}

	function nodeDefaultSet(nodes) {
		for (var dataname in nodes) {
			for (var idx in nodes[dataname]) {
				setNodeFunc(nodes[dataname][idx]);
			}
		}
	}

	function nodeJSONset(nodes) {
		if (!nodes[MASTERDATANODE]) {
			console.log("Not have master node!");
			return false;
		}
		nodes.setJSON = function (jsonlist, addMode) {
			if (jsonlist.length < 1) {
				console.log("Not Exist JSON");
				return false;
			}
			var parentMaster = nodes[MASTERDATANODE][0].parentNode;
			if (!addMode) {
				parentMaster.innerHTML = "";
			}
			for (var i in jsonlist) {
				var cloneMaster = nodes[MASTERDATANODE][0].cloneNode(true);
				parentMaster.appendChild(cloneMaster);
			}
			var newNode = getNode(DATANAME);
			nodeDefaultSet(newNode, DATANAME);
			for (var idx in newNode[MASTERDATANODE]) {
				for (var dataname in newNode) {
					if (dataname === MASTERDATANODE) {} else {
						if (typeof newNode[dataname][idx] === "object") {
							newNode[dataname][idx].Set(jsonlist[idx][dataname]);
						}
					}
				}
			}
			nodeJSONset(newNode, DATANAME);
		};
		nodes.getJson = function () {
			var returnjson = [];
			var jsonunit = {};
			if (typeof nodes[MASTERDATANODE]) {
				delete nodes[MASTERDATANODE];
			}
			for (var i in nodes[Object.keys(tempNODES)[0]]) {
				for (var data in nodes) {
					jsonunit[data] = nodes[data][i].Get();
				}
				returnjson.push(jsonunit);
			}
			console.log(JSON.stringify(returnjson));
			return returnjson;
		};
	}

	GETTERSETTER.makeJSON = function () {
		var tempNODES = getNode(DATANAME);
		if (!tempNODES[MASTERDATANODE]) {
			console.log("Not have master node!");
			return false;
		}
		var returnjson = [];
		var jsonunit = {};
		if (typeof tempNODES[MASTERDATANODE]) {
			delete tempNODES[MASTERDATANODE];
		}
		nodeDefaultSet(tempNODES, DATANAME);
		for (var i in tempNODES[Object.keys(tempNODES)[0]]) {
			for (var data in tempNODES) {
				jsonunit[data] = tempNODES[data][i].Get();
			}
			returnjson.push(jsonunit);
		}
		console.log(JSON.stringify(returnjson));
		return returnjson;
	};

	//외부호출가능한 정의
	GETTERSETTER.masterNodeset = function (args) {
		if (args.length > 0 && typeof args === "string") {
			MASTERDATANODE = args;
		}
	};
	GETTERSETTER.set = function (args) {
		DATANAME = args || "data-sipu";
		var NODES = getNode(DATANAME);
		nodeDefaultSet(NODES, DATANAME);
		nodeJSONset(NODES, DATANAME);
		return NODES;
	};
	return GETTERSETTER;
})(window.GETTERSETTER || {}, jQuery);
