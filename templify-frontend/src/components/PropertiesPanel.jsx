// import React from "react";
//
// export default function PropertiesPanel({ template, setTemplate, selectedId, updateComponent, deleteComponent }) {
//   const comp = template.components.find(c => c.id === selectedId);
//
//   if (!comp) {
//     return (
//       <div style={{ width: 300, padding: 12, borderLeft: "1px solid #eee" }}>
//         <h4>Properties</h4>
//         <p>Select a component to edit its properties</p>
//       </div>
//     );
//   }
//
//   function onChangeProp(key, value) {
//     const updated = { ...comp, properties: { ...comp.properties, [key]: value } };
//     updateComponent(updated);
//   }
//
//   function onChangePosition(key, value) {
//     const updated = { ...comp, position: { ...comp.position, [key]: Number(value) } };
//     updateComponent(updated);
//   }
//
//   function onChangeSize(key, value) {
//     const updated = { ...comp, size: { ...comp.size, [key]: Number(value) } };
//     updateComponent(updated);
//   }
//
//   return (
//     <div style={{ width: 300, padding: 12, borderLeft: "1px solid #eee", overflow: "auto" }}>
//       <h4>Properties — {comp.type}</h4>
//
//       <div>
//         <label>Position X</label>
//         <input value={comp.position.x} onChange={e => onChangePosition("x", e.target.value)} />
//         <label>Y</label>
//         <input value={comp.position.y} onChange={e => onChangePosition("y", e.target.value)} />
//       </div>
//
//       <div>
//         <label>Width</label>
//         <input value={comp.size.width} onChange={e => onChangeSize("width", e.target.value)} />
//         <label>Height</label>
//         <input value={comp.size.height} onChange={e => onChangeSize("height", e.target.value)} />
//       </div>
//
//       {comp.type === "text" && (
//         <>
//           <label>Text</label>
//           <textarea value={comp.properties.content} onChange={e => onChangeProp("content", e.target.value)} />
//           <label>Font size</label>
//           <input value={comp.properties.font_size || 14} onChange={e => onChangeProp("font_size", Number(e.target.value))} />
//           <label>Color</label>
//           <input value={comp.properties.color || "#000"} onChange={e => onChangeProp("color", e.target.value)} />
//         </>
//       )}
//
//       {comp.type === "image" && (
//         <>
//           <label>Image URL</label>
//           <input value={comp.properties.src || ""} onChange={e => onChangeProp("src", e.target.value)} />
//         </>
//       )}
//
//       {comp.type === "table" && (
//         <>
//           <label>Columns (JSON)</label>
//           <textarea
//             value={JSON.stringify(comp.properties.columns, null, 2)}
//             onChange={e => {
//               try {
//                 const columns = JSON.parse(e.target.value);
//                 onChangeProp("columns", columns);
//               } catch (err) {
//                 // ignore parse error while typing
//               }
//             }}
//             rows={8}
//           />
//         </>
//       )}
//
//       <hr />
//       <button onClick={() => deleteComponent(comp.id)}>Delete component</button>
//     </div>
//   );
// }
import React from "react";

export default function PropertiesPanel({ template, setTemplate, selectedId, updateComponent, deleteComponent }) {
  const comp = template.components.find(c => c.id === selectedId);

  if (!comp) {
    return (
      <div className="properties-panel">
        <h4>Properties</h4>
        <p>Select a component to edit its properties</p>
      </div>
    );
  }

  function onChangeProp(key, value) {
    const updated = { ...comp, properties: { ...comp.properties, [key]: value } };
    updateComponent(updated);
  }

  function onChangePosition(key, value) {
    const updated = { ...comp, position: { ...comp.position, [key]: Number(value) } };
    updateComponent(updated);
  }

  function onChangeSize(key, value) {
    const updated = { ...comp, size: { ...comp.size, [key]: Number(value) } };
    updateComponent(updated);
  }

  function addTableRow() {
    const rows = comp.properties.rows ? [...comp.properties.rows] : [];
    rows.push(Object.fromEntries((comp.properties.columns || []).map(c => [c.field, ""])));
    onChangeProp("rows", rows);
  }

  function addTableColumn() {
    const cols = comp.properties.columns ? [...comp.properties.columns] : [];
    const id = "col_" + Math.random().toString(36).slice(2, 6);
    cols.push({ id, header: `Col ${cols.length + 1}`, field: `field_${cols.length + 1}`, width: `${100/(cols.length+1)}%`});
    onChangeProp("columns", cols);
  }

  return (
    <div className="properties-panel">
      <h4>Properties — {comp.type}</h4>

      <div className="grid">
        <div>
          <label>Position X</label>
          <input value={comp.position.x} onChange={e => onChangePosition("x", e.target.value)} />
        </div>
        <div>
          <label>Y</label>
          <input value={comp.position.y} onChange={e => onChangePosition("y", e.target.value)} />
        </div>
      </div>

      <div className="grid">
        <div>
          <label>Width</label>
          <input value={comp.size.width} onChange={e => onChangeSize("width", e.target.value)} />
        </div>
        <div>
          <label>Height</label>
          <input value={comp.size.height} onChange={e => onChangeSize("height", e.target.value)} />
        </div>
      </div>

      {comp.type === "text" && (
        <>
          <label>Text</label>
          <textarea value={comp.properties.content} onChange={e => onChangeProp("content", e.target.value)} />
          <label>Font size</label>
          <input value={comp.properties.font_size || 14} onChange={e => onChangeProp("font_size", Number(e.target.value))} />
          <label>Color</label>
          <input value={comp.properties.color || "#000"} onChange={e => onChangeProp("color", e.target.value)} />
        </>
      )}

      {comp.type === "image" && (
        <>
          <label>Image URL</label>
          <input value={comp.properties.src || ""} onChange={e => onChangeProp("src", e.target.value)} />
        </>
      )}

      {comp.type === "table" && (
        <>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn" onClick={addTableColumn}>Add Column</button>
            <button className="btn" onClick={addTableRow}>Add Row</button>
          </div>

          <label>Columns (JSON)</label>
          <textarea
            value={JSON.stringify(comp.properties.columns, null, 2)}
            onChange={e => {
              try {
                const columns = JSON.parse(e.target.value);
                onChangeProp("columns", columns);
              } catch (err) {}
            }}
            rows={8}
          />

          <label>Rows (JSON)</label>
          <textarea
            value={JSON.stringify(comp.properties.rows || [], null, 2)}
            onChange={e => {
              try {
                const rows = JSON.parse(e.target.value);
                onChangeProp("rows", rows);
              } catch (err) {}
            }}
            rows={8}
          />
        </>
      )}

      {comp.type === "box" && (
        <>
          <label>Fill</label>
          <input value={comp.properties.fill || "#fff"} onChange={e => onChangeProp("fill", e.target.value)} />
        </>
      )}

      <hr />
      <button className="btn danger" onClick={() => deleteComponent(comp.id)}>Delete component</button>
    </div>
  );
}

