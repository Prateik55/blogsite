//jshint esversion:6
require('dotenv').config()

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require('lodash');
const mongoose = require ("mongoose");

// console.log(process.env.DB_HOST);

const homeStartingContent = "This is the Homepage of your daily journal. It will list all your journal entries. You may try adding one right now by clicking on the 'Add new Entry' button";
const aboutContent = "This is a novice attempt to develop basic online personal journal. All the entries are hosted on MongoDB cloud. I Will add more features as I learn more.  ";
const contactContent = " ";

const app = express();
mongoose.connect(process.env.DB_HOST);

const postSchema= new mongoose.Schema({
  title:String,
  content:String
})
const Post = mongoose.model("Post",postSchema);




app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));



app.get("/",function(req,res){
  Post.find({},function (err,posts){
    res.render("home",{
        StartingContent:homeStartingContent,
        posts:posts
    })
})

});

// let posts= [];

app.get ("/about",function(req,res){
  res.render("about",(
    {aboutText:aboutContent}
  ));
});

app.get("/contact",function (req,res){
  res.render("contact",(
    {contactText:contactContent}
  ));
});
app.get("/compose",function (req,res){
  res.render("compose");
});


app.post("/compose",function(req,res){
      const post=new Post ({
        title:req.body.postTitle,
        content:req.body.postBody
      });
      // Saving the posts to DB instead of pushing it to array
      // posts.push(post);
      post.save(function(err){
        if(!err)
        res.redirect("/");
        });
   });

  app.get("/posts/:postId",function (req,res){
    const requestedPostId = req.params.postId;
    Post.findOne({_id: requestedPostId}, function(err, post){
      res.render("post",{
        title: post.title,
        content: post.content
        
      });
     });
    });
    
  
  
  
app.get("/posts/:postName", function (req,res){
  
  const  requestedTitle = _.lowerCase(req.params.postName);
  
  // Using .forEach method to loop through to check all the titles in the object array
  
  Post.forEach(function(post){
  const storedTitle =_.lowerCase(post.title);

    // Checking for the match 
    if (storedTitle === requestedTitle) {
    
    res.render("post",({
      title:post.title ,
      content:post.content
    }));
    }
 });
});



let port = process.env.PORT;
if (port == null || port == "") {
  port = 10235;
}


app.listen(port, function() {
  console.log("Server started on port 8000");
});
