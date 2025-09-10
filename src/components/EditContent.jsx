import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useContent } from "../context/ContentContext";
import { isNotEmpty } from "../utils/validation";

export default function EditContent() {
  const { id } = useParams();
  const { data, editContent } = useContent();
  const navigate = useNavigate();

  const contentToEdit = data.find((item) => item.id === Number(id));

  const [form, setForm] = useState({
    title: "",
    body: "",
    category: "Misc",
  });
  const [error, setError] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (!contentToEdit) {
      navigate("/view");
      return;
    }
    setForm({
      title: contentToEdit.title,
      body: contentToEdit.body,
      category: contentToEdit.category,
    });
  }, [contentToEdit, navigate]);

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

    editContent({
      id: contentToEdit.id,
      ...form,
      date: new Date().toISOString(),
      comments: contentToEdit.comments || [],
    });

    navigate("/view");
  };

  return (
    <div className="panel edit-content-panel">
      <h2>Edit Content</h2>
      <form onSubmit={handleSubmit} className="content-form">
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
        />
        <textarea name="body" value={form.body} onChange={handleChange} />
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

        <button type="submit">Save Changes</button>
      </form>

      {showPreview && (
        <div className="preview">
          <h3>Preview</h3>
          <h4>{form.title}</h4>
          <p>{form.body || "Content Preview"}</p>
          <small>Category: {form.category}</small>
        </div>
      )}
    </div>
  );
}
