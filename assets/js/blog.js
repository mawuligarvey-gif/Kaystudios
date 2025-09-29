// Blog loader: reads posts/index.json, fetches .md files, parses frontmatter and renders cards
(function () {
  document.addEventListener('DOMContentLoaded', async () => {
    const container = document.getElementById('blog-list');
    if (!container) return;

    try {
      const index = await fetchJson('posts/index.json');
      if (!Array.isArray(index) || index.length === 0) {
        container.innerHTML = emptyStateHtml();
        return;
      }

      const posts = await Promise.all(index.map(loadPost));
      // sort by date desc
      posts.sort((a, b) => new Date(b.date) - new Date(a.date));

      container.innerHTML = posts.map(postCardHtml).join('');
    } catch (err) {
      container.innerHTML = emptyStateHtml();
      // Optionally log: console.error(err);
    }
  });

  async function fetchJson(path) {
    const res = await fetch(path, { cache: 'no-cache' });
    if (!res.ok) throw new Error('Failed to load ' + path);
    return await res.json();
  }

  async function loadPost(filename) {
    const path = `posts/${filename}`;
    const res = await fetch(path, { cache: 'no-cache' });
    if (!res.ok) throw new Error('Failed to load ' + path);
    const text = await res.text();
    const { meta, body } = parseFrontmatter(text);
    const excerpt = body.trim().slice(0, 150).replace(/\s+/g, ' ');
    return {
      slug: filename.replace(/\.md$/i, ''),
      title: meta.title || 'Untitled',
      date: meta.date || new Date().toISOString().slice(0, 10),
      thumbnail: meta.thumbnail || 'assets/images/portfolio-1.svg',
      excerpt
    };
  }

  function parseFrontmatter(text) {
    // Expecting: ---\nkey: value\n...\n---\nbody
    if (!text.startsWith('---')) return { meta: {}, body: text };
    const end = text.indexOf('\n---', 3);
    if (end === -1) return { meta: {}, body: text };
    const fm = text.slice(3, end).trim();
    const body = text.slice(end + 4).trim();
    const meta = {};
    fm.split(/\r?\n/).forEach(line => {
      const m = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
      if (m) meta[m[1]] = m[2];
    });
    return { meta, body };
  }

  function postCardHtml(post) {
    return `
      <article class="blog-item">
        <a href="post.html?slug=${encodeURIComponent(post.slug)}">
          <div class="placeholder-img ratio-4x3" style="background-image:url('${post.thumbnail}')"></div>
          <h3>${escapeHtml(post.title)}</h3>
          <div class="meta">${formatDate(post.date)}</div>
          <p>${escapeHtml(post.excerpt)}${post.excerpt.length >= 150 ? '…' : ''}</p>
          <span class="btn btn-outline" aria-label="Read more about ${escapeHtml(post.title)}">Read More</span>
        </a>
      </article>
    `;
  }

  function escapeHtml(s) {
    return s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  function formatDate(iso) {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
  }

  function emptyStateHtml() {
    return '<p class="muted">No blog posts yet. Check back soon!</p>';
  }
})();


