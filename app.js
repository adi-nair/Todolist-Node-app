const express = require("express");
const bodyParser = require("body-parser");
const fullICU = require("full-icu");
//const date = require(__dirname+"/date.js");
const mongoose = require("mongoose");
const _  = require("lodash");


app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static(__dirname + '/public'));
//this is to include all files inside this folder like css

mongoose.connect("mongodb+srv://admin-aditya:chiku01@cluster0-nmmpc.mongodb.net/todolistDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});

const itemsSchema = {
  name: String
};

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
  name: "Welcome to Todolist"
});

const item2 = new Item({
  name: "Press the + to add items"
});

const item3 = new Item({
  name: "Tick the checkbox to remove items"
});

const DefaultItems = [item1, item2, item3];

const listSchema = {
  name: String,
  items: [itemsSchema]
};

const List = mongoose.model("List", listSchema);


app.get("/", function(req, res) {

  Item.find({}, function(err, foundItems) {
    //founditems is an array which stores the items from the
    //.find() method
    if (foundItems.length === 0) {
      Item.insertMany(DefaultItems, function(err) {
        if (err) {
          console.log("noticed error");
        } else {
          console.log("Success");
        }
      });
      res.redirect("/");
    } else {
      res.render("list", {
        listTitle: "Today",
        listItem: foundItems
      });
    }
  });
});

//since foundItems is only within the scope of .find() method
//so we have to use res.render within the function

app.post("/", function(req, res) {

  const itemName = req.body.nextItem;
  const listName = req.body.itemName;
  //nextItem is the form name
  //item stores the value written in the form.
  const itemNew = new Item({
    name: itemName
  });

  if (listName === "Today") {
    itemNew.save();
    res.redirect("/");
  } else {
    List.findOne({
      name: listName
    }, function(err, foundList) {
      if (!foundList) {
        console.log("List not found")
      } else {
        foundList.items.push(itemNew);
        foundList.save();
        res.redirect("/" + listName);
      }

    });
  }
});



app.post("/delete", function(req, res) {
  const checkedItemId = req.body.checkbox;
  let listName = req.body.nameList;

  if (listName = "Today") {
    Item.findByIdAndRemove(checkedItemId, function(err) {
      if (!err) {
        console.log("successfully deleted");
      }
    });
    res.redirect("/");
  } else {
    List.findOneAndUpdate({
      name: listName
    }, {
      $pull: {
        items: {
          _id: checkedItemId
        }
      }
    }, function(err, foundList) {
      if (!err) {
        res.redirect("/" + listName);
      }
    });
  }
});



app.get("/:pageName", function(req, res) {
  const pageName = _.capitalize(req.params.pageName);

  List.findOne({
    name: pageName
  }, function(err, foundList) {
    //returns an object
    if (!err) {
      if (!foundList) {
        console.log("doesn't exist");

        const list1 = new List({
          name: pageName,
          items: DefaultItems
        });

        list1.save();
        res.redirect("/" + pageName);
      } else {
        console.log("exits")
        res.render("list", {
          listTitle: foundList.name,
          listItem: foundList.items
        });
      }
    }
  });
});

let port = process.env.PORT;
if (port == null || port == ""){
  port = 3000;
}

app.listen(port, function(req, res) {
  console.log("Server initiated successfully!");
});
