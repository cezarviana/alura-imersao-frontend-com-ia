import { getYouTubeId, getRandomMatchScore, getRandomDuration, getRandomAgeBadge } from '../utils.js';

export function createCard(item, itemKey, cardState, onStateChange) {
    const isWatched = Boolean(cardState?.watched?.[itemKey]);
    const isLiked = Boolean(cardState?.liked?.[itemKey]);

    const card = document.createElement('div');
    card.className = 'movie-card';
    if (item.progress || isWatched) {
        card.classList.add('has-progress');
    }
    if (isWatched) {
        card.classList.add('watched');
    }

    const img = document.createElement('img');
    img.src = item.img;
    img.alt = `Movie cover`;

    const iframe = document.createElement('iframe');
    iframe.frameBorder = "0";
    iframe.allow = "autoplay; encrypted-media";

    const videoId = getYouTubeId(item.youtube);

    card.appendChild(iframe);
    card.appendChild(img);

    const ageBadge = getRandomAgeBadge();

    const details = document.createElement('div');
    details.className = 'card-details';
    details.innerHTML = `
        <div class="details-buttons">
            <div class="left-buttons">
                <button class="btn-icon btn-play-icon"><i class="fas fa-play" style="margin-left:2px;"></i></button>
                <button class="btn-icon btn-progress ${isWatched ? 'active' : ''}"><i class="fas ${isWatched ? 'fa-check' : 'fa-plus'}"></i></button>
                <button class="btn-icon btn-like ${isLiked ? 'active' : ''}"><i class="fas fa-thumbs-up"></i></button>
            </div>
            <div class="right-buttons">
                <button class="btn-icon"><i class="fas fa-chevron-down"></i></button>
            </div>
        </div>
        <div class="details-info">
            <span class="match-score">${getRandomMatchScore()}% relevante</span>
            <span class="age-badge ${ageBadge.class}">${ageBadge.text}</span>
            <span class="duration">${getRandomDuration(item.progress || isWatched)}</span>
            <span class="resolution">HD</span>
        </div>
        <div class="details-tags">
            <span>Empolgante</span>
            <span>Animação</span>
            <span>Ficção</span>
        </div>
    `;
    card.appendChild(details);

    const progressValue = (item.progress && item.progress > 0) || isWatched ? 100 : 0;
    const pbContainer = document.createElement('div');
    pbContainer.className = 'progress-bar-container';
    const pbValue = document.createElement('div');
    pbValue.className = 'progress-value';
    pbValue.style.width = `${progressValue}%`;
    pbContainer.appendChild(pbValue);
    card.appendChild(pbContainer);

    const progressBtn = details.querySelector('.btn-progress');
    const likeBtn = details.querySelector('.btn-like');

    const toggleWatch = () => {
        const newWatched = !Boolean(cardState?.watched?.[itemKey]);
        if (!cardState.watched) cardState.watched = {};
        cardState.watched[itemKey] = newWatched;

        progressBtn.classList.toggle('active', newWatched);
        progressBtn.innerHTML = `<i class="fas ${newWatched ? 'fa-check' : 'fa-plus'}"></i>`;
        card.classList.toggle('watched', newWatched);
        card.classList.toggle('has-progress', newWatched);
        pbValue.style.width = newWatched ? '100%' : '0%';

        onStateChange('watched', itemKey, newWatched);
    };

    const toggleLike = () => {
        const newLiked = !Boolean(cardState?.liked?.[itemKey]);
        if (!cardState.liked) cardState.liked = {};
        cardState.liked[itemKey] = newLiked;

        likeBtn.classList.toggle('active', newLiked);
        onStateChange('liked', itemKey, newLiked);
    };

    progressBtn.addEventListener('click', toggleWatch);
    likeBtn.addEventListener('click', toggleLike);

    let playTimeout;
    card.addEventListener('mouseenter', () => {
        const rect = card.getBoundingClientRect();
        const windowWidth = window.innerWidth;
        
        if (rect.left < 100) {
            card.classList.add('origin-left');
        } else if (rect.right > windowWidth - 100) {
            card.classList.add('origin-right');
        }

        playTimeout = setTimeout(() => {
            iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&modestbranding=1&loop=1&playlist=${videoId}`;
            iframe.classList.add('playing');
            img.classList.add('playing-video');
        }, 600);
    });

    card.addEventListener('mouseleave', () => {
        clearTimeout(playTimeout);
        iframe.classList.remove('playing');
        img.classList.remove('playing-video');
        iframe.src = "";
        card.classList.remove('origin-left');
        card.classList.remove('origin-right');
    });

    return card;
}
