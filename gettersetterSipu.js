var GetterSetter = (function (GetterSetter, $, undefined) {
	"use strict";
	//네임스페이스 트리 만들기. attribute 값을 이용한다.
	var DATA = {
		Master: "json-master-sipu",
		AttrName: "",
		EDIT: false
	};

	function getNode() {
		var temp = {};
		var node = document.getElementsByTagName("*");
		var datatag = DATA.AttrName;
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

	function makeSpecialNode(args) {
		switch (args) {
		case "Editer":
			var div = document.createElement('div');
			var input = document.createElement('input');
			var button = document.createElement('button');
			var button2 = document.createElement('button');
			div.appendChild(input);
			div.appendChild(button2);
			div.style.position = "fixed";
			div.style.opacity = "0.7";
			div.style.display = "none";
			button2.innerHTML = "X";
			input.onkeydown = function (e) {
				if (e.keyCode == 13) {
					div.style.display = "none";
				}
			};
			if (button2.addEventListener) {
				button2.addEventListener("click", function () {});
			} else if (button2.attachEvent) {
				button2.attachEvent("onclick", function () {
					div.style.display = "none";
				});
			}
			document.body.appendChild(div);
			return [div, input];
		default:

		}
	}

	function showEditerNode(node, e, editer) {
		editer[0].style.top = e.clientY + "px";
		editer[0].style.left = e.clientX + "px";
		editer[0].style.display = "block";
		editer[1].value = node.Get();
		editer[1].focus();
		editer[1].onchange = function () {
			node.Set(this.value);
		};
	}

	function nodeDefaultSet(nodes) {
		var namespace, idx;
		var editer = makeSpecialNode("Editer");
		for (namespace in nodes) {
			for (idx in nodes[namespace]) {
				setNodeDefaultFunc(nodes[namespace][idx]);
				setNodeClickEditer(nodes[namespace][idx], editer, namespace);
			}
		}
	}

	function setNodeDefaultFunc(node) {
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

	function setNodeClickEditer(node, editer, namespace) {
		if (DATA.EDIT && namespace !== DATA.Master) {
			if (node.addEventListener) {
				node.addEventListener("click", function (e) {
					showEditerNode(node, e, editer);
				});
			} else if (node.attachEvent) {
				node.attachEvent("onclick", function (e) {
					showEditerNode(node, e, editer);
				});
			}
		}
	}

	function onScrollChecker(nodes, percent) {
		var np = percent || 2;
		window.addEventListener('scroll', function (e) {
			for (var i in nodes[DATA.Master]) {
				if ((window.scrollY + ((10 - np) * Math.ceil(window.innerHeight / 10))) - nodes[DATA.Master][i].offsetTop > 0 &&
					(window.scrollY + ((np) * Math.ceil(window.innerHeight / 10))) - (nodes[DATA.Master][i].offsetTop + nodes[DATA.Master][i].clientHeight) < 0) {
					if (nodes[DATA.Master][i].getAttribute("data-onview") === "false" || nodes[DATA.Master][i].getAttribute("data-onview") === null) {
						nodes[DATA.Master][i].setAttribute("data-onview", "true");
					}
				} else {
					if (nodes[DATA.Master][i].getAttribute("data-onview") === "true" || nodes[DATA.Master][i].getAttribute("data-onview") === null) {
						nodes[DATA.Master][i].setAttribute("data-onview", "false");
					}
				}
			}
		});
	}

	function nodeJSONset(nodes) {
		if (!nodes[DATA.Master]) {
			console.log("Not have master node!");
			return false;
		}
		nodes.setJSON = function (jsonlist, addMode) {
			if (jsonlist.length < 1) {
				console.log("Not Exist JSON");
				return false;
			}
			var parentMaster = nodes[DATA.Master][0].parentNode;
			if (!addMode) {
				parentMaster.innerHTML = "";
			}
			for (var i in jsonlist) {
				var cloneMaster = nodes[DATA.Master][0].cloneNode(true);
				parentMaster.appendChild(cloneMaster);
			}
			var newNode = getNode();
			nodeDefaultSet(newNode);
			for (var idx in newNode[DATA.Master]) {
				for (var namespace in newNode) {
					if (namespace === DATA.Master) {} else {
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
			if (typeof nodes[DATA.Master]) {
				delete nodes[DATA.Master];
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

	GetterSetter.addRowNode = function () {
		var nodes = getNode();
		var parentMaster = nodes[DATA.Master][0].parentNode;
		var cloneMaster = nodes[DATA.Master][0].cloneNode(true);
		setNodeDefaultFunc(cloneMaster);
		if (DATA.EDIT) {
			setNodeClickEditer(cloneMaster);
		}
		parentMaster.appendChild(cloneMaster);
	};

	GetterSetter.removeRowNode = function (i) {
		var nodes = getNode();
		var parentMaster = nodes[DATA.Master][0].parentNode;
		parentMaster.removeChild(nodes[DATA.Master][i]);
	};

	GetterSetter.makeJSON = function () {
		var tempNODES = getNode();
		if (!tempNODES[DATA.Master]) {
			console.log("Not have master node!");
			return false;
		}
		var returnjson = [];
		var jsonunit = {};
		if (typeof tempNODES[DATA.Master]) {
			delete tempNODES[DATA.Master];
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
	//setValue Again Work on last
	GetterSetter.masterNodeset = function (args) {
		if (args.length > 0 && typeof args === "string") {
			DATA.Master = args;
		}
	};
	GetterSetter.onEdit = function (args) {
		if (typeof args === "boolean") {
			DATA.EDIT = args;
		}
	};

	GetterSetter.set = function (args) {
		DATA.AttrName = args || "data-sipu";
		var NODES = getNode();
		nodeDefaultSet(NODES);
		nodeJSONset(NODES, DATA.AttrName);
		onScrollChecker(NODES);

		return NODES;
	};
	return GetterSetter;
})(window.GetterSetter || {}, jQuery);
GetterSetter.onEdit(true);
GetterSetter.set();
