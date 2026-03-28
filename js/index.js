const profiles = document.querySelectorAll('.profiles a');

profiles.forEach((profile, index) => {
    const profileId = `perfil-${index + 1}`;
    const profileName = `Perfil ${index + 1}`;
    const profileImageFilename = `perfil-${index + 1}.png`;
    const profileImagePath = `../src/images/${profileImageFilename}`; // caminho que funciona na tela de catálogo via redirect

    profile.dataset.perfil = profileId;
    profile.dataset.nome = profileName;
    profile.dataset.imagem = profileImagePath;

    profile.addEventListener('click', () => {
        localStorage.setItem('perfilAtivoId', profileId);
        localStorage.setItem('perfilAtivoNome', profileName);
        localStorage.setItem('perfilAtivoImagem', profileImagePath);
    });
});