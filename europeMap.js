// Pin positions for the map
const pins = [
    { id: 1, country: 'FRANCE', top: '42%', left: '40%' },
    { id: 2, country: 'ITALY', top: '48%', left: '48%' },
    { id: 3, country: 'GERMANY', top: '35%', left: '45%' },
    { id: 4, country: 'SPAIN', top: '52%', left: '32%' },
    { id: 5, country: 'UK', top: '30%', left: '35%' },
    { id: 6, country: 'SWEDEN', top: '20%', left: '48%' }
];

// Create pins on the map
function createMapPins(container, onPinClick) {
    pins.forEach(pin => {
        const pinElement = document.createElement('div');
        pinElement.className = 'map-pin';
        pinElement.style.top = pin.top;
        pinElement.style.left = pin.left;

        // Create label
        const label = document.createElement('span');
        label.className = 'map-pin-label';
        label.textContent = pin.country;
        pinElement.appendChild(label);

        // Add click handler
        pinElement.addEventListener('click', () => {
            onPinClick(pin.country);
        });

        container.appendChild(pinElement);
    });
}