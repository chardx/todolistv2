const express = require('express');
const date = require(__dirname + "/date.js");
const connection = require(__dirname + "/connection.js");
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const _ = require("lodash");
const app = express();



var works = [];
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public")); // use to set CSS and other public files


// Connect to Database
connection.connectToDB();

const itemsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
});

const listsSchema = new mongoose.Schema({
    name: String,
    items: [itemsSchema],
})

const Item = new mongoose.model("Item", itemsSchema);
const List = new mongoose.model("List", listsSchema);

const item1 = new Item({
    name: "Welcome to your todolist!"
});
const item2 = new Item({
    name: "Hit the + button to add new item."
});

const item3 = new Item({
    name: "<-- Hit this to delete an item.>"
});

const defaultItems = [item1, item2, item3]


let day = date.getDate();

app.get("/", function (req, res) {



    Item.find({}, function (err, items) {
        if (err) {
            console.log(err);
        } else {

            if (items.length === 0) {
                // Insert Default Items
                Item.insertMany(defaultItems, function (err) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("Sucessfully saved");
                    }
                })
                res.redirect("/");
            }
            else {
                res.render("list", {
                    ListTitle: day, newListItems: items,
                });
            }

        };

    });


});

app.get("/:customListName", function (req, res) {
    const customListName = _.capitalize(req.params.customListName);

    List.findOne({ name: customListName }, function (err, foundList) {
        if (!err) {

            if (!foundList) {
                //Create a new List
                console.log(customListName + " has been added succesfully!");
                const list = new List({
                    name: customListName,
                    items: defaultItems,
                });
                list.save();
                res.redirect("/" + customListName);

            }
            else {
                //Show an existing list

                res.render("list", {
                    ListTitle: foundList.name, newListItems: foundList.items,
                });
            }
        }
        else {
            console.log("You to got an error! " + err);
        }

    })
});

app.post("/", function (req, res) {

    const itemName = req.body.newListItem;
    const listName = req.body.list;
    console.log(req.body.list);
    if (itemName != "") {
        const newItem = new Item({
            name: itemName,
        });

        // Check if Date is Today
        if (listName === day) {
            newItem.save();
            res.redirect("/");
        } else {
            List.findOne({ name: listName }, function (err, foundList) {
                foundList.items.push(newItem);
                foundList.save();
                res.redirect("/" + listName);
            });
        }


    }

});



app.post("/work", function (req, res) {
    work = String(req.body.newListItem);
    works.push(work);
    console.log(req.body);
    res.redirect("/work");
});

app.post("/delete", function (req, res) {
    const checkedItemId = req.body.checkbox
    const listName = req.body.listName;

    if (listName === day) {
        Item.findByIdAndDelete(checkedItemId, function (err) {
            if (err) {
                console.log(err);
            }
            else {
                console.log("Sucessfully Deleted!");
            }
            res.redirect("/");

        })
    }
    else {
        //Very Complicated
        List.findOneAndUpdate({ name: listName }, { $pull: { items: { _id: checkedItemId } } }, function(err, foundList){
            if(!err){
                res.redirect("/" + listName);
            }
        })
    }


});

app.get("/about", function (req, res) {
    res.render("about");
});
app.listen(3000, function () {
    console.log("Listening to the saong we use to sing");
});