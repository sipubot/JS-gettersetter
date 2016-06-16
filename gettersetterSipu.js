var GetterSetter = (function (GetterSetter, $, undefined) {
	"use strict";
	//네임스페이스 트리 만들기. attribute 값을 이용한다.
	var DATA = {
		Master: "json-master-sipu",
		AttrName: "",
		EDIT: false
	};
	var SET = {
		Editer: false,
		onScroll: true,
		onMouse: true,
	};
	//공통 함수
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

	function checkVal(type, value) {
		var pattern;
		switch (type) {
		case "url":
			pattern = /^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/;
			if (!pattern.test(value)) {
				console.log()("url error");
				return false;
			}
			break;
		default:

		}
	}
	/**
	 * 노드 관련 함수
	 */
	function nodeDefaultSet(nodes) {
		var namespace, idx;
		var editer = makeClickEditer();
		onScrollChecker(nodes);
		onMouseover(nodes);
		for (namespace in nodes) {
			for (idx in nodes[namespace]) {
				setNodeSetFunc(nodes[namespace][idx], namespace, editer);
			}
		}
	}

	function setNodeSetFunc(node, namespace, editer) {
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
			showEditer(node, namespace, editer);
			break;
		}
	}

	function makeClickEditer() {
		var div = document.createElement('div');
		var input = document.createElement('input');
		var button = document.createElement('button');
		div.appendChild(input);
		div.appendChild(button);
		div.style.position = "fixed";
		div.style.opacity = "0.7";
		div.style.display = "none";
		button.innerHTML = "X";
		input.onkeydown = function (e) {
			if (e.keyCode == 13) {
				div.style.display = "none";
			}
		};
		if (button.addEventListener) {
			button.addEventListener("click", function () {
				div.style.display = "none";
			});
		} else if (button.attachEvent) {
			button.attachEvent("onclick", function () {
				div.style.display = "none";
			});
		}
		document.body.appendChild(div);
		return [div, input];
	}

	function showEditer(node, namespace, editer) {
		if (!SET.Editer) {
			return false;
		}
		if (namespace !== DATA.Master) {
			var func = function (e) {
				editer[0].style.top = e.clientY + "px";
				editer[0].style.left = e.clientX + "px";
				editer[0].style.display = "block";
				editer[1].value = node.Get();
				editer[1].focus();
				editer[1].onchange = function () {
					node.Set(this.value);
				};
			};
			if (node.addEventListener) {
				node.addEventListener("click", func);
			} else if (node.attachEvent) {
				node.attachEvent("click", func);
			}
		}
	}

	function onScrollChecker(nodes, percent) {
		if (!SET.onScroll) {
			return false;
		}

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

	function onMouseover(nodes) {
		if (!SET.onMouse) {
			return false;
		}
		console.log(nodes);
		var i;
		var func = function (e) {
			this.setAttribute("data-onmouse", "true");
		};
		var func2 = function (e) {
			this.setAttribute("data-onmouse", "false");
		};
		for (i in nodes[DATA.Master]) {
			nodes[DATA.Master][i].addEventListener("mouseenter", func);
		}
		for (i in nodes[DATA.Master]) {
			nodes[DATA.Master][i].addEventListener("mouseout", func2);
		}
	}
	/**
	 * dom 노드 전역 함수
	 *
	 */
	function nodeJSONfunc(nodes) {
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
			nodeJSONfunc(newNode);
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
		setNodeSetFunc(cloneMaster);
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
			SET.Editer = args;
		}
	};

	GetterSetter.set = function (args) {
		DATA.AttrName = args || "data-sipu";
		var NODES = getNode();
		nodeDefaultSet(NODES);
		nodeJSONfunc(NODES, DATA.AttrName);
		return NODES;
	};
	return GetterSetter;
})(window.GetterSetter || {}, jQuery);
GetterSetter.onEdit(true);
GetterSetter.set();
