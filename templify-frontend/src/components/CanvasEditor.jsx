// import React, { useEffect, useRef } from "react";
// import { Stage, Layer, Rect, Text, Image, Group } from "react-konva";
// import Konva from "konva";
// import useImage from "use-image";
// import { Transformer } from "react-konva";
//
// function URLImage({ src, x, y, width, height, isSelected, onSelect, onChange }) {
//   const [image] = useImage(src, "anonymous");
//   const shapeRef = useRef();
//   const trRef = useRef();
//
//   useEffect(() => {
//     if (isSelected) {
//       trRef.current.nodes([shapeRef.current]);
//       trRef.current.getLayer().batchDraw();
//     }
//   }, [isSelected]);
//
//   return (
//     <>
//       <Image
//         image={image}
//         x={x}
//         y={y}
//         width={width}
//         height={height}
//         draggable
//         onClick={onSelect}
//         onTap={onSelect}
//         ref={shapeRef}
//         onDragEnd={(e) => {
//           onChange({ x: e.target.x(), y: e.target.y() });
//         }}
//         onTransformEnd={(e) => {
//           const node = shapeRef.current;
//           const scaleX = node.scaleX();
//           const scaleY = node.scaleY();
//           node.scaleX(1);
//           node.scaleY(1);
//           onChange({
//             x: node.x(),
//             y: node.y(),
//             width: Math.max(5, node.width() * scaleX),
//             height: Math.max(5, node.height() * scaleY)
//           });
//         }}
//       />
//       {isSelected && <Transformer ref={trRef} />}
//     </>
//   );
// }
//
// export default function CanvasEditor({ template, setTemplate, selectedId, setSelectedId }) {
//   const stageRef = useRef();
//
//   // page size → convert A4 into px (simple rule: A4 portrait 595 x 842 points at 72dpi)
//   const pageWidth = 595;
//   const pageHeight = 842;
//
//   function handleSelectComponent(id) {
//     setSelectedId(id);
//   }
//
//   function handleChangeComponent(id, patch) {
//     setTemplate(prev => {
//       const comps = prev.components.map(c => c.id === id ? { ...c, position: { ...c.position, ...(patch.x !== undefined ? { x: patch.x } : {}) , ...(patch.y !== undefined ? { y: patch.y } : {}) }, size: { ...c.size, ...(patch.width !== undefined ? { width: patch.width } : {}), ...(patch.height !== undefined ? { height: patch.height } : {}) }, properties: { ...c.properties, ...patch.properties } } : c);
//       return { ...prev, components: comps };
//     });
//   }
//
//   return (
//     <div style={{ padding: 12, flex: 1, display: "flex", justifyContent: "center", alignItems: "flex-start" }}>
//       <div style={{ border: "1px solid #ddd", background: "white", width: pageWidth, height: pageHeight }}>
//         <Stage width={pageWidth} height={pageHeight} ref={stageRef}>
//           <Layer>
//             {/* render components */}
//             {template.components.map(comp => {
//               if (comp.type === "text") {
//                 const isSelected = selectedId === comp.id;
//                 return (
//                   <React.Fragment key={comp.id}>
//                     <Text
//                       x={comp.position.x}
//                       y={comp.position.y}
//                       text={comp.properties.content}
//                       fontSize={comp.properties.font_size || 14}
//                       fontStyle={comp.properties.font_weight === "bold" ? "bold" : "normal"}
//                       width={comp.size.width}
//                       draggable
//                       onClick={() => handleSelectComponent(comp.id)}
//                       onDragEnd={e => handleChangeComponent(comp.id, { x: e.target.x(), y: e.target.y() })}
//                       onTransformEnd={e => {
//                         // use node to adjust size
//                         const node = e.target;
//                         const scaleX = node.scaleX();
//                         node.scaleX(1);
//                         handleChangeComponent(comp.id, { width: Math.max(20, node.width() * scaleX) });
//                       }}
//                     />
//                     {isSelected && <TransformerComponent nodeRef={null} />}
//                   </React.Fragment>
//                 );
//               }
//
//               if (comp.type === "image") {
//                 return (
//                   <URLImage
//                     key={comp.id}
//                     src={comp.properties.src || ""}
//                     x={comp.position.x}
//                     y={comp.position.y}
//                     width={comp.size.width}
//                     height={comp.size.height}
//                     isSelected={selectedId === comp.id}
//                     onSelect={() => handleSelectComponent(comp.id)}
//                     onChange={(patch) => handleChangeComponent(comp.id, patch)}
//                   />
//                 );
//               }
//
//               if (comp.type === "table") {
//                 // table render: simple rectangle with header text for MVP
//                 return (
//                   <Group key={comp.id}>
//                     <Rect
//                       x={comp.position.x}
//                       y={comp.position.y}
//                       width={comp.size.width}
//                       height={120}
//                       fill="#fff"
//                       stroke={comp.properties.border ? "#e2e8f0" : null}
//                       onClick={() => handleSelectComponent(comp.id)}
//                       draggable
//                       onDragEnd={e => handleChangeComponent(comp.id, { x: e.target.x(), y: e.target.y() })}
//                     />
//                     <Text x={comp.position.x + 8} y={comp.position.y + 8} text={"Table: " + (comp.properties.columns?.map(c => c.header).join(" | ") || "")} fontSize={12} />
//                   </Group>
//                 );
//               }
//
//               return null;
//             })}
//           </Layer>
//         </Stage>
//       </div>
//     </div>
//   );
// }
//
// // Simple Transformer wrapper (if needed)
// function TransformerComponent({ nodeRef }) {
//   const ref = useRef();
//   useEffect(() => {
//     if (!nodeRef?.current) return;
//     ref.current.nodes([nodeRef.current]);
//     ref.current.getLayer().batchDraw();
//   }, [nodeRef]);
//   return <Transformer ref={ref} />;
// }
import React, { useEffect, useRef } from "react";
import { Stage, Layer, Rect, Text, Image, Group, Line } from "react-konva";
import useImage from "use-image";
import { Transformer } from "react-konva";

