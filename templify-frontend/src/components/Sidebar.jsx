// import React from "react";
//
// function id(prefix = "comp") {
//   return prefix + "_" + Math.random().toString(36).slice(2, 9);
// }
//
// export default function Sidebar({ onAdd }) {
//   function addText() {
//     onAdd({
//       id: id("text"),
//       type: "text",
//       position: { x: 20, y: 20 },
//       size: { width: 300, height: 30 },
//       properties: {
//         content: "New text",
//         font_size: 14,
//         font_weight: "normal",
//         color: "#000000",
//         alignment: "left"
//       },
//       data_binding: {}
//     });
//   }
//
//   function addImage() {
//     onAdd({
//       id: id("image"),
//       type: "image",
//       position: { x: 20, y: 70 },
//       size: { width: 120, height: 60 },
//       properties: {
//         src: "",
//         alt: "Image"
//       },
//       data_binding: {}
//     });
//   }
//
//   function addTable() {
//     onAdd({
//       id: id("table"),
//       type: "table",
//       position: { x: 20, y: 150 },
//       size: { width: 555, height: "auto" },
//       properties: {
//         border: true,
//         columns: [
//           { id: "col_1", header: "Item", field: "product_name", width: "50%" },
//           { id: "col_2", header: "Qty", field: "quantity", width: "25%" },
//           { id: "col_3", header: "Total", field: "total", width: "25%" }
//         ]
//       },
//       data_binding: { field: "items", type: "array" }
//     });
//   }
//
//   return (
//     <div style={{ width: 220, padding: 12, borderRight: "1px solid #eee" }}>
//       <h3>Components</h3>
//       <button style={{ display: "block", margin: "8px 0" }} onClick={addText}>Add Text</button>
//       <button style={{ display: "block", margin: "8px 0" }} onClick={addImage}>Add Image</button>
//       <button style={{ display: "block", margin: "8px 0" }} onClick={addTable}>Add Table</button>
//
//       <hr />
//       <small>Drag & resize a component on the canvas. Click to select.</small>
//     </div>
//   );
// }
import React from "react";

function id(prefix = "comp") {
  return prefix + "_" + Math.random().toString(36).slice(2, 9);
}

export default function Sidebar({ onAdd }) {
  function addText() {
    onAdd({
      id: id("text"),
      type: "text",
      position: { x: 20, y: 20 },
      size: { width: 300, height: 30 },
      properties: {
        content: "New text",
        font_size: 14,
        font_weight: "normal",
        color: "#000000",
        alignment: "left"
      },
      data_binding: {}
    });
  }

  function addImage() {
    onAdd({
      id: id("image"),
      type: "image",
      position: { x: 20, y: 70 },
      size: { width: 120, height: 60 },
      properties: {
        src: "",
        alt: "Image"
      },
      data_binding: {}
    });
  }

  function addTable() {
    onAdd({
      id: id("table"),
      type: "table",
      position: { x: 20, y: 150 },
      size: { width: 555, height: 200 },
      properties: {
        border: true,
        columns: [
          { id: "col_1", header: "Item", field: "product_name", width: "50%" },
          { id: "col_2", header: "Qty", field: "quantity", width: "25%" },
          { id: "col_3", header: "Total", field: "total", width: "25%" }
        ],
        rows: [
          { product_name: "", quantity: "", total: "" }
        ]
      },
      data_binding: { field: "items", type: "array" }
    });
  }

  function addDivider() {
    onAdd({
      id: id("divider"),
      type: "divider",
      position: { x: 20, y: 200 },
      size: { width: 555, height: 2 },
      properties: {}
    });
  }

  function addBox() {
    onAdd({
      id: id("box"),
      type: "box",
      position: { x: 40, y: 240 },
      size: { width: 200, height: 80 },
      properties: { fill: "#fff" },
      data_binding: {}
    });
  }

  return (
    <div className="sidebar">
      <h3>Components</h3>
      <button onClick={addText} className="btn block">Add Text</button>
      <button onClick={addImage} className="btn block">Add Image</button>
      <button onClick={addTable} className="btn block">Add Table</button>
      <button onClick={addDivider} className="btn block">Add Divider</button>
      <button onClick={addBox} className="btn block">Add Box</button>

      <hr />
      <small>Drag & resize a component on the canvas. Click to select.</small>
    </div>
  );
}
