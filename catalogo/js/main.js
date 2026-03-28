import { categories } from './data.js';
import { createCarousel } from './components/Carousel.js';

const getPerfilAtivoId = () => localStorage.getItem('perfilAtivoId') || 'perfil-1';
const getPerfilCatalogStateKey = perfilId => `catalogState_${perfilId}`;
const getPerfilCatalogContentKey = perfilId => `catalogContent_${perfilId}`;

const readCatalogStateForPerfil = (perfilId) => {
    const raw = localStorage.getItem(getPerfilCatalogStateKey(perfilId));
    return raw ? JSON.parse(raw) : { watched: {}, liked: {} };
};

const writeCatalogStateForPerfil = (perfilId, state) => {
    localStorage.setItem(getPerfilCatalogStateKey(perfilId), JSON.stringify(state));
};

const readCatalogContentForPerfil = (perfilId) => {
    const raw = localStorage.getItem(getPerfilCatalogContentKey(perfilId));
    if (raw) {
        try {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) return parsed;
        } catch (error) {
            console.warn('catalogo/user content JSON inválido', error);
        }
    }
    return categories;
};

const writeCatalogContentForPerfil = (perfilId, content) => {
    localStorage.setItem(getPerfilCatalogContentKey(perfilId), JSON.stringify(content));
};

const handleStateChange = (perfilId, catalogState, tipo, itemKey, value) => {
    catalogState[tipo] = catalogState[tipo] || {};
    catalogState[tipo][itemKey] = value;
    writeCatalogStateForPerfil(perfilId, catalogState);
};

const updateCatalogoAtualDoPerfil = (perfilId, novoCatalogo) => {
    if (!Array.isArray(novoCatalogo)) {
        console.error('Novo catálogo deve ser array de categories');
        return;
    }
    writeCatalogContentForPerfil(perfilId, novoCatalogo);
    location.reload();
};

const resetCatalogoAtualDoPerfil = (perfilId) => {
    localStorage.removeItem(getPerfilCatalogContentKey(perfilId));
    location.reload();
};

window.catalogoPorPerfil = {
    getCurrentPerfilId: getPerfilAtivoId,
    getCurrentCatalog: () => readCatalogContentForPerfil(getPerfilAtivoId()),
    setCatalog: (novoConteudo) => updateCatalogoAtualDoPerfil(getPerfilAtivoId(), novoConteudo),
    resetCatalog: () => resetCatalogoAtualDoPerfil(getPerfilAtivoId())
};

document.addEventListener('DOMContentLoaded', () => {
    const perfilId = getPerfilAtivoId();
    const nomePerfil = localStorage.getItem('perfilAtivoNome');
    const imagemPerfil = localStorage.getItem('perfilAtivoImagem');

    if (nomePerfil && imagemPerfil) {
        const kidsLink = document.querySelector('.kids-link');
        const profileIcon = document.querySelector('.profile-icon');
        
        if (kidsLink) kidsLink.textContent = nomePerfil;
        if (profileIcon) profileIcon.src = imagemPerfil;
    }

    const profileCatalogState = readCatalogStateForPerfil(perfilId);
    const profileCatalogContent = readCatalogContentForPerfil(perfilId);

    const container = document.getElementById('main-content');
    
    if (container) {
        profileCatalogContent.forEach(category => {
            const carousel = createCarousel(category, profileCatalogState, (tipo, itemKey, value) => {
                handleStateChange(perfilId, profileCatalogState, tipo, itemKey, value);
            });
            container.appendChild(carousel);
        });
    }
});
