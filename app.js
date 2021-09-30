//jshint esversion:6
require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

const homeStartingContent = "tree";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";



//MongoDB Atlas connection
mongoose.connect("mongodb+srv://" + process.env.MONGODB_USER + ":" + process.env.MONGODB_PASSWORD +"@cluster0.shdma.mongodb.net/MyBlog");

// Defining document Schema
const blogSchema = {
  title: String,
  body: String
};

// creating mongodb document based on schema
const Blog = new mongoose.model("Blog", blogSchema);



const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


app.get("/",function(req,res){
  Blog.find({}, function(err, blogs){
    if(!err){
      res.render("home",{homeStartingContent: homeStartingContent,posts: blogs });

    }
  });
});

app.get("/about",function(req,res){
  res.render("about",{aboutContent : aboutContent});
});

app.get("/contact",function(req,res){
  res.render("contact",{contactContent : contactContent});
});

app.get("/compose",function(req,res){
  res.render("compose");
});

app.post("/compose",function(req,res){
  const blog =new Blog({
    title: req.body.postTitle,
    body : req.body.postBody
  });
  blog.save();
  res.redirect("/");
})

app.get("/posts/:id",function(req,res){
  // const id = _.lowerCase(req.params.id);
  var flag = 0;
  Blog.findById(req.params.id,function(err,blog){
    res.render("post", {postTitle : blog.title, postBody: blog.body});
  });
  // posts.forEach(function(x){
  //   if(_.lowerCase(x.title) === reqTitle){
  //     flag = 1;
  //     res.render("post",{postTitle: x.title, postBody: x.body})
  //   }
  // });
  // if(flag === 0) console.log("no match found");
})


let port  = process.env.PORT;
if(port == null || port == "") port = 3000;

app.listen(port, function() {
  console.log("Server started successfully");
});
