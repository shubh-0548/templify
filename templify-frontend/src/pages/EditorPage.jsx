import React, { useState, useEffect } from "react";
import CanvasEditor from "../components/CanvasEditor";
import Sidebar from "../components/Sidebar";
import PropertiesPanel from "../components/PropertiesPanel";
import { saveTemplate, listTemplates } from "../api/templates";
import "../styles.css";

export default function EditorPage() {
  const [template, setTemplate] = useState({
    template_id: `template_${Date.now()}`,
    template_name: "Untitled Template",
    version: "1.0",
    created_at: new Date().toISOString(),
    folder_id: "root",
    folder_name: "My Templates",
    meta: {},
    page_settings: {
      size: "A4",
      orientation: "portrait",
      margins: { top: 20, bottom: 20, left: 15, right: 15 }
    },
    components: [],
    data_schema: {}
  });

  const [selectedId, setSelectedId] = useState(null);
  const [savedTemplates, setSavedTemplates] = useState([]);
  const [showSavedModal, setShowSavedModal] = useState(false);

  function updateComponent(updatedComp) {
    const comps = template.components.map(c => c.id === updatedComp.id ? updatedComp : c);
    setTemplate(t => ({ ...t, components: comps }));
  }

  function addComponent(component) {
    setTemplate(t => ({ ...t, components: [...t.components, component] }));
    setSelectedId(component.id);
  }

  function deleteComponent(id) {
    setTemplate(t => ({ ...t, components: t.components.filter(c => c.id !== id) }));
    setSelectedId(null);
  }

  async function handleSave() {
    try {
      const payload = {
        template_id: template.template_id,
        template_name: template.template_name,
        version: template.version,
        folder_id: template.folder_id,
        folder_name: template.folder_name,
        meta: template.meta,
        layout_json: template
      };
      const res = await saveTemplate(payload);
      alert("Saved: " + (res.id ?? res.template_id));
    } catch (err) {
      console.error(err);
      alert("Save failed: " + err.message);
    }
  }

  async function fetchSavedTemplates() {
    try {
      const res = await listTemplates(template.folder_id); // API call to fetch templates
      setSavedTemplates(res);
      setShowSavedModal(true);
    } catch (err) {
      console.error(err);
      alert("Failed to load templates: " + err.message);
    }
  }

  function loadTemplate(tpl) {
    setTemplate(tpl.layout_json);
    setShowSavedModal(false);
  }

  return (
    <div className="app-shell">
      <Sidebar onAdd={addComponent} />
      <div className="main-col">
        <div className="top-bar">
          <input
            className="template-name"
            value={template.template_name}
            onChange={e => setTemplate({ ...template, template_name: e.target.value })}
          />
          <div>
            <button className="btn" onClick={handleSave}>Save Template</button>
            <button className="btn ghost" onClick={fetchSavedTemplates}>Saved Templates</button>
          </div>
        </div>

        <CanvasEditor
          template={template}
          setTemplate={setTemplate}
          selectedId={selectedId}
          setSelectedId={setSelectedId}
        />
      </div>

      <PropertiesPanel
        template={template}
        setTemplate={setTemplate}
        selectedId={selectedId}
        updateComponent={updateComponent}
        deleteComponent={deleteComponent}
      />

      {/* Modal for saved templates */}
      {showSavedModal && (
        <div className="modal-overlay" onClick={() => setShowSavedModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>Saved Templates</h3>
            <div className="template-cards">
              {savedTemplates.map(tpl => (
                <div key={tpl.id} className="template-card" onClick={() => loadTemplate(tpl)}>
                  <h4>{tpl.template_name}</h4>
                  <p>Version: {tpl.version}</p>
                  <small>Created: {new Date(tpl.created_at).toLocaleString()}</small>
                </div>
              ))}
            </div>
            <button className="btn ghost" onClick={() => setShowSavedModal(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
