const express = require("express");
const { randomBytes } = require("crypto");
const cors = require("cors");
const axios = require("axios");

const app = express();

app.use(express.json());

app.use(cors((origin, cb) => cb(null, true)));

const posts = {};

app.get("/posts", (req, res) => {
  res.send(posts);
});

app.post("/posts", async (req, res) => {
  const id = randomBytes(4).toString("hex");
  const { title } = req.body;
  const newPost = {
    id,
    title,
  };
  posts[id] = newPost;

  await axios.post("http://localhost:4005/events", {
    type: "PostCreated",
    data: newPost,
  });

  res.status(201).send(posts[id]);
});

app.post("/events", async (req, res) => {
  console.log("received event", req.body.type);

  res.send({});
});

app.listen(4000, () => console.log("listening on 4000"));
