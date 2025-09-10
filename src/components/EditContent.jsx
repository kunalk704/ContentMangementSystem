import { useNavigate, useParams } from "react-router-dom";
import { useContent } from "../context/ContentContext";
import { useEffect, useState } from "react";
import { isNotEmpty } from "../utils/validation";

export default function EditContent() {
  const { id } = useParams();
  const { data, editContent } = useContent();
  const navigate = useNavigate();
  const contentToEdit = data.find((item) => item.id === Number(id));

  const [title, setTitle] = useState(contentToEdit ? contentToEdit.title : "");
  const [body, setBody] = useState(contentToEdit ? contentToEdit.body : "");
  const [category, setCategory] = useState(
    contentToEdit ? contentToEdit.category : "Misc"
  );
  const [error, setError] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (!contentToEdit) {
      navigate("/view");
    }
  }, [contentToEdit, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isNotEmpty(title) || !isNotEmpty(body)) {
      setError("Please fill all the fields");
      return;
    }
    const newContent = {
      id: contentToEdit.id,
      title,
      body,
      category,
      date: new Date().toISOString(),
    };
    editContent(newContent);
    navigate("/view");
  };

  return (
    <div className="panel edit-content-panel">
      <h2>Edit Content</h2>
      <form onSubmit={handleSubmit} className="content-form">
        <div className="form-group">
          <label htmlFor="edit-title">Title:</label>
          <input
            id="edit-title"
            type="text"
            placeholder="Enter title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="edit-body">Body:</label>
          <textarea
            id="edit-body"
            placeholder="Enter body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
          ></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="edit-category">Category:</label>
          <select
            id="edit-category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="News">News</option>
            <option value="Blog">Blog</option>
            <option value="Tutorial">Tutorial</option>
            <option value="Misc">Misc</option>
          </select>
        </div>
        <div className="form-group">
          <label>
            <input
              className="check-box"
              type="checkbox"
              checked={showPreview}
              onChange={() => setShowPreview((prev) => !prev)}
            />
            Show Preview
          </label>
        </div>
        {error && <div className="error">{error}</div>}
        <button type="submit" className="btn">
          Save Changes
        </button>
      </form>
      {showPreview && (
        <div className="preview">
          <h3>Preview</h3>
          <h4>{title}</h4>
          <p>{body || "Content Preview"}</p>
          <small>Category: {category}</small>
        </div>
      )}
    </div>
  );
}
