document.addEventListener('DOMContentLoaded', () => {
    // Assurer que la hauteur est correcte pour les appareils mobiles
    const setVh = () => {
        let vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    
    // Exécuter au chargement et lors du redimensionnement
    setVh();
    window.addEventListener('resize', setVh);
    
    // Fonction simplifiée pour garantir une mise en page verticale avec défilement
    const adaptLayout = () => {
        // Toujours activer le défilement, peu importe l'orientation
        document.body.style.overflowY = 'auto';
        document.body.style.height = 'auto';
        
        const footer = document.querySelector('.footer');
        const socialLinks = document.querySelector('.social-links');
        
        // Si la hauteur est très limitée, rendre le footer normal (non fixe)
        if (window.innerHeight < 600) {
            document.documentElement.style.setProperty('--profile-size', 'clamp(80px, 15vw, 150px)');
            document.documentElement.style.setProperty('--margin-between-elements', 'clamp(8px, 1.5vh, 15px)');
            
            // Rendre le footer relatif pour permettre le défilement complet
            if (footer) {
                footer.style.position = 'relative';
            }
            if (socialLinks) {
                socialLinks.style.position = 'relative';
            }
            
            // Ajouter un padding-bottom supplémentaire au main pour éviter que le contenu soit caché derrière le footer
            const main = document.querySelector('main');
            if (main) {
                main.style.paddingBottom = 'var(--margin-between-elements)';
            }
        } else {
            // Restaurer les valeurs par défaut si la hauteur est suffisante
            document.documentElement.style.setProperty('--profile-size', 'clamp(105px, 22.5vw, 225px)');
            document.documentElement.style.setProperty('--margin-between-elements', 'clamp(12px, 2vh, 20px)');
            
            // Remettre le footer en position fixe
            if (footer) {
                footer.style.position = 'fixed';
            }
            if (socialLinks) {
                socialLinks.style.position = 'fixed';
            }
            
            // Remettre le padding du main pour compenser le footer fixe
            const main = document.querySelector('main');
            if (main) {
                main.style.paddingBottom = 'calc(var(--icon-size) + 35px)';
            }
        }
    };
    
    // Exécuter au chargement et lors du redimensionnement
    adaptLayout();
    window.addEventListener('resize', adaptLayout);
    window.addEventListener('orientationchange', adaptLayout);
    
    // Appliquer les liens des variables CSS aux boutons
    const applyLinks = () => {
        // Obtenir les styles computés
        const style = getComputedStyle(document.documentElement);
        
        // Fonction pour extraire l'URL des propriétés CSS
        const getLink = (prop) => {
            const value = style.getPropertyValue(prop).trim();
            // Extraire l'URL entre parenthèses et guillemets
            const match = value.match(/url\(['"]?([^'")]+)['"]?\)/);
            return match ? match[1] : '#';
        };
        
        // S'assurer que tous les liens s'ouvrent dans un nouvel onglet
        document.querySelectorAll('a').forEach(link => {
            if (!link.hasAttribute('target')) {
                link.setAttribute('target', '_blank');
                link.setAttribute('rel', 'noopener noreferrer');
            }
        });
        
        // Appliquer les liens aux boutons principaux
        document.querySelector('.main-btn').href = getLink('--link-main-btn');
        
        if (!document.querySelector('.secondary-btn').classList.contains('hidden')) {
            document.querySelector('.secondary-btn').href = getLink('--link-secondary-btn');
        }
        
        // Bouton de donation
        const donationBtn = document.querySelector('.donation-btn');
        if (donationBtn) {
            donationBtn.href = getLink('--link-donation');
        }
        
        // Appliquer aux boutons textuels
        const textBtns = document.querySelectorAll('.text-btn');
        if (textBtns.length > 0) textBtns[0].href = getLink('--link-text-btn-1');
        if (textBtns.length > 1) textBtns[1].href = getLink('--link-text-btn-2');
        
        // Appliquer aux boutons discrets
        const discreteBtns = document.querySelectorAll('.discrete-btn');
        if (discreteBtns.length > 0 && discreteBtns[0].id !== 'license-btn') discreteBtns[0].href = getLink('--link-discrete-btn-1');
        if (discreteBtns.length > 1 && discreteBtns[1].id !== 'license-btn') discreteBtns[1].href = getLink('--link-discrete-btn-2');
        if (discreteBtns.length > 2 && discreteBtns[2].id !== 'license-btn') discreteBtns[2].href = getLink('--link-discrete-btn-3');
        
        // Appliquer aux liens sociaux
        const socialLinks = document.querySelectorAll('.social-links a');
        if (socialLinks.length > 0) socialLinks[0].href = getLink('--link-social-1');
        if (socialLinks.length > 1) socialLinks[1].href = getLink('--link-social-2');
        if (socialLinks.length > 2) socialLinks[2].href = getLink('--link-social-3');
        
        // Créer les éléments audio cachés et associer les sources
        const createAudio = (audioUrl, trackTitle) => {
            const audio = document.createElement('audio');
            audio.src = audioUrl;
            audio.id = `audio-${trackTitle.toLowerCase()}`;
            audio.style.display = 'none';
            document.body.appendChild(audio);
            return audio;
        };
        
        // Créer les éléments audio pour chaque piste
        const audioVibes = createAudio(getLink('--link-audio-1'), 'Vibes');
        const audioRedemption = createAudio(getLink('--link-audio-2'), 'Redemption');
        const audioEscape = createAudio(getLink('--link-audio-3'), 'Escape');
        
        // Tableau des éléments audio
        const audioElements = [audioVibes, audioRedemption, audioEscape];
    };
    
    // Appliquer les liens
    applyLinks();
    
    // Gestion des boutons de lecture
    const playButtons = document.querySelectorAll('.play-btn');
    const audioItems = document.querySelectorAll('.audio-item');
    
    playButtons.forEach((btn, index) => {
        btn.addEventListener('click', () => {
            // Récupérer le titre de la piste
            const trackTitle = btn.nextElementSibling.querySelector('.track-title').textContent;
            const audioId = `audio-${trackTitle.toLowerCase()}`;
            const audioElement = document.getElementById(audioId);
            
            if (audioElement) {
                // Arrêter tous les autres audios
                document.querySelectorAll('audio').forEach(audio => {
                    if (audio.id !== audioId && !audio.paused) {
                        audio.pause();
                        audio.currentTime = 0;
                    }
                });
                
                // Lecture ou pause
                if (audioElement.paused) {
                    audioElement.play();
                    console.log(`Lecture de ${trackTitle}`);
                } else {
                    audioElement.pause();
                    audioElement.currentTime = 0;
                    console.log(`Arrêt de ${trackTitle}`);
                }
            } else {
                console.log(`Audio non disponible pour ${trackTitle}`);
            }
            
            // Feedback visuel
            btn.style.backgroundColor = 'var(--yellow)';
            setTimeout(() => {
                btn.style.backgroundColor = '';
            }, 300);
        });
    });
    
    // Accessibilité clavier pour les éléments du carrousel
    audioItems.forEach(item => {
        item.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                item.querySelector('.play-btn').click();
            }
        });
    });
    
    // Gestion du modal de licence
    const licenseBtn = document.getElementById('license-btn');
    const licenseModal = document.getElementById('license-modal');
    const closeModalBtn = document.querySelector('.close-modal');
    let modalOpen = false;
    
    // Fonction pour ouvrir le modal
    const openModal = () => {
        if (licenseModal) {
            licenseModal.style.display = 'flex';
            document.body.style.overflow = 'hidden'; // Empêche le défilement de la page
            modalOpen = true;
            
            // Ajouter une entrée dans l'historique pour gérer le bouton retour
            history.pushState({ modal: true }, '', '');
        }
    };
    
    // Fonction pour fermer le modal
    const closeModal = () => {
        if (licenseModal) {
            licenseModal.style.display = 'none';
            document.body.style.overflow = 'auto'; // Restaure le défilement
            modalOpen = false;
        }
    };
    
    // Gérer le bouton retour du navigateur
    window.addEventListener('popstate', (e) => {
        if (modalOpen) {
            closeModal();
            // Empêcher le traitement par défaut du navigateur
            e.preventDefault();
        }
    });
    
    // Ouvrir le modal au clic sur le bouton PRIX/LICENCES/INFOS
    if (licenseBtn) {
        licenseBtn.addEventListener('click', (e) => {
            e.preventDefault(); // Empêche la navigation du lien
            openModal();
        });
    }
    
    // Fermer le modal en cliquant sur le bouton de fermeture
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }
    
    // Fermer le modal en cliquant en dehors du contenu
    window.addEventListener('click', (e) => {
        if (e.target === licenseModal) {
            closeModal();
        }
    });
    
    // Fermer le modal en appuyant sur Echap
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
}); 