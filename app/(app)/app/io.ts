// I/O helpers — import, export, share, print

export type ExportFormat = "md" | "html" | "doc" | "txt";

export function downloadFile(content: string, name: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function htmlToMarkdown(html: string): string {
  return html
    .replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, "# $1\n\n")
    .replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, "## $1\n\n")
    .replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, "### $1\n\n")
    .replace(/<strong[^>]*>([\s\S]*?)<\/strong>/gi, "**$1**")
    .replace(/<em[^>]*>([\s\S]*?)<\/em>/gi, "_$1_")
    .replace(/<u[^>]*>([\s\S]*?)<\/u>/gi, "$1")
    .replace(/<s[^>]*>([\s\S]*?)<\/s>/gi, "~~$1~~")
    .replace(/<code[^>]*>([\s\S]*?)<\/code>/gi, "`$1`")
    .replace(/<pre[^>]*><code[^>]*>([\s\S]*?)<\/code><\/pre>/gi, "```\n$1\n```\n\n")
    .replace(/<pre[^>]*>([\s\S]*?)<\/pre>/gi, "```\n$1\n```\n\n")
    .replace(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi, "> $1\n\n")
    .replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, "- $1\n")
    .replace(/<\/(ul|ol)>/gi, "\n")
    .replace(/<(ul|ol)[^>]*>/gi, "")
    .replace(/<a[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi, "[$2]($1)")
    .replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, "$1\n\n")
    .replace(/<mark[^>]*>([\s\S]*?)<\/mark>/gi, "==$1==")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<hr\s*\/?>/gi, "\n---\n\n")
    .replace(/<img[^>]*src="([^"]+)"[^>]*alt="([^"]*)"[^>]*\/?>/gi, "![$2]($1)")
    .replace(/<img[^>]*src="([^"]+)"[^>]*\/?>/gi, "![]($1)")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

// Minimal Markdown → HTML for imports. Not spec-compliant but covers the
// common paragraph / heading / list / emphasis / link / code / rule set.
export function markdownToHtml(md: string): string {
  const lines = md.split(/\r?\n/);
  const out: string[] = [];
  let inCode = false;
  let listStack: Array<"ul" | "ol"> = [];
  let inQuote = false;

  const inline = (s: string) =>
    s
      .replace(/`([^`]+)`/g, "<code>$1</code>")
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      .replace(/__([^_]+)__/g, "<strong>$1</strong>")
      .replace(/\*([^*]+)\*/g, "<em>$1</em>")
      .replace(/(?<!_)_([^_]+)_(?!_)/g, "<em>$1</em>")
      .replace(/~~([^~]+)~~/g, "<s>$1</s>")
      .replace(/==([^=]+)==/g, "<mark>$1</mark>")
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

  const closeLists = () => {
    while (listStack.length) {
      out.push(`</${listStack.pop()}>`);
    }
  };
  const closeQuote = () => {
    if (inQuote) {
      out.push("</blockquote>");
      inQuote = false;
    }
  };

  for (const raw of lines) {
    const line = raw;
    if (/^```/.test(line.trim())) {
      if (inCode) {
        out.push("</code></pre>");
        inCode = false;
      } else {
        closeLists();
        closeQuote();
        out.push("<pre><code>");
        inCode = true;
      }
      continue;
    }
    if (inCode) {
      out.push(line + "\n");
      continue;
    }
    if (/^\s*$/.test(line)) {
      closeLists();
      closeQuote();
      continue;
    }
    // Headings
    const h = line.match(/^(#{1,6})\s+(.*)$/);
    if (h) {
      closeLists();
      closeQuote();
      const level = h[1].length;
      out.push(`<h${level}>${inline(h[2])}</h${level}>`);
      continue;
    }
    // HR
    if (/^\s*(---|\*\*\*|___)\s*$/.test(line)) {
      closeLists();
      closeQuote();
      out.push("<hr />");
      continue;
    }
    // Quote
    const q = line.match(/^>\s?(.*)$/);
    if (q) {
      if (!inQuote) {
        closeLists();
        out.push("<blockquote>");
        inQuote = true;
      }
      out.push(`<p>${inline(q[1])}</p>`);
      continue;
    } else {
      closeQuote();
    }
    // Ordered list
    const ol = line.match(/^\s*\d+\.\s+(.*)$/);
    if (ol) {
      if (listStack[listStack.length - 1] !== "ol") {
        closeLists();
        out.push("<ol>");
        listStack.push("ol");
      }
      out.push(`<li>${inline(ol[1])}</li>`);
      continue;
    }
    // Unordered list
    const ul = line.match(/^\s*[-*+]\s+(.*)$/);
    if (ul) {
      if (listStack[listStack.length - 1] !== "ul") {
        closeLists();
        out.push("<ul>");
        listStack.push("ul");
      }
      out.push(`<li>${inline(ul[1])}</li>`);
      continue;
    }
    // Paragraph
    closeLists();
    out.push(`<p>${inline(line)}</p>`);
  }
  closeLists();
  closeQuote();
  if (inCode) out.push("</code></pre>");
  return out.join("\n");
}

// Word-friendly HTML document (Microsoft Word can open .doc files that are
// actually HTML). Not a real .docx but recognized by Word and Pages.
export function htmlToWordDoc(bodyHtml: string, title: string): string {
  return `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
<head>
<meta charset="utf-8" />
<title>${escapeHtml(title)}</title>
<style>
  body { font-family: Georgia, serif; font-size: 12pt; line-height: 1.6; color: #1a1a1a; max-width: 720px; margin: 40px auto; }
  h1 { font-size: 24pt; margin-top: 0; }
  h2 { font-size: 18pt; }
  h3 { font-size: 14pt; }
  blockquote { border-left: 3px solid #b46a26; padding-left: 12px; color: #666; font-style: italic; }
  code { font-family: Consolas, monospace; background: #f4ecd7; padding: 1px 4px; border-radius: 3px; }
  pre { background: #f4ecd7; padding: 10px; border-radius: 6px; }
  mark { background: #ffe082; }
  a { color: #b46a26; }
</style>
</head>
<body>${bodyHtml}</body>
</html>`;
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// Read a File as text with mime-aware parsing.
export async function readImportedFile(file: File): Promise<{ html: string; suggestedTitle: string }> {
  const text = await file.text();
  const nameNoExt = file.name.replace(/\.[^.]+$/, "");
  const ext = (file.name.split(".").pop() || "").toLowerCase();
  if (ext === "md" || ext === "markdown") {
    return { html: markdownToHtml(text), suggestedTitle: nameNoExt };
  }
  if (ext === "html" || ext === "htm") {
    const bodyMatch = text.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    return { html: bodyMatch ? bodyMatch[1] : text, suggestedTitle: nameNoExt };
  }
  if (ext === "txt" || file.type.startsWith("text/plain") || !ext) {
    const html = text
      .split(/\n{2,}/)
      .map((p) => `<p>${escapeHtml(p).replace(/\n/g, "<br />")}</p>`)
      .join("\n");
    return { html, suggestedTitle: nameNoExt };
  }
  // Fallback: treat as plain text
  return {
    html: `<p>${escapeHtml(text)}</p>`,
    suggestedTitle: nameNoExt,
  };
}
