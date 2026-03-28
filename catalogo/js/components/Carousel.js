import { createCard } from './Card.js';

export function createCarousel(category, profileState, onStateChange) {
    const section = document.createElement('div');
    section.className = 'slider-section';

    // Header for Title and Indicators
    const header = document.createElement('div');
    header.className = 'slider-header';

    const title = document.createElement('h2');
    title.className = 'slider-title';
    title.innerText = category.title;

    const indicators = document.createElement('div');
    indicators.className = 'slider-indicators';

    header.appendChild(title);
    header.appendChild(indicators);
    section.appendChild(header);

    const row = document.createElement('div');
    row.className = 'movie-row';

    category.items.forEach(item => {
        const itemKey = item.youtube || item.img || `${category.title}-${row.children.length}`;
        const card = createCard(item, itemKey, profileState, onStateChange);
        row.appendChild(card);
    });

    section.appendChild(row);
    return section;
}
