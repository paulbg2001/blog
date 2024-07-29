document.addEventListener('DOMContentLoaded', () => {
  const postsDiv = document.getElementById('posts');
  const searchInput = document.getElementById('searchInput');

  // Funcție pentru a încărca toate postările
  const loadPosts = async (query = '') => {
    try {
      const response = await fetch(`/api/posts${query ? `?q=${query}` : ''}`);
      const posts = await response.json();
      if (Array.isArray(posts)) {
        postsDiv.innerHTML = posts.map(post => {
          // Convertirea datei într-un format simplu (fără ora)
          const formattedDate = new Date(post.created_at).toLocaleDateString('en-GB', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
          });
          return `
            <div class="col-md-4 mb-4">
              <div class="card" style="width: 18rem;">
                ${post.image_path ? `<img src="${post.image_path}" class="card-img-top" alt="${post.title}">` : ''}
                <div class="card-body">
                  <h5 class="card-title"><strong>${post.title}</strong></h5>
                  <p class="card-text">${post.short_text}</p>
                  <p class="card-text">${formattedDate}</p>
                  <a href="/post/${post.id}" class="btn btn-primary">Read More</a>
                </div>
              </div>
            </div>
          `;
        }).join('');
      } else {
        console.error('Unexpected response format', posts);
      }
    } catch (error) {
      console.error('Error loading posts', error);
    }
  };

  // Încarcă toate postările la început
  loadPosts();

  // Adaugă un event listener pentru search input
  searchInput.addEventListener('input', () => {
    const query = searchInput.value.trim();
    loadPosts(query);
  });
});
