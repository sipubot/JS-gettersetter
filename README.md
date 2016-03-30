# Getter Setter
  For The HTML Node list binding to json list.

## Use on Script

 - Initialize
```javascript
  GETTERSETTER.masterNodeset("json-master-sipu"); //set The ROOT NODE TAG value
  var gg = GETTERSETTER.set("data-sipu"); // Set the Tagname
```

- Use
```javascript
  //set Json
  gg.setJSON(JsonObject);  

  //Detail Use
  gg["Object Name"].Set("insert Value");
  gg["Object Name"].Get(); // Return Value

  //Return Json
  gg.getJSON());  // Return Json

  //Make Json
  var a = GETTERSETTER.makeJSON("data-sipu");
```

##On Detail
- json list key And html attribute value String must be matching.

 See the Example html