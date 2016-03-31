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

  //click Edit able
  GETTERSETTER.onEdit(true);

```

##On Detail
- json list key And html attribute value String must be matching.

 See the Example html
