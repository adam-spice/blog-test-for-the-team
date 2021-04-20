const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(express.json());
app.use(cors((origin, cb) => cb(null, true)));

const posts = {};

const handleEvent = (type, data) => {
  if (type === "PostCreated") {
    const { id, title } = data;
    posts[id] = { id, title, comments: [] };
  }

  if (type === "CommentCreated") {
    const { id, content, postId, status } = data;
    const post = posts[postId];
    post.comments.push({ id, content, status, postId });
  }
  if (type === "CommentUpdated") {
    const { id, content, postId, status } = data;
    console.log(`status`, status);
    const post = posts[postId];
    const comment = post.comments.find((comment) => {
      return comment.id === id;
    });

    comment.status = status;
    comment.content = content;

    console.log(`comment`, comment);
    console.log(`post`, post);
  }
};

app.get("/posts", (req, res) => {
  res.send(posts);
});

app.post("/events", (req, res) => {
  const { type, data } = req.body;
  console.log(`received event`, type);
  handleEvent(type, data);
  res.send({});
});

app.listen(4002, async () => {
  console.log("listening on 4002");

  const { data } = await axios.get("http://event-bus-srv:4005/events");

  for (let event of data) {
    console.log("processing event:", event.type);
    handleEvent(event.type, event.data);
  }
});
