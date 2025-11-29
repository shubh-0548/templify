import React, { useEffect, useState } from "react";
import { listTemplates, getTemplate, deleteTemplateById, listFolders } from "../api/templates";
import "../styles.css";

export default function SavedTemplatesPage() {
  const [templates, setTemplates] = useState([]);
  const [folders, setFolders] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState("all");

  async function fetchTemplates() {
    const res = await listTemplates();
    setTemplates(res || []);
  }

  async function fetchFolders() {
    try {
      const res = await listFolders();
      setFolders(res || []);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    fetchTemplates();
    fetchFolders();
  }, []);

  async function handleDelete(id) {
    if (!confirm("Delete this template?")) return;
    await deleteTemplateById(id);
    await fetchTemplates();
  }

  return (
    <div className="saved-page">
      <div className="sidebar-min">
        <h4>Folders</h4>
        <select value={selectedFolder} onChange={e => setSelectedFolder(e.target.value)}>
          <option value="all">All</option>
          {folders.map(f => <option key={f.folder_id} value={f.folder_id}>{f.folder_name}</option>)}
        </select>
      </div>

      <div className="grid-templates">
        {templates.filter(t => selectedFolder === "all" ? true : t.folder_id === selectedFolder).map(t => (
          <div key={t.template_id} className="tmpl-card">
            <div className="tmpl-card-head">
              <strong>{t.template_name}</strong>
              <div>
                <a className="btn ghost" href={`/editor?load=${encodeURIComponent(t.template_id)}`}>Open</a>
                <button className="btn danger" onClick={() => handleDelete(t.id)}>Delete</button>
              </div>
            </div>
            <div className="tmpl-meta">
              <small>Folder: {t.folder_name}</small><br/>
              <small>Saved: {new Date(t.created_at).toLocaleString()}</small>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