function URLImage({ src, x, y, width, height, isSelected, onSelect, onChange }) {
  const [image] = useImage(src, "anonymous");
  const shapeRef = useRef();
  const trRef = useRef();

  useEffect(() => {
    if (isSelected && trRef.current && shapeRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  return (
    <>
      <Image
        image={image}
        x={x}
        y={y}
        width={width}
        height={height}
        draggable
        onClick={onSelect}
        onTap={onSelect}
        ref={shapeRef}
        onDragEnd={(e) => {
          onChange({ x: e.target.x(), y: e.target.y() });
        }}
        onTransformEnd={(e) => {
          const node = shapeRef.current;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();
          node.scaleX(1);
          node.scaleY(1);
          onChange({
            x: node.x(),
            y: node.y(),
            width: Math.max(5, node.width() * scaleX),
            height: Math.max(5, node.height() * scaleY)
          });
        }}
      />
      {isSelected && <Transformer ref={trRef} />}
    </>
  );
}

function Divider({ x, y, width, isSelected, onSelect, onChange }) {
  const ref = useRef();
  const tr = useRef();
  useEffect(() => {
    if (isSelected && tr.current && ref.current) {
      tr.current.nodes([ref.current]);
      tr.current.getLayer().batchDraw();
    }
  }, [isSelected]);
  return (
    <>
      <Line
        points={[x, y, x + width, y]}
        strokeWidth={2}
        onClick={onSelect}
        ref={ref}
        draggable
        onDragEnd={e => onChange({ x: e.target.x(), y: e.target.y() })}
      />
      {isSelected && <Transformer ref={tr} enabledAnchors={['left','right']} rotateEnabled={false} />}
    </>
  );
}

function Box({ x, y, width, height, isSelected, onSelect, onChange, fill }) {
  const ref = useRef();
  const tr = useRef();
  useEffect(() => {
    if (isSelected && tr.current && ref.current) {
      tr.current.nodes([ref.current]);
      tr.current.getLayer().batchDraw();
    }
  }, [isSelected]);
  return (
    <>
      <Rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={fill || "#f3f4f6"}
        shadowBlur={2}
        onClick={onSelect}
        draggable
        ref={ref}
        onDragEnd={e => onChange({ x: e.target.x(), y: e.target.y() })}
        onTransformEnd={e => {
          const node = ref.current;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();
          node.scaleX(1); node.scaleY(1);
          onChange({ x: node.x(), y: node.y(), width: Math.max(10, node.width() * scaleX), height: Math.max(10, node.height() * scaleY) });
        }}
      />
      {isSelected && <Transformer ref={tr} />}
    </>
  );
}

// Simple table render for preview - supports dynamic columns & rows
function TablePreview({ comp, isSelected, onSelect, onChange }) {
  const { position, size, properties } = comp;
  const rows = properties.rows || [];
  const cols = properties.columns || [];
  const cellWidth = (size.width - 8) / Math.max(1, cols.length);
  const headerHeight = 28;
  const rowHeight = 22;

  return (
    <Group x={position.x} y={position.y} onClick={onSelect} draggable onDragEnd={e => onChange({ x: e.target.x(), y: e.target.y() })}>
      <Rect width={size.width} height={headerHeight + rows.length * rowHeight + 8} stroke="#e5e7eb" fill="#fff" />
      {cols.map((c, i) => (
        <Group key={c.id}>
          <Rect x={i * cellWidth + 4} y={4} width={cellWidth} height={headerHeight} fill="#f9fafb" stroke="#e6e6e6" />
          <Text x={i * cellWidth + 8} y={8} text={c.header} fontSize={12} />
        </Group>
      ))}
      {rows.map((r, ri) => cols.map((c, ci) => (
        <Text key={`${ri}-${ci}`} x={ci * cellWidth + 8} y={headerHeight + 8 + ri * rowHeight} text={String(r[c.field] ?? "")} fontSize={11} />
      )))}
    </Group>
  );
}

export default function CanvasEditor({ template, setTemplate, selectedId, setSelectedId }) {
  const stageRef = useRef();
  const pageWidth = 595;
  const pageHeight = 842;

  function handleSelectComponent(id) {
    setSelectedId(id);
  }

  function handleChangeComponent(id, patch) {
    setTemplate(prev => {
      const comps = prev.components.map(c => {
        if (c.id !== id) return c;
        const newPos = { ...(c.position || {}), ...(patch.x !== undefined ? { x: patch.x } : {}), ...(patch.y !== undefined ? { y: patch.y } : {}) };
        const newSize = { ...(c.size || {}), ...(patch.width !== undefined ? { width: patch.width } : {}), ...(patch.height !== undefined ? { height: patch.height } : {}) };
        const newProps = { ...(c.properties || {}), ...(patch.properties || {}) };
        return { ...c, position: newPos, size: newSize, properties: newProps };
      });
      return { ...prev, components: comps };
    });
  }

  return (
    <div className="canvas-wrap">
      <div className="page-frame">
        <Stage width={pageWidth} height={pageHeight} ref={stageRef}>
          <Layer>
            {template.components.map(comp => {
              const isSelected = selectedId === comp.id;
              if (comp.type === "text") {
                return (
                  <React.Fragment key={comp.id}>
                    <Text
                      x={comp.position.x}
                      y={comp.position.y}
                      text={comp.properties.content}
                      fontSize={comp.properties.font_size || 14}
                      fontStyle={comp.properties.font_weight === "bold" ? "bold" : "normal"}
                      width={comp.size.width}
                      draggable
                      onClick={() => handleSelectComponent(comp.id)}
                      onDragEnd={e => handleChangeComponent(comp.id, { x: e.target.x(), y: e.target.y() })}
                      onTransformEnd={e => {
                        const node = e.target;
                        const scaleX = node.scaleX();
                        node.scaleX(1);
                        handleChangeComponent(comp.id, { width: Math.max(20, node.width() * scaleX) });
                      }}
                      fill={comp.properties.color || "#111"}
                    />
                    {isSelected && <Transformer nodes={[/* not using ref-based wrapper here for brevity */]} />}
                  </React.Fragment>
                );
              }

              if (comp.type === "image") {
                return (
                  <URLImage
                    key={comp.id}
                    src={comp.properties.src || ""}
                    x={comp.position.x}
                    y={comp.position.y}
                    width={comp.size.width}
                    height={comp.size.height}
                    isSelected={isSelected}
                    onSelect={() => handleSelectComponent(comp.id)}
                    onChange={(patch) => handleChangeComponent(comp.id, patch)}
                  />
                );
              }

              if (comp.type === "table") {
                return (
                  <TablePreview
                    key={comp.id}
                    comp={comp}
                    isSelected={isSelected}
                    onSelect={() => handleSelectComponent(comp.id)}
                    onChange={patch => handleChangeComponent(comp.id, patch)}
                  />
                );
              }

              if (comp.type === "divider") {
                return (
                  <Divider
                    key={comp.id}
                    x={comp.position.x}
                    y={comp.position.y}
                    width={comp.size.width}
                    isSelected={isSelected}
                    onSelect={() => handleSelectComponent(comp.id)}
                    onChange={patch => handleChangeComponent(comp.id, patch)}
                  />
                );
              }

              if (comp.type === "box") {
                return (
                  <Box
                    key={comp.id}
                    x={comp.position.x}
                    y={comp.position.y}
                    width={comp.size.width}
                    height={comp.size.height}
                    isSelected={isSelected}
                    onSelect={() => handleSelectComponent(comp.id)}
                    onChange={patch => handleChangeComponent(comp.id, patch)}
                    fill={comp.properties.fill}
                  />
                );
              }

              return null;
            })}
          </Layer>
        </Stage>
      </div>
    </div>
  );
}
