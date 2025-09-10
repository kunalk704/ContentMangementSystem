import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useContent } from "../context/ContentContext";
import { useAuth } from "../context/AuthContext";
import { isNotEmpty } from "../utils/validation";

export default function ViewContent() {
  const { data, deleteContent, addComment } = useContent();
  const { user } = useAuth();

  const [filters, setFilters] = useState({
    searchTerm: "",
    category: "All",
    sort: "newest",
  });

  const [commentInput, setCommentInput] = useState({});

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this content?")) {
      deleteContent(id);
    }
  };

  const handleCommentChange = (id, value) => {
    setCommentInput((prev) => ({ ...prev, [id]: value }));
  };

  const handleCommentSubmit = (e, id) => {
    e.preventDefault();
    const text = commentInput[id];
    if (!user) return alert("Please log in to comment.");
    if (!isNotEmpty(text)) return alert("Comment cannot be empty.");

    addComment(id, {
      id: Date.now(),
      author: user.username,
      text,
      date: new Date().toISOString(),
    });

    setCommentInput((prev) => ({ ...prev, [id]: "" }));
  };

  // Memoized filtered & sorted content
  const filteredContent = useMemo(() => {
    return data
      .filter((item) => {
        const matchesSearch =
          item.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
          item.body.toLowerCase().includes(filters.searchTerm.toLowerCase());

        const matchesCategory =
          filters.category === "All" || item.category === filters.category;

        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => {
        if (filters.sort === "newest")
          return new Date(b.date) - new Date(a.date);
        if (filters.sort === "oldest")
          return new Date(a.date) - new Date(b.date);
        if (filters.sort === "TitleAsc") return a.title.localeCompare(b.title);
        if (filters.sort === "TitleDesc") return b.title.localeCompare(a.title);
        return 0;
      });
  }, [data, filters]);

  return (
    <div className="panel view-content-panel">
      <h2>View Content</h2>

      {/* Filters */}
      <div className="controls">
        <input
          type="text"
          placeholder="Search by title or body..."
          value={filters.searchTerm}
          onChange={(e) =>
            setFilters((f) => ({ ...f, searchTerm: e.target.value }))
          }
        />

        <select
          value={filters.category}
          onChange={(e) =>
            setFilters((f) => ({ ...f, category: e.target.value }))
          }
        >
          <option value="All">All</option>
          <option value="NEWS">NEWS</option>
          <option value="BLOG">BLOG</option>
          <option value="TUTORIAL">TUTORIAL</option>
          <option value="Misc">Misc</option>
        </select>

        <select
          value={filters.sort}
          onChange={(e) => setFilters((f) => ({ ...f, sort: e.target.value }))}
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="TitleAsc">Title A-Z</option>
          <option value="TitleDesc">Title Z-A</option>
        </select>
      </div>

      {/* Content List */}
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

                {user && (
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
                )}
              </div>

              <p>{item.body}</p>
              <small>{new Date(item.date).toLocaleString()}</small>

              {/* Comments */}
              <div className="comments-section">
                <h4>Comments</h4>
                {item.comments && item.comments.length > 0 ? (
                  <ul className="comments-list">
                    {item.comments.map((c) => (
                      <li key={c.id} className="comment-item">
                        <p>{c.text}</p>
                        <small>
                          - {c.author} on {new Date(c.date).toLocaleString()}
                        </small>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No comments yet.</p>
                )}

                {user && (
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
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
