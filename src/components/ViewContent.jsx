import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useContent } from "../context/ContentContext";
import { isNotEmpty } from "../utils/validation";
import { Link } from "react-router-dom";

export default function ViewContent() {
  const { data, deleteContent, editContent, addComment } = useContent();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [sortOption, setSortOption] = useState("newest");
  const [commentInput, setCommentInput] = useState({});

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this content?")) {
      deleteContent(id);
    }
  };

  const handleCommentChange = (contentId, value) => {
    setCommentInput((prev) => ({ ...prev, [contentId]: value }));
  };

  const handleCommentSubmit = (e, contentId) => {
    e.preventDefault();
    const commentText = commentInput[contentId];
    if (!user) {
      alert("Please log in to add a comment.");
      return;
    }
    if (!isNotEmpty(commentText)) {
      alert("comment cannot ve empty .");
      return;
    }
    const newComment = {
      id: Date.now(),
      author: user.username,
      text: commentText,
      date: new Date().toISOString(),
    };
    addComment(contentId, newComment);
    setCommentInput((prev) => ({ ...prev, [contentId]: "" }));
  };

  const filteredContent = data
    .filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.body.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        filterCategory === "All" || item.category === filterCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortOption === "newest") {
        return new Date(b.date) - new Date(a.date);
      } else if (sortOption === "oldest") {
        return new Date(a.date) - new Date(b.date);
      } else if (sortOption === "TitleAsc") {
        return a.title.localeCompare(b.title);
      } else if (sortOption === "TitleDesc") {
        return b.title.localeCompare(a.title);
      }
      return 0;
    });

  return (
    <div className="panel view-content-panel">
      <h2>View Content</h2>
      <div className="controls">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by title or body..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-sort">
          <label>
            Filter by Category:
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="All">All</option>
              <option value="NEWS">NEWS</option>
              <option value="BLOG">BLOG</option>
              <option value="TUTORIAL">TUTORIAL</option>
              <option value="MISC">MISC</option>
            </select>
          </label>
          <label>
            Sort by:
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="TitleAsc">Title A-Z</option>
              <option value="TitleDesc">Title Z-A</option>
            </select>
          </label>
        </div>
      </div>

      {filteredContent.length === 0 ? (
        <p>No content available.</p>
      ) : (
        <ul className="content-list">
          {filteredContent.map((item) => (
            <li key={item.id} className="content-item">
              <div className="content-header">
                <div>
                  <h3>{item.title}</h3>
                  <small>Category: {item.category}</small>
                </div>
                <div className="content-actions">
                  <Link to={`/edit/${item.id}`} className="btn btn-edit">
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="btn-delete"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <p>{item.body}</p>
              <small>{new Date(item.date).toLocaleString()}</small>
              <div className="comments-section">
                <h4>Comments</h4>
                {item.comments && item.comments.length > 0 ? (
                  <ul className="comments-list">
                    {item.comments.map((comment) => (
                      <li key={comment.id} className="comment-item">
                        <p>{comment.text}</p>
                        <small>
                          - {comment.author} on{" "}
                          {new Date(comment.date).toLocaleString()}
                        </small>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No comments yet.</p>
                )}
                <form
                  className="comment-form"
                  onSubmit={(e) => handleCommentSubmit(e, item.id)}
                >
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    value={commentInput[item.id] || ""}
                    onChange={(e) =>
                      handleCommentChange(item.id, e.target.value)
                    }
                  />
                  <button type="submit" className="btn btn-comment">
                    Submit
                  </button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
