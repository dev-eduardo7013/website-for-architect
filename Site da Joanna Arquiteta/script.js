'use strict';

/*
====================================================
 SCRIPT PRINCIPAL — SITE JOANNA THEREZA
----------------------------------------------------
 Uso consciente de JavaScript:
 - Complementa HTML e CSS (não compete com eles)
 - Melhora experiência do usuário
 - Mantém segurança e estabilidade
====================================================
*/

document.addEventListener('DOMContentLoaded', () => {

    /* ==============================================
       0. MENU MOBILE (HAMBÚRGUER)
       ----------------------------------------------
       Abre/fecha o menu em telas menores
       ============================================== */

    const navegacao = document.querySelector('.navegacao');
    const botaoMenu = document.querySelector('.nav-toggle');

    if (navegacao && botaoMenu) {
        botaoMenu.addEventListener('click', () => {
            const aberto = navegacao.classList.toggle('aberto');
            botaoMenu.setAttribute('aria-expanded', aberto ? 'true' : 'false');
        });

        const linksMenu = navegacao.querySelectorAll('.menu a');
        linksMenu.forEach((link) => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768 && navegacao.classList.contains('aberto')) {
                    navegacao.classList.remove('aberto');
                    botaoMenu.setAttribute('aria-expanded', 'false');
                }
            });
        });
    }

    /* ==============================================
       1. ANIMAÇÕES LEVES AO ENTRAR NA TELA
       ----------------------------------------------
       Funciona apenas se você usar classes animadas
       no CSS futuramente (.ativo)
       ============================================== */

    const elementosAnimados = document.querySelectorAll(
        '.secao-sobre, .projeto, .secao-contato'
    );

    if ('IntersectionObserver' in window) {
        const observador = new IntersectionObserver((entradas) => {
            entradas.forEach(entrada => {
                if (entrada.isIntersecting) {
                    entrada.target.classList.add('ativo');
                }
            });
        }, {
            threshold: 0.2
        });

        elementosAnimados.forEach(elemento => {
            observador.observe(elemento);
        });
    }

    /* ==============================================
       HOME — SLIDER DOS DESTAQUES (Projeto X / Urbanos)
       ----------------------------------------------
       Transição horizontal com setas, bolinhas e autoplay.
       ============================================== */

    const destaqueSlider = document.querySelector('.destaque-projetos-slider');

    if (destaqueSlider) {
        const track = destaqueSlider.querySelector('.destaque-projetos-slider-track');
        const slides = destaqueSlider.querySelectorAll('.destaque-projeto-slide');
        const prevButton = destaqueSlider.querySelector('.destaque-slider-seta-prev');
        const nextButton = destaqueSlider.querySelector('.destaque-slider-seta-next');
        const dots = destaqueSlider.querySelectorAll('.destaque-slider-dot');

        let currentIndex = 0;
        let autoPlayId = null;

        const SLIDER_GAP = 28;

        const updateSlider = (index) => {
            if (!track || !slides.length) return;
            currentIndex = (index + slides.length) % slides.length;
            const slideWidth = slides[0].offsetWidth;
            const offset = currentIndex * (slideWidth + SLIDER_GAP);
            track.style.transform = `translateX(-${offset}px)`;

            dots.forEach((dot, dotIndex) => {
                dot.classList.toggle('ativo', dotIndex === currentIndex);
            });
        };

        const nextSlide = () => updateSlider(currentIndex + 1);
        const prevSlide = () => updateSlider(currentIndex - 1);

        const stopAutoPlay = () => {
            if (autoPlayId) {
                window.clearInterval(autoPlayId);
                autoPlayId = null;
            }
        };

        const startAutoPlay = () => {
            stopAutoPlay();
            autoPlayId = window.setInterval(nextSlide, 5200);
        };

        if (nextButton) nextButton.addEventListener('click', () => {
            nextSlide();
            startAutoPlay();
        });

        if (prevButton) prevButton.addEventListener('click', () => {
            prevSlide();
            startAutoPlay();
        });

        dots.forEach((dot) => {
            dot.addEventListener('click', () => {
                const targetIndex = Number(dot.dataset.slideIndex);
                if (!Number.isNaN(targetIndex)) {
                    updateSlider(targetIndex);
                    startAutoPlay();
                }
            });
        });

        destaqueSlider.addEventListener('mouseenter', stopAutoPlay);
        destaqueSlider.addEventListener('mouseleave', startAutoPlay);

        window.addEventListener('resize', () => updateSlider(currentIndex));

        updateSlider(0);
        startAutoPlay();
    }

    /* ==============================================
       2. BOTÃO "SOLICITAR ORÇAMENTO" → WHATSAPP
       ----------------------------------------------
       Ação controlada por JS (mais segurança)
       ============================================== */

    const botaoOrcamento = document.querySelector('.btn-orcamento');

    if (botaoOrcamento) {
        botaoOrcamento.addEventListener('click', (event) => {
            event.preventDefault();

            // Feedback visual rápido
            botaoOrcamento.classList.add('clicado');
            setTimeout(() => {
                botaoOrcamento.classList.remove('clicado');
            }, 180);

            // Mensagem segura
            const mensagem = encodeURIComponent(
                'Olá! Gostaria de solicitar um orçamento para meu projeto.'
            );

            // Link WhatsApp (wa.link é seguro)
            const linkWhatsApp = 'https://wa.link/de5czt';

            // Abre nova aba com proteção
            window.open(linkWhatsApp, '_blank', 'noopener,noreferrer');
        });
    }

    /* ==============================================
       3. LINKS EXTERNOS — UX E SEGURANÇA
       ----------------------------------------------
       Remove foco visual após clique
       ============================================== */

    const linksExternos = document.querySelectorAll(
        'a[target="_blank"]'
    );

    linksExternos.forEach(link => {
        link.addEventListener('click', () => {
            link.blur();
        });
    });

    /* ==============================================
       4. TRATAMENTO SEGURO DE ERROS
       ----------------------------------------------
       Evita quebra total do site
       ============================================== */

    window.addEventListener('error', (erro) => {
        console.warn('Erro tratado com segurança:', erro.message);
    });

    /* ==============================================
       PORTFÓLIO — ACCORDION (clique/toque mostra texto)
       ----------------------------------------------
       Cada card do portfólio expande/contrai o texto
       de forma independente ao clicar no trigger.
       ============================================== */

    const projetoTriggers = document.querySelectorAll('.secao-portifolio .projeto-trigger');

    projetoTriggers.forEach((trigger) => {
        trigger.addEventListener('click', () => {
            const projeto = trigger.closest('.projeto');
            const panel = projeto && projeto.querySelector('.projeto-panel');
            if (!projeto || !panel) return;

            const isAberto = projeto.classList.toggle('aberto');

            trigger.setAttribute('aria-expanded', isAberto ? 'true' : 'false');

            if (isAberto) {
                panel.style.maxHeight = `${panel.scrollHeight + 24}px`;
            } else {
                panel.style.maxHeight = '0';
            }
        });
    });

    /* ==============================================
       5. ACCORDION — DÚVIDAS FREQUENTES
       ----------------------------------------------
       Perguntas com respostas expansíveis
       ============================================== */

    const accordionButtons = document.querySelectorAll('.accordion-button');

    if (accordionButtons.length) {
        accordionButtons.forEach((button) => {
            button.addEventListener('click', () => {
                const item = button.closest('.accordion-item');
                if (!item) return;

                const content = item.querySelector('.accordion-content');
                if (!content) return;

                const isOpen = item.classList.contains('ativo');

                // Fecha todos os itens antes de abrir o atual
                accordionButtons.forEach((btn) => {
                    const otherItem = btn.closest('.accordion-item');
                    const otherContent = otherItem && otherItem.querySelector('.accordion-content');

                    if (otherItem && otherContent) {
                        otherItem.classList.remove('ativo');
                        btn.setAttribute('aria-expanded', 'false');
                        otherContent.style.maxHeight = '0px';
                    }
                });

                // Se o atual não estava aberto, abre
                if (!isOpen) {
                    item.classList.add('ativo');
                    button.setAttribute('aria-expanded', 'true');
                    const extraSpace = 32;
                    content.style.maxHeight = `${content.scrollHeight + extraSpace}px`;
                }
            });
        });
    }

    /* ==============================================
       6. LIGHTBOX SIMPLES PARA GALERIAS
       ----------------------------------------------
       Amplia imagens das seções .galeria-interna
       ao clicar/toque, em tela cheia
       ============================================== */

    const galeriaImagens = document.querySelectorAll('.galeria-interna img');

    if (galeriaImagens.length) {
        // Cria o overlay uma vez
        const overlay = document.createElement('div');
        overlay.className = 'lightbox-overlay';
        overlay.setAttribute('role', 'dialog');
        overlay.setAttribute('aria-modal', 'true');
        overlay.setAttribute('aria-label', 'Visualização ampliada da imagem');

        const overlayImg = document.createElement('img');
        overlay.appendChild(overlayImg);

        document.body.appendChild(overlay);

        const fecharOverlay = () => {
            overlay.classList.remove('aberto');
            overlayImg.src = '';
        };

        galeriaImagens.forEach((img) => {
            img.style.cursor = 'zoom-in';
            img.addEventListener('click', () => {
                const src = img.getAttribute('src');
                if (!src) return;
                overlayImg.src = src;
                overlay.classList.add('aberto');
            });
        });

        overlay.addEventListener('click', fecharOverlay);

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && overlay.classList.contains('aberto')) {
                fecharOverlay();
            }
        });
    }

});
