import { log } from "console";
import express from "express";
import fs from "fs";

const app = express();
const port = 3000;
var postsData;

fs.readFile("public/Posts/db.json", "utf-8", (err, data) => {
  if (err) throw err;
  postsData = JSON.parse(data);
});

function BlogPost(postTitle, postContent) {
  let set = false;
  while (!set) {
    set = true;
    let newId = Math.ceil(Math.random() * 1000000);
    postsData.forEach((post) => {
      if (post["id"] === newId) {
        set = false;
      }
    });
    if (set) {
      this.id = newId;
    }
  }
  this.title = postTitle;
  this.content = postContent;
  this.karma = 0;
}

function savePostsData() {
  console.log("saving");
  let jsonString = JSON.stringify(postsData);
  console.log(jsonString);
  fs.writeFile("public/Posts/db.json", jsonString, (err) => {
    if (err) {
      console.error("Failed to save posts data:", err);
    } else {
      console.log("Posts have been saved");
    }
  });
}

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.post("/submit", (req, res) => {
  let newPost = new BlogPost(req.body["postTitle"], req.body["postBody"]);
  postsData.unshift(newPost);
  savePostsData();
  res.redirect("/");
});

app.post("/edit", (req, res) => {
  console.log(req.body);
  postsData.forEach((post) => {
    if (post["id"] == req.body["postID"]) {
      post["title"] = req.body["postTitle"]
      post["content"] = req.body["postBody"]
    }
  });
  // let newPost = new BlogPost(req.body["postTitle"], req.body["postBody"]);
  // postsData.unshift(newPost);
  // savePostsData();
  res.redirect("/");
});

app.delete("/singlePost?", (req, res) => {
  console.log("Deleting..." + req.query["id"]);
  postsData.forEach((element, i) => {
    if (element["id"] == req.query["id"]) {
      postsData.splice(i, 1);
    }
  });
  savePostsData();
});

app.get("/singlePost?", (req, res) => {
  let postData;
  postsData.forEach((element) => {
    if (element["id"] == req.query["id"]) {
      postData = element;
    }
  });
  res.render("singlePost.ejs", { post: postData });
});

app.get("/about", (req, res) => {
  res.render("about.ejs");
});

app.get("/post", (req, res) => {
  res.render("post.ejs");
});

app.get("/editPost?", (req, res) => {
  let postData;
  postsData.forEach((element) => {
    if (element["id"] == req.query["id"]) {
      postData = element;
    }
  });
  res.render("post.ejs", { post: postData });
});

app.get("/", (req, res) => {
  res.render("index.ejs", { posts: postsData });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
