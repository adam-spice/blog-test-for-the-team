import axios from "axios";
import React, { useState } from "react";

const CommentCreate = ({ postId }) => {
  const [content, setContent] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();

    await axios.post(`http://localhost:4001/posts/${postId}/comments`, {
      content,
    });

    setContent("");
  };
  return (
    <div>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="comment"></label>
          <input
            value={content}
            onChange={(e) => setContent(e.target.value)}
            type="text"
            id="comment"
            className="form-control"
          />
        </div>
        <button type="submit" className="btn btn-primary my-2">
          Comment
        </button>
      </form>
    </div>
  );
};

export default CommentCreate;
