// Initialize map
const map = L.map('map').setView([59.93, 30.36], 11);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'OpenStreetMap',
    maxZoom: 18
}).addTo(map);

let currentFilter = 'all';
let markers = {};

// Display events in sidebar
function displayEvents(filteredEvents) {
    const list = document.getElementById('eventsList');
    list.innerHTML = '';

    filteredEvents.slice(-8).reverse().forEach(event => {
        const div = document.createElement('div');
        div.className = 'event-item';
        div.innerHTML = `
            <div class="event-title">${event.title}</div>
            <div class="event-date">${event.date}</div>
        `;
        div.onclick = () => showModal(event);
        list.appendChild(div);
    });
}

// Show modal for event details
function showModal(event) {
    const modal = document.getElementById('modal');
    if (!modal) {
        createModal();
    }
    document.getElementById('modal-title').textContent = event.title;
    document.getElementById('modal-date').textContent = event.date;
    document.getElementById('modal-text').textContent = event.description;
    document.getElementById('modal-source').textContent = 'Источник: ' + event.source;
    document.getElementById('modal').style.display = 'block';
}

// Create modal if it doesn't exist
function createModal() {
    if (document.getElementById('modal')) return;
    
    const modal = document.createElement('div');
    modal.id = 'modal';
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="modal-close" onclick="closeModal()">&times;</span>
            <h3 class="modal-title" id="modal-title"></h3>
            <div class="modal-date" id="modal-date"></div>
            <div class="modal-text" id="modal-text"></div>
            <div class="modal-source" id="modal-source"></div>
        </div>
    `;
    document.body.appendChild(modal);
    modal.onclick = (e) => {
        if (e.target === modal) closeModal();
    };
}

// Close modal
function closeModal() {
    const modal = document.getElementById('modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Update map with markers
function updateMap(filteredEvents) {
    // Remove old markers
    Object.values(markers).forEach(marker => map.removeLayer(marker));
    markers = {};

    // Add new markers
    filteredEvents.forEach(event => {
        const marker = L.circleMarker([event.lat, event.lng], {
            radius: 7,
            fillColor: '#333',
            color: 'white',
            weight: 2,
            opacity: 1,
            fillOpacity: 0.8
        }).bindPopup(`<strong>${event.title}</strong><br>${event.date}`)
        .on('click', () => showModal(event))
        .addTo(map);

        markers[event.id] = marker;
    });
}

// Filter events by type
function filterEvents(type) {
    currentFilter = type;
    
    // Update button styles
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Get filtered events
    const filteredEvents = events.filter(e => 
        currentFilter === 'all' || e.type === currentFilter
    );
    
    // Update counts
    document.getElementById('visibleCount').textContent = filteredEvents.length;
    
    // Update display
    displayEvents(filteredEvents);
    updateMap(filteredEvents);
}

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    // Count total events
    document.getElementById('eventCount').textContent = events.length;
    
    // Display all events on map initially
    displayEvents(events);
    updateMap(events);
});
