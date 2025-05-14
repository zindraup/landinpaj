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
    
    // Fonction pour suivre les clics avec Google Analytics
    const trackClick = (elementName, elementType) => {
        if (typeof gtag === 'function') {
            gtag('event', 'click', {
                'event_category': elementType,
                'event_label': elementName,
                'value': 1
            });
            console.log(`Tracking: Click on ${elementType} - ${elementName}`);
        }
    };
    
    // Fonction pour ajouter le tracking aux liens
    const addClickTracking = (element, name, type) => {
        if (element) {
            element.addEventListener('click', () => {
                trackClick(name, type);
            });
        }
    };
    
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
        const mainBtn = document.querySelector('.main-btn');
        mainBtn.href = getLink('--link-main-btn');
        addClickTracking(mainBtn, 'Main Button - Drop The Mic', 'button');
        
        const secondaryBtn = document.querySelector('.secondary-btn');
        if (secondaryBtn && !secondaryBtn.classList.contains('hidden')) {
            addClickTracking(secondaryBtn, 'Secondary Button - Free Pack', 'button');

            secondaryBtn.addEventListener('click', function(event) {
                const inAppBrowser = isInWebView(); // Vérifie si on est dans un navigateur type Instagram

                if (inAppBrowser) {
                    // Pour Instagram : changer le href pour pointer vers la page d'accueil
                    // et laisser le navigateur suivre ce lien (pas de preventDefault).
                    // Cela devrait inciter Instagram à proposer une ouverture externe.
                    console.log("Navigateur In-App détecté. Modification de href vers la page d'accueil et suivi du lien.");
                    this.href = 'https://clic-sur-ce-super-lien.saint-drop.com/';
                    // NE PAS appeler event.preventDefault() ici. Le navigateur suivra le nouveau this.href.
                    // Note : L'attribut href de l'élément DOM est maintenant modifié.
                    // Si l'utilisateur revient à cette page sans rechargement et reclique, l'href sera celui de la page d'accueil.
                    // Pour un usage typique (clic et sortie), cela devrait être acceptable.
                } else {
                    // Dans un navigateur standard : Tenter le téléchargement du MP3
                    event.preventDefault(); // Empêche la navigation par défaut (vers l'URL du MP3 si href n'avait pas été changé)
                    console.log("Navigateur standard détecté. Tentative de téléchargement du MP3 via JavaScript.");
                    
                    // Utiliser l'URL du MP3 directement pour s'assurer qu'on a la bonne source,
                    // car this.href pourrait avoir été modifié par un clic précédent dans Instagram.
                    const fileUrl = 'https://clic-sur-ce-super-lien.saint-drop.com/saint-drop_boombap_95bpm.mp3'; 
                    const fileName = this.getAttribute('download') || 'saint-drop_boombap_95bpm.mp3';

                    fetch(fileUrl)
                        .then(response => {
                            if (!response.ok) {
                                throw new Error('Réponse réseau incorrecte lors de la tentative de téléchargement.');
                            }
                            return response.blob();
                        })
                        .then(blob => {
                            const url = window.URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.style.display = 'none';
                            a.href = url;
                            a.download = fileName;
                            document.body.appendChild(a);
                            a.click();
                            window.URL.revokeObjectURL(url);
                            document.body.removeChild(a);
                            console.log('Téléchargement initié via JS.');
                        })
                        .catch(err => {
                            console.error('Erreur lors de la tentative de téléchargement via JS:', err);
                            // En cas d'erreur, on redirige vers le lien MP3 (fallback)
                            window.location.href = fileUrl;
                        });
                }
            });
        }
        
        // Bouton de donation
        const donationBtn = document.querySelector('.donation-btn');
        if (donationBtn) {
            donationBtn.href = getLink('--link-donation');
            addClickTracking(donationBtn, 'Donation Button', 'button');
        }
        
        // Appliquer aux boutons textuels
        const textBtns = document.querySelectorAll('.text-btn');
        if (textBtns.length > 0) {
            textBtns[0].href = getLink('--link-text-btn-1');
            addClickTracking(textBtns[0], 'Text Button - Instrumentals', 'button');
        }
        if (textBtns.length > 1) {
            textBtns[1].href = getLink('--link-text-btn-2');
            addClickTracking(textBtns[1], 'Text Button - Drumkits', 'button');
        }
        
        // Appliquer aux boutons discrets
        const discreteBtns = document.querySelectorAll('.discrete-btn');
        if (discreteBtns.length > 0 && discreteBtns[0].id !== 'license-btn') {
            discreteBtns[0].href = getLink('--link-discrete-btn-1');
            addClickTracking(discreteBtns[0], 'Discrete Button 1', 'button');
        }
        if (discreteBtns.length > 1 && discreteBtns[1].id !== 'license-btn') {
            discreteBtns[1].href = getLink('--link-discrete-btn-2');
            addClickTracking(discreteBtns[1], 'Discrete Button 2', 'button');
        }
        if (discreteBtns.length > 2 && discreteBtns[2].id !== 'license-btn') {
            discreteBtns[2].href = getLink('--link-discrete-btn-3');
            addClickTracking(discreteBtns[2], 'Discrete Button 3', 'button');
        }
        
        // License button tracking
        const licenseBtn = document.getElementById('license-btn');
        if (licenseBtn) {
            addClickTracking(licenseBtn, 'License Button', 'button');
        }
        
        // Appliquer aux liens sociaux
        const socialLinks = document.querySelectorAll('.social-links a');
        if (socialLinks.length > 0) {
            socialLinks[0].href = getLink('--link-social-1');
            addClickTracking(socialLinks[0], 'Social - TikTok', 'social');
        }
        if (socialLinks.length > 1) {
            socialLinks[1].href = getLink('--link-social-2');
            addClickTracking(socialLinks[1], 'Social - Instagram', 'social');
        }
        if (socialLinks.length > 2) {
            socialLinks[2].href = getLink('--link-social-3');
            addClickTracking(socialLinks[2], 'Social - YouTube', 'social');
        }
        
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
            
            // Tracking du clic sur le bouton audio
            if (typeof gtag === 'function') {
                gtag('event', 'play_audio', {
                    'event_category': 'audio',
                    'event_label': trackTitle,
                    'value': 1
                });
            }
            
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
    
    // Détecter si on est dans un WebView (comme Instagram)
    const isInWebView = () => {
        const userAgent = navigator.userAgent.toLowerCase();
        return userAgent.includes('instagram') || 
               (userAgent.includes('android') && userAgent.includes('wv')) ||
               (userAgent.includes('fb_iab') || userAgent.includes('fban'));
    };
    
    // Détermine si nous sommes dans un WebView comme Instagram
    const inWebView = isInWebView();
    
    // Fonction pour ouvrir le modal
    const openModal = () => {
        if (licenseModal) {
            licenseModal.style.display = 'flex';
            document.body.style.overflow = 'hidden'; // Empêche le défilement de la page
            modalOpen = true;
            
            // Tracking d'ouverture du modal
            if (typeof gtag === 'function') {
                gtag('event', 'open_modal', {
                    'event_category': 'modal',
                    'event_label': 'License Modal',
                    'value': 1
                });
            }
            
            // Gérer l'historique uniquement dans les navigateurs standards
            if (!inWebView) {
                history.pushState({ modal: true }, '', '');
            }
        }
    };
    
    // Fonction pour fermer le modal
    const closeModal = () => {
        if (licenseModal) {
            licenseModal.style.display = 'none';
            document.body.style.overflow = 'auto'; // Restaure le défilement
            modalOpen = false;
            
            // Tracking de fermeture du modal
            if (typeof gtag === 'function') {
                gtag('event', 'close_modal', {
                    'event_category': 'modal',
                    'event_label': 'License Modal',
                    'value': 1
                });
            }
        }
    };
    
    // Vérifier si on a un hash au chargement de la page
    if (inWebView && window.location.hash === '#modal') {
        // Si on a déjà le hash modal, ouvrir la modale immédiatement
        requestAnimationFrame(() => {
            openModal();
        });
    }
    
    // Gérer le bouton retour uniquement dans les navigateurs standards
    if (!inWebView) {
        window.addEventListener('popstate', () => {
            if (modalOpen) {
                closeModal();
            }
        });
    }
    
    // Pour Instagram, utiliser l'événement hashchange pour fermer la modale
    if (inWebView) {
        window.addEventListener('hashchange', () => {
            if (modalOpen && window.location.hash === '') {
                closeModal();
            } else if (!modalOpen && window.location.hash === '#modal') {
                openModal();
            }
        });
    }
    
    // Ouvrir le modal au clic sur le bouton PRIX/LICENCES/INFOS
    if (licenseBtn) {
        licenseBtn.addEventListener('click', (e) => {
            e.preventDefault(); // Empêche la navigation du lien
            
            if (inWebView) {
                // Pour Instagram, mettre à jour le hash uniquement si nécessaire
                if (window.location.hash !== '#modal') {
                    window.location.hash = 'modal';
                } else {
                    // Si le hash est déjà modal mais que la modale n'est pas ouverte, l'ouvrir directement
                    if (!modalOpen) {
                        openModal();
                    }
                }
            } else {
                // Navigateurs standards
                openModal();
            }
        });
    }
    
    // Fermer le modal en cliquant sur le bouton de fermeture
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            closeModal();
            
            // Pour les WebViews, retirer le hash si nécessaire
            if (inWebView && window.location.hash === '#modal') {
                // Utiliser un timeout pour éviter les problèmes de synchronisation
                setTimeout(() => {
                    window.location.hash = '';
                }, 50);
            }
        });
    }
    
    // Fermer le modal en cliquant en dehors du contenu
    window.addEventListener('click', (e) => {
        if (e.target === licenseModal) {
            closeModal();
            
            // Pour les WebViews, retirer le hash si nécessaire
            if (inWebView && window.location.hash === '#modal') {
                // Utiliser un timeout pour éviter les problèmes de synchronisation
                setTimeout(() => {
                    window.location.hash = '';
                }, 50);
            }
        }
    });
    
    // Fermer le modal en appuyant sur Echap
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
            
            // Pour les WebViews, retirer le hash si nécessaire
            if (inWebView && window.location.hash === '#modal') {
                // Utiliser un timeout pour éviter les problèmes de synchronisation
                setTimeout(() => {
                    window.location.hash = '';
                }, 50);
            }
        }
    });
    
    // Suivi des clics sur les licences dans la modale
    document.querySelectorAll('.license-option .read-license').forEach((licenseLink, index) => {
        licenseLink.addEventListener('click', () => {
            const licenseType = licenseLink.closest('.license-option').querySelector('h3').textContent;
            if (typeof gtag === 'function') {
                gtag('event', 'select_license', {
                    'event_category': 'license',
                    'event_label': licenseType,
                    'value': 1
                });
            }
        });
    });
    
    // Tracker le temps passé sur la page
    let startTime = new Date();
    window.addEventListener('beforeunload', () => {
        const endTime = new Date();
        const timeSpent = Math.round((endTime - startTime) / 1000); // en secondes
        
        if (typeof gtag === 'function') {
            gtag('event', 'time_spent', {
                'event_category': 'engagement',
                'event_label': 'Time on page',
                'value': timeSpent
            });
        }
    });
}); 