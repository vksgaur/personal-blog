// Netlify Function: create-post
// Creates a Markdown file in /posts and commits to GitHub via Contents API

export default async (req, context) => {
  try {
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
    }
    const env = context.env || process.env;

    const {
      GITHUB_TOKEN,
      GITHUB_REPO,
      GITHUB_BRANCH = 'main',
      API_TOKEN,
      POSTS_DIR = 'posts',
      COMMIT_AUTHOR_NAME = 'Content Bot',
      COMMIT_AUTHOR_EMAIL = 'bot@example.com',
      TIMEZONE = 'Asia/Kolkata'
    } = env;

    if (!GITHUB_TOKEN || !GITHUB_REPO || !API_TOKEN) {
      return new Response(JSON.stringify({ error: 'Server not configured. Missing env vars.' }), { status: 500 });
    }

    const body = await req.json();
    const {
      token,
      title,
      slug,
      date,
      category = 'General',
      tags = [],
      cover = '',
      excerpt = '',
      body: content = ''
    } = body || {};

    if (!token || token !== API_TOKEN) {
      return new Response(JSON.stringify({ error: 'Unauthorized: invalid API token.' }), { status: 401 });
    }
    if (!title || !slug) {
      return new Response(JSON.stringify({ error: 'Title and slug are required.' }), { status: 400 });
    }

    // Format date to ISO in desired timezone (fallback to current)
    const now = new Date();
    let published = now.toISOString();
    try {
      // Best-effort: if client sent local datetime, use it; else current time
      if (date) {
        const d = new Date(date);
        if (!isNaN(d.getTime())) published = d.toISOString();
      }
    } catch {}

    // Build frontmatter
    const fm = [
      '---',
      `title: "${escapeYaml(title)}"`,
      `date: "${published}"`,
      `category: "${escapeYaml(category)}"`,
      `tags: [${(tags || []).map(t => `"${escapeYaml(t)}"`).join(', ')}]`,
      `excerpt: "${escapeYaml(excerpt)}"`,
      `cover: "${escapeYaml(cover)}"`,
      '---',
      ''
    ].join('\n');

    const md = `${fm}${content || ''}\n`;

    // Commit file to GitHub
    const path = `${POSTS_DIR.replace(/\/+$/,'')}/${slug}.md`;
    const apiBase = 'https://api.github.com';
    const [owner, repo] = GITHUB_REPO.split('/');
    const url = `${apiBase}/repos/${owner}/${repo}/contents/${encodeURIComponent(path)}`;

    // Check if file exists (to avoid overwriting unintentionally)
    let sha = null;
    {
      const headRes = await fetch(`${url}?ref=${encodeURIComponent(GITHUB_BRANCH)}`, {
        headers: { Authorization: `Bearer ${GITHUB_TOKEN}`, Accept: 'application/vnd.github+json' }
      });
      if (headRes.ok) {
        const existing = await headRes.json();
        sha = existing.sha || null;
      }
    }

    const commitMessage = sha ? `chore(posts): update ${slug}.md` : `feat(posts): add ${slug}.md`;

    const commitPayload = {
      message: commitMessage,
      content: b64encode(md),
      branch: GITHUB_BRANCH,
      committer: { name: COMMIT_AUTHOR_NAME, email: COMMIT_AUTHOR_EMAIL }
    };
    if (sha) commitPayload.sha = sha;

    const putRes = await fetch(url, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: 'application/vnd.github+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(commitPayload)
    });

    if (!putRes.ok) {
      const errText = await safeText(putRes);
      return new Response(JSON.stringify({ error: `GitHub commit failed: ${errText}` }), { status: 502 });
    }

    return new Response(JSON.stringify({ ok: true, path }), { status: 200 });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Unexpected error' }), { status: 500 });
  }
};

function b64encode(str) {
  if (typeof Buffer !== 'undefined') return Buffer.from(str, 'utf8').toString('base64');
  // Edge runtime fallback
  const encoder = new TextEncoder();
  const bytes = encoder.encode(str);
  // simple base64 for web environments
  let binary = '';
  bytes.forEach(b => { binary += String.fromCharCode(b); });
  return btoa(binary);
}

function escapeYaml(s = '') {
  return String(s).replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

async function safeText(res) {
  try { return await res.text(); } catch { return String(res.status); }
}
