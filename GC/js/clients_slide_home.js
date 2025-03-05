// Home Page Client Display Slider Script As BElow
document.addEventListener('DOMContentLoaded', () => {
    fetch('/clients.json')
        .then(response => response.json())
        .then(data => {
            const slideTrack = document.getElementById('slide-track');
            data.forEach(client => {
                const slide = document.createElement('div');
                slide.className = 'slide';
                const img = document.createElement('img');
                img.src = client.client_img;
                img.alt = client.alter;
                slide.appendChild(img);
                slideTrack.appendChild(slide);
            });
            // Duplicate slides to create infinite loop effect
            for (let i = 0; i < data.clients; i++) {
                const slide = slideTrack.children[i].cloneNode(true);
                slideTrack.appendChild(slide);
            }
            // Set dynamic width for the slide track based on number of slides
            slideTrack.style.width = `calc(250px * ${data.clients.length * 2})`;
        })
        .catch(error => console.error('Error loading clients:', error));
});

// Client Dispplay Slider Ends Here
