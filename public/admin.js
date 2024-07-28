document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const postForm = document.getElementById('postForm');
  
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const password = document.getElementById('password').value;
      if (password === 'parola') { // Înlocuiți 'yourpassword' cu parola dvs.
        loginForm.style.display = 'none';
        postForm.style.display = 'block';
      } else {
        alert('Incorrect password');
      }
    });
  
    postForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const title = document.getElementById('title').value;
      const shortText = document.getElementById('shortText').value;
      const longText = CKEDITOR.instances.longText.getData();
      const image = document.getElementById('image').files[0];
      
      const formData = new FormData();
      formData.append('title', title);
      formData.append('shortText', shortText);
      formData.append('longText', longText);
      formData.append('image', image);
  
      try {
        const response = await fetch('/api/posts', {
          method: 'POST',
          body: formData
        });
  
        if (response.ok) {
          alert('Post created successfully!');
          postForm.reset();
          CKEDITOR.instances.longText.setData('');
        } else {
          alert('Error creating post');
        }
      } catch (error) {
        console.error('Error creating post', error);
      }
    });
  });
  