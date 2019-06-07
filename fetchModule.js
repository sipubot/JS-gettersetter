var SIPUCOMMON = (function (SIPUCOMMON, $, undefined) {
    "use strict";

    function FETCHER() {
        this.RqBASE_URL = "";
        this.RqADD_HEADER = {};
        this.RqMethod = "POST";
        this.RqContentType = "application/json";
        this.RsType = "json";

        this.triggerNode;
        this.getNode;
        this.setNode;
        this.getDataObj;
        this.setDataObj;
        this.setPushType = "SET"; // "ADD_"
        this.setHTML; // "{date}This is Dummy{amount}";
    }
    FETCHER.prototype.ResponseCallback = (res) => (console.log(res));
    FETCHER.prototype.RequestBodyGetter = function () {};
    FETCHER.prototype.fetch = function () {
        var self = this;
        if (self.RqMethod === "GET" && self.getDataObj !== undefined) {
            return self.ResponseCallback(self.getDataObj);
        }
        self.RqHEADER = new Headers();
        self.RqHEADER.append("Content-Type", self.RqContentType);
        Object.entries(self.RqADD_HEADER).map(a => {
            self.RqHEADER.append(a[0], a[1]);
        });
        self.RqBody = JSON.stringify(self.RequestBodyGetter());
        self.Rqinit = {
            method: self.RqMethod,
            headers: self.RqHEADER,
            body: self.RqBody,
            credentials: 'include',
            mode: 'cors',
            cache: 'default'
        };
        self.RqURL = self.RqBASE_URL + self.RqADD_URL;
        fetch(self.RqURL, self.Rqinit)
            .then(response => {
                if (!response.ok) {
                    console.log("request fail");
                }
                if (self.RqMethod !== "GET") {
                    response.text().then(data=>{
                        console.log(data);
                        //self.ResponseCallback(data);
                    });
                }
                if (self.RsType === "blob") {
                    response.blob().then((data) => {
                        self.ResponseCallback(data);
                    });
                }
                if (self.RsType === "json") {
                    response.json().then((data) => {
                        self.ResponseCallback(data);
                    });
                }
                response.text().then((data) => {
                    self.ResponseCallback(data);
                });
            })
            .catch(function (error) {
                console.log('There has been a problem with your fetch operation: ' + error.message);
            });
    };
    FETCHER.prototype.nodeDataGet = function () {
        var self = this;
        if (!isinsertNode(self.getNode)) {
            self.getDataObj = null;
            return self.getDataObj;
        }
        self.getDataObj = self.getNode.value || self.getNode.options[self.getNode.selectedIndex].value;
        return self.getDataObj;
    }
    FETCHER.prototype.nodeDataSet = function (data) {
        var self = this;
        self.setDataObj = data;
        if (self.setPushType === "SET") {
            self.setNode.innerHTML = "";
        }
        self.setNode.innerHTML += self.setDataObj.map(item => {
            var t = self.setHTML;
            Object.entries(item).map(a => {
                t = t.split(`{${a[0]}}`).join(a[1]);
            });
            return t;
        }).join('');
    }
    FETCHER.prototype.binder = function () {
        var self = this;
        self.triggerNode.addEventListener('keyup', (e) => {
            if (e.keyCode === 13) self.triggerfunc();
        }, false);
        self.triggerNode.addEventListener('click touchstart', (e) => {
            self.triggerfunc();
        }, false);
    };
    FETCHER.prototype.triggerfunc = function () {
        var self = this;
        self.fetch();
    };
    var workers = {};

    function workerrunner() {
        Object.entries(workers).map(a => {
            a[1]();
        })
    }
    //util here
    function isinsertNode(node) {
        return (node.tagName == "INPUT" || node.tagName == "SELECT" || node.tagName == "TEXTAREA")
    }
    
    SIPUCOMMON.run = function () {
        workerrunner();
    };
    return SIPUCOMMON;
})(window.SIPUCOMMON || {}, jQuery);
SIPUCOMMON.run();
