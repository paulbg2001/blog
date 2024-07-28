document.addEventListener('DOMContentLoaded', () => {
  const postsDiv = document.getElementById('posts');
  const searchInput = document.getElementById('searchInput');

  // Funcție pentru a încărca toate postările
  const loadPosts = async (query = '') => {
    try {
      const response = await fetch(`/api/posts${query ? `?q=${query}` : ''}`);
      const posts = await response.json();
      if (Array.isArray(posts)) {
        postsDiv.innerHTML = posts.map(post => `
          <div class="col-md-4 mb-4">
            <div class="card" style="width: 18rem;">
              ${post.image_path ? `<img src="${post.image_path}" class="card-img-top" alt="${post.title}">` : ''}
              <div class="card-body">
                <h5 class="card-title"><strong>${post.title}</strong></h5>
                <p class="card-text">${post.short_text}</p>
                <a href="/post/${post.id}" class="btn btn-primary">Read More</a>
              </div>
            </div>
          </div>
        `).join('');
      } else {
        console.error('Unexpected response format', posts);
      }
    } catch (error) {
      console.error('Error loading posts', error);
    }
  };

  loadPosts();

  // Adaugă un event listener pentru search input
  searchInput.addEventListener('input', () => {
    const query = searchInput.value.trim();
    loadPosts(query);
  });
});
