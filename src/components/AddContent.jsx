import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useContent } from "../context/ContentContext";
import { useAuth } from "../context/AuthContext";
import { isNotEmpty } from "../utils/validation";

export default function AddContent() {
  const { addContent } = useContent();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    body: "",
    category: "Misc",
  });
  const [error, setError] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  // Load draft from localStorage
  useEffect(() => {
    const draft = localStorage.getItem("contentDraft");
    if (draft) {
      try {
        setForm(JSON.parse(draft));
      } catch (err) {
        console.error("Failed to parse draft:", err);
      }
    }
  }, []);

  // Save draft on form change
  useEffect(() => {
    localStorage.setItem("contentDraft", JSON.stringify(form));
  }, [form]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isNotEmpty(form.title) || !isNotEmpty(form.body)) {
      setError("Please fill all the fields");
      return;
    }

    const newContent = {
      id: Date.now(),
      ...form,
      date: new Date().toISOString(),
      author: user.username,
    };

    addContent(newContent);
    localStorage.removeItem("contentDraft"); // clear draft
    navigate("/view");
  };

  return (
    <div className="panel add-content-panel">
      <h2>Add New Content</h2>
      <form onSubmit={handleSubmit} className="content-form">
        <input
          type="text"
          name="title"
          placeholder="Enter title"
          value={form.title}
          onChange={handleChange}
        />
        <textarea
          name="body"
          placeholder="Enter body"
          value={form.body}
          onChange={handleChange}
        />
        <select name="category" value={form.category} onChange={handleChange}>
          <option value="NEWS">NEWS</option>
          <option value="BLOG">BLOG</option>
          <option value="TUTORIAL">TUTORIAL</option>
          <option value="Misc">Misc</option>
        </select>

        <label>
          <input
            type="checkbox"
            checked={showPreview}
            onChange={() => setShowPreview((prev) => !prev)}
          />
          Show Preview
        </label>

        {error && <div className="error">{error}</div>}

        <button type="submit">Add Content</button>
      </form>

      {showPreview && (
        <div className="preview">
          <h3>Live Preview</h3>
          <h4>{form.title || "Title"}</h4>
          <p>{form.body || "Body content will appear here..."}</p>
          <small>Category: {form.category}</small>
        </div>
      )}
    </div>
  );
}
