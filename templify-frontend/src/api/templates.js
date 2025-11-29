const API_BASE = "http://127.0.0.1:8000";

export async function saveTemplate(payload) {
  const res = await fetch(`${API_BASE}/templates/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to save template");
  }
  return res.json();
}

export async function getTemplate(template_id) {
  const res = await fetch(`${API_BASE}/templates/${encodeURIComponent(template_id)}`);
  if (!res.ok) throw new Error("Failed to fetch template");
  return res.json();
}

export async function listTemplates() {
  const res = await fetch(`${API_BASE}/templates/`);
  if (!res.ok) throw new Error("Failed to list templates");
  return res.json();
}

export async function listFolders() {
  const res = await fetch(`${API_BASE}/templates/folders`);
  if (!res.ok) throw new Error("Failed to list folders");
  return res.json();
}

export async function deleteTemplateById(id) {
  const res = await fetch(`${API_BASE}/templates/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete template");
  return res.json();
}

export async function generateCode(template_id, target) {
  const res = await fetch(
    `${API_BASE}/templates/${template_id}/generate?target=${encodeURIComponent(target)}`,
    { method: "POST" }
  );
  if (!res.ok) throw new Error("Failed to generate code");
  return res.json(); // { code: "...generated code..." }
}
