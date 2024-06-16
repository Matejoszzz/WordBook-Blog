import { createClient } from "@supabase/supabase-js";
import express from "express";
import fs from "fs";
import { title } from "process";

const app = express();
const port = 3000;

const SUPABASE_URL = "https://jjldjzqphicfdtyrfqpd.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqbGRqenFwaGljZmR0eXJmcXBkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTg0NTUzNzcsImV4cCI6MjAzNDAzMTM3N30.lGdVSQz9RaFpQZxm4v4ot_4IB6aGoTrWyQeCKAaWe2Y";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function loadPosts() {
  let { data: postsdata, error } = await supabase.from("postsdata").select("*");

  if (error) {
    console.error("Supabase insert error:", error);
    return;
  } else {
    return postsdata;
  }
}

async function findPost(id) {
  let { data: postsdata, error } = await supabase
    .from("postsdata")
    .select("*")
    .eq("id", id);
  return postsdata;
}

async function newId() {
  let newId;
  let searching = true;
  while (searching) {
    newId = Math.ceil(Math.random() * 1000000);
    let existingPost = await findPost(newId);
    if (!existingPost[0]) {
      searching = false;
    }
  }
  return newId;
}

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.post("/submit", async (req, res) => {
  let newPost = {
    id: await newId(),
    title: req.body.postTitle,
    content: req.body.postBody,
    created: new Date(),
    author: "Matejosz"
  };
  const { data, error } = await supabase
  .from('postsdata')
  .insert([newPost,])
  .select();

  if (error) {
    console.log(error);
  }

  res.redirect("/");
});

app.post("/edit", async (req, res) => {
  console.log(req.body);

  let updatePost = {
    title: req.body["postTitle"],
    content: req.body["postBody"],
    edited: new Date()
  }

  const { data, error } = await supabase
  .from('postsdata')
  .update(updatePost)
  .eq('id', req.body["postID"])
  .select()

  res.redirect("/");
});

app.delete("/singlePost?", async (req, res) => {
  console.log("Deleting..." + req.query["id"]);
  
  const { error } = await supabase
  .from('postsdata')
  .delete()
  .eq('id', req.query["id"]);

  res.redirect("/");
});

app.get("/singlePost?", async (req, res) => {
  let postData = await findPost(req.query["id"]);

  res.render("singlePost.ejs", { post: postData[0] });
});

app.get("/about", (req, res) => {
  res.render("about.ejs");
});

app.get("/post", (req, res) => {
  res.render("post.ejs");
});

app.get("/editPost?", async (req, res) => {
  let postData = await findPost(req.query["id"]);

  res.render("post.ejs", { post: postData[0] });
});

app.get("/", async (req, res) => {
  let postsData = await loadPosts();
  res.render("index.ejs", { posts: postsData });
});

app.listen(port, () => {
  loadPosts();
  console.log(`Server is running on http://localhost:${port}`);
});
