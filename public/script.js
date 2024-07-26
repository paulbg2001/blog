document.addEventListener('DOMContentLoaded', () => {
    const postForm = document.getElementById('postForm');
    const postsDiv = document.getElementById('posts');
  
    // Funcție pentru a încărca toate postările
    const loadPosts = async () => {
      const response = await fetch('/api/posts');
      const posts = await response.json();
      postsDiv.innerHTML = posts.map(post => `
        <div class="post">
          <h3>${post.title}</h3>
          <p>${post.content}</p>
          <small>${new Date(post.created_at).toLocaleString()}</small>
        </div>
      `).join('');
    };
  
    // Funcție pentru a crea o nouă postare
    postForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const title = document.getElementById('title').value;
      const content = document.getElementById('content').value;
  
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content })
      });
  
      if (response.ok) {
        loadPosts();
        postForm.reset();
      }
    });
  
    loadPosts();
  });
  