import React, { useState } from "react";
import CanvasEditor from "../components/CanvasEditor";
import Sidebar from "../components/Sidebar";
import PropertiesPanel from "../components/PropertiesPanel";
import { saveTemplate, listTemplates, generateCode } from "../api/templates";
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

  // NEW: Framework selection + generated code
  const [framework, setFramework] = useState("odoo");
  const [generatedCode, setGeneratedCode] = useState("");
  const [showCodeModal, setShowCodeModal] = useState(false);

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

  async function handleGenerate() {
    try {
      const res = await generateCode(template.template_id, framework);
      setGeneratedCode(res.code);
      console.log("LLM Response:", res);
      setShowCodeModal(true);
    } catch (err) {
      alert("Code generation failed: " + err.message);
    }
  }

  async function fetchSavedTemplates() {
    const res = await listTemplates(template.folder_id);
    setSavedTemplates(res);
    setShowSavedModal(true);
  }

  function loadTemplate(tpl) {
    setTemplate(tpl.layout_json);
    setShowSavedModal(false);
  }

  return (
    <div className="app-shell">
      <Sidebar onAdd={(c) => {
        setTemplate(t => ({ ...t, components: [...t.components, c] }));
        setSelectedId(c.id);
      }}/>

      <div className="main-col">
        <div className="top-bar">
          <input
            className="template-name"
            value={template.template_name}
            onChange={e => setTemplate({ ...template, template_name: e.target.value })}
          />

          {/* NEW Framework selection */}
          <select
            className="framework-select"
            value={framework}
            onChange={e => setFramework(e.target.value)}
          >
            <option value="odoo">Odoo</option>
            <option value="erpnext">ERPNext</option>
            <option value="sap_ui5">SAP UI5</option>
            <option value="shopify">Shopify</option>
          </select>

          <div>
            <button className="btn" onClick={handleSave}>Save Template</button>

            {/* NEW Generate Code */}
            <button className="btn accent" onClick={handleGenerate}>
              Generate Code
            </button>

            <button className="btn ghost" onClick={fetchSavedTemplates}>
              Saved Templates
            </button>
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
        updateComponent={updated => {
          setTemplate(t => ({
            ...t,
            components: t.components.map(c => c.id === updated.id ? updated : c)
          }));
        }}
        deleteComponent={id => {
          setTemplate(t => ({
            ...t,
            components: t.components.filter(c => c.id !== id)
          }));
          setSelectedId(null);
        }}
      />

      {/* Saved template selection modal */}
      {showSavedModal && (
        <div className="modal-overlay" onClick={() => setShowSavedModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>Saved Templates</h3>
            <div className="template-cards">
              {savedTemplates.map(tpl => (
                <div key={tpl.id} className="template-card"
                     onClick={() => loadTemplate(tpl)}>
                  <h4>{tpl.template_name}</h4>
                  <p>Version: {tpl.version}</p>
                  <small>{tpl.created_at}</small>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* NEW Code View Modal */}
      {showCodeModal && (
        <div className="modal-overlay" onClick={() => setShowCodeModal(false)}>
          <div className="modal-content wide" onClick={(e) => e.stopPropagation()}>
            <h3>Generated Code</h3>
            <textarea
              style={{ width: "100%", height: "300px" }}
              readOnly
              value={generatedCode}
            />
            <button className="btn ghost" onClick={() => setShowCodeModal(false)}>
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
