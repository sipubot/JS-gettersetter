## Fetch Module

  for the FETCH API using data in out adapter 
  
### Use 
```javsscript 
  worker sub init
  workers.qut = function () {
        var n = new FETCHER();
        n.triggerNode = document.getElementById("set");
        n.getNode = document.getElementById("set");
        n.setNode = document.getElementById("set");
        n.RqADD_URL = "http://sss/aaaaa";
        n.RqMethod = "GET";
        n.RequestBodyGetter = n.nodeDataGet;
        n.ResponseCallback = n.nodeDataSet;
        n.triggerfunc = n.fetch;
        n.setHTML = "<h4>{message}example</h4>";
        n.binder();
        //test
        //n.triggerfunc();
   };
   
   workerrunner();
```

## Getter Setter
  For The HTML Node list binding to json list.

### Use on Script

 - Initialize
```javascript
  GETTERSETTER.masterNodeset("json-master-sipu"); //set The ROOT NODE TAG value
  GETTERSETTER.onEdit(true); // set Click editable
  var gg = GETTERSETTER.set("data-sipu"); // Set the Tagname
```

- Use
```javascript
  //set Json
  gg.setJSON(JsonObject, false);   // New(false) or Add(true) Mode

  //Detail Use
  gg["Object Name"].Set("insert Value");
  gg["Object Name"].Get(); // Return Value

  //Return Json
  gg.getJSON());  // Return Json

  //Make Json
  var a = GETTERSETTER.makeJSON("data-sipu");

  //add 1Row
  GETTERSETTER.addRowNode(1);

  //remove 1Row index
  GETTERSETTER.removeRowNode(1);


```

###On Detail
- json list key And html attribute value String must be matching.

 See the Example html
