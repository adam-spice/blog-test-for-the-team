const express = require("express");
const { randomBytes } = require("crypto");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(express.json());
app.use(cors((origin, cb) => cb(null, true)));

const commentsByPostId = {};

app.get("/posts/:id/comments", (req, res) => {
  res.send(commentsByPostId[req.params.id] || []);
});

app.post("/posts/:id/comments", async (req, res) => {
  const commentId = randomBytes(4).toString("hex");
  const { content } = req.body;

  const comments = commentsByPostId[req.params.id] || [];

  const newComment = {
    id: commentId,
    content,
    postId: req.params.id,
    status: "pending",
  };
  comments.push(newComment);

  commentsByPostId[req.params.id] = comments;

  await axios.post("http://localhost:4005/events", {
    type: "CommentCreated",
    data: newComment,
  });
  res.status(201).send(comments);
});

app.post("/events", async (req, res) => {
  const { type, data } = req.body;
  console.log("received event", req.body.type);

  if (type === "CommentModerated") {
    const { postId, id, status, content } = data;
    const comments = commentsByPostId[postId];

    const comment = comments.find((comment) => {
      return comment.id === id;
    });

    comment.status = status;

    await axios.post("http://localhost:4005/events", {
      type: "CommentUpdated",
      data: { id, postId, status, content },
    });
  }

  res.send({});
});

app.listen(4001, () => console.log("listening on 4001"));
