import { useNavigate } from "react-router-dom";
import { useContent } from "../context/ContentContext";
import { useEffect, useState } from "react";
import { isNotEmpty } from "../utils/validation";
import { useAuth } from "../context/AuthContext";

export default function AddContent() {
  const { addContent } = useContent();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState("Misc");
  const [error, setError] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    const draft = localStorage.getItem("contentDraft");
    if (draft) {
      try {
        const { title, body, category } = JSON.parse(draft);
        setTitle(title || "");
        setBody(body || "");
        setCategory(category || "Misc");
      } catch (error) {
        console.error("Failed to parse draft:", error);
      }
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isNotEmpty(title) || !isNotEmpty(body)) {
      setError("Please fill all the fields");
      return;
    }
    const newContent = {
      id: Date.now(),
      title,
      body,
      category,
      date: new Date().toISOString(),
      author: user.username,
    };
    addContent(newContent);
    setTitle("");
    setBody("");
    setCategory("Misc");
    setError("");
    localStorage.removeItem("contentDraft");
    navigate("/view");
  };

  return (
    <div className="panel add-content-panel">
      <h2>Add New Content</h2>
      <form onSubmit={handleSubmit} className="content-form">
        <div className="form-group">
          <label htmlFor="title">Title:</label>
          <input
            id="title"
            type="text"
            placeholder="Enter title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="body">Body:</label>
          <textarea
            id="body"
            placeholder="Enter body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="category">Category:</label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="NEWS"> NEWS</option>
            <option value="BLOG">BLOG</option>
            <option value="TUTORIAL">TUTORIAL</option>
            <option value="Misc">Misc</option>
          </select>
        </div>
        <div className="form-group">
          <label>
            <input
              type="checkbox"
              checked={showPreview}
              onChange={() => setShowPreview((prev) => !prev)}
            />
            Show Preview
          </label>
        </div>
        {error && <div className="error">{error}</div>}
        <button type="submit" className="btn">
          Add Content
        </button>
      </form>
      {showPreview && (
        <div className="preview">
          <h3>Live Preview</h3>
          <h4>{title || "Title"}</h4>
          <p>{body || "Body content will appear here..."}</p>
          <small>Category: {category}</small>
        </div>
      )}
    </div>
  );
}
