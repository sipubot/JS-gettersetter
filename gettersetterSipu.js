var GETTERSETTER = (function (GETTERSETTER, $, undefined) {
	"use strict";
	//네임스페이스 트리 만들기. attribute 값을 이용한다.
	var SET = {
		MASTERDATANODE: "json-master-sipu",
		DATANAME: "",
		EDIT: true,
	};

	function getNode() {
		var temp = {};
		var node = document.getElementsByTagName("*");
		var datatag = SET.DATANAME;
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

	function setNodeClick(node) {
		switch (node.tagName) {
		case "A":
			break;
		case "IMG":
			break;
		default:
			if (node.addEventListener) {
				node.addEventListener("click", function (e) {
					showEditInput(node, e);
					console.log(node);
					if (typeof node.click !== "function") {
					}
				});
			} else if (node.attachEvent) {
				node.attachEvent("onclick", function (e) {
					if (typeof node.onclick !== "function") {
						showEditInput(node, e);
					}
				});
			}
			break;
		}
	}

	function showEditInput(node, e) {
		var div = document.createElement('div');
		var input = document.createElement('input');
		var button = document.createElement('button');
		div.appendChild(input);
		div.appendChild(button);
		div.style.position = "fixed";
		div.style.opacity = "0.7";
		div.style.top = e.clientY + "px";
		div.style.left = e.clientX + "px";
		input.value = node.Get();
		button.innerHTML = "\uc218\uc815";
		if (button.addEventListener) {
			 console.log(typeof button.click);
			button.addEventListener("click", function () {
				node.Set(input.value);
				node.removeChild(div);
			});
		} else if (button.attachEvent) {
			button.attachEvent("onclick", function () {
				node.Set(input.value);
				node.body.removeChild(div);
			});
		}
		node.appendChild(div);
		console.log(e);
		console.log(node);
	}

	function nodeDefaultSet(nodes) {
		var namespace, idx;
		for (namespace in nodes) {
			for (idx in nodes[namespace]) {
				setNodeFunc(nodes[namespace][idx]);
			}
		}
		for (namespace in nodes) {
			for (idx in nodes[namespace]) {
				if (SET.EDIT && namespace !== SET.MASTERDATANODE) {
					setNodeClick(nodes[namespace][idx]);
				}
			}
		}
	}

	function nodeJSONset(nodes) {
		if (!nodes[SET.MASTERDATANODE]) {
			console.log("Not have master node!");
			return false;
		}
		nodes.setJSON = function (jsonlist, addMode) {
			if (jsonlist.length < 1) {
				console.log("Not Exist JSON");
				return false;
			}
			var parentMaster = nodes[SET.MASTERDATANODE][0].parentNode;
			if (!addMode) {
				parentMaster.innerHTML = "";
			}
			for (var i in jsonlist) {
				var cloneMaster = nodes[SET.MASTERDATANODE][0].cloneNode(true);
				parentMaster.appendChild(cloneMaster);
			}
			var newNode = getNode();
			nodeDefaultSet(newNode);
			for (var idx in newNode[SET.MASTERDATANODE]) {
				for (var namespace in newNode) {
					if (namespace === SET.MASTERDATANODE) {} else {
						if (typeof newNode[namespace][idx] === "object") {
							newNode[namespace][idx].Set(jsonlist[idx][namespace]);
						}
					}
				}
			}
			nodeJSONset(newNode);
		};
		nodes.getJson = function () {
			var returnjson = [];
			var jsonunit = {};
			if (typeof nodes[SET.MASTERDATANODE]) {
				delete nodes[SET.MASTERDATANODE];
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
	GETTERSETTER.addNode = function () {
		var parentMaster = nodes[SET.MASTERDATANODE][0].parentNode;
		var cloneMaster = nodes[SET.MASTERDATANODE][0].cloneNode(true);
		parentMaster.appendChild(cloneMaster);
	};
	GETTERSETTER.makeJSON = function () {
		var tempNODES = getNode();
		if (!tempNODES[SET.MASTERDATANODE]) {
			console.log("Not have master node!");
			return false;
		}
		var returnjson = [];
		var jsonunit = {};
		if (typeof tempNODES[SET.MASTERDATANODE]) {
			delete tempNODES[SET.MASTERDATANODE];
		}
		nodeDefaultSet(tempNODES);
		for (var i in tempNODES[Object.keys(tempNODES)[0]]) {
			for (var data in tempNODES) {
				jsonunit[data] = tempNODES[data][i].Get();
			}
			returnjson.push(jsonunit);
		}
		console.log(JSON.stringify(returnjson));
		return returnjson;
	};
	GETTERSETTER.masterNodeset = function (args) {
		if (args.length > 0 && typeof args === "string") {
			SET.MASTERDATANODE = args;
		}
	};
	GETTERSETTER.set = function (args) {
		SET.DATANAME = args || "data-sipu";
		var NODES = getNode();
		nodeDefaultSet(NODES);
		nodeJSONset(NODES, SET.DATANAME);
		return NODES;
	};
	return GETTERSETTER;
})(window.GETTERSETTER || {}, jQuery);
var a = GETTERSETTER.set("data-sipu");
console.log(a);
