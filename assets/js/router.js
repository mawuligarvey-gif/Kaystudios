// Simple data for blog posts. In a real app this could be fetched.
const BLOG_POSTS = [
  {
    slug: 'behind-the-lens',
    title: 'Behind the Lens: Crafting a Brand Film',
    date: '2025-08-12',
    image: 'assets/images/portfolio-1.svg',
    excerpt: 'From storyboard to final color grade, here’s how we build brand films that resonate.',
    content: `We begin with discovery—defining the brand's core story and audience. Our
pre-production process covers script, shot lists, and visual references. On set, we
prioritize lighting, camera movement, and authentic performance. In post, editing,
sound, and color combine to deliver emotion with clarity.`
  },
  {
    slug: 'elevating-product-photography',
    title: 'Elevating Product Photography with Light and Texture',
    date: '2025-07-02',
    image: 'assets/images/portfolio-2.svg',
    excerpt: 'Light is the language of photography. We use it to sculpt products with character.',
    content: `Macro lenses, diffused key lights, and reflective control help us shape the
look. We iterate quickly with tethered capture, emphasizing consistency and brand
feel across every asset.`
  },
  {
    slug: 'editing-for-pace',
    title: 'Editing for Pace and Narrative Flow',
    date: '2025-06-10',
    image: 'assets/images/portfolio-3.svg',
    excerpt: 'Pacing is invisible when it works—and impossible to ignore when it doesn’t.',
    content: `We cut for intention. Every shot must justify its place. Rhythm, breath, and
contrast guide how we keep attention while building meaning.`
  }
];

document.addEventListener('DOMContentLoaded', () => {
  // Blog list rendering moved to blog.js

  // Populate blog post if on post page
  const postEl = document.getElementById('blog-post');
  if (postEl) {
    const params = new URLSearchParams(location.search);
    const slug = params.get('slug');
    const post = BLOG_POSTS.find(p => p.slug === slug) || BLOG_POSTS[0];
    if (post) {
      const titleEl = document.getElementById('post-title');
      const dateEl = document.getElementById('post-date');
      const contentEl = document.getElementById('post-content');
      titleEl.textContent = post.title;
      dateEl.textContent = formatDate(post.date);
      contentEl.innerHTML = `
        <div class="placeholder-img ratio-16x9" style="background-image:url('${post.image}')"></div>
        <p>${post.content.replace(/\n/g, '<br>')}</p>
      `;
      document.title = `${post.title} — Kay Studios`;
    }
  }
});

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
}


