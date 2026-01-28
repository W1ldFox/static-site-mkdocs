/**
 * Custom Theme JavaScript
 * Автор: W1ldFox
 */

(function() {
    'use strict';

    // === Инициализация при загрузке DOM ===
    document.addEventListener('DOMContentLoaded', function() {
        initMobileMenu();
        initSmoothScroll();
        initActiveNavHighlight();
        initCodeCopyButtons();
        initScrollToTop();
    });

    // === Мобильное меню ===
    function initMobileMenu() {
        const menuToggle = document.querySelector('.mobile-menu-toggle');
        const mainNav = document.querySelector('.main-nav');
        
        if (!menuToggle || !mainNav) return;

        menuToggle.addEventListener('click', function() {
            const isOpen = mainNav.classList.toggle('is-open');
            menuToggle.setAttribute('aria-expanded', isOpen);
            
            // Блокируем скролл body при открытом меню
            document.body.style.overflow = isOpen ? 'hidden' : '';
        });

        // Закрываем меню при клике на ссылку
        mainNav.querySelectorAll('.nav-link').forEach(function(link) {
            link.addEventListener('click', function() {
                mainNav.classList.remove('is-open');
                menuToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            });
        });

        // Закрываем меню при клике вне его
        document.addEventListener('click', function(e) {
            if (!mainNav.contains(e.target) && !menuToggle.contains(e.target)) {
                mainNav.classList.remove('is-open');
                menuToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            }
        });

        // Закрываем меню при нажатии Escape
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && mainNav.classList.contains('is-open')) {
                mainNav.classList.remove('is-open');
                menuToggle.setAttribute('aria-expanded', 'false');
                menuToggle.focus();
                document.body.style.overflow = '';
            }
        });
    }

    // === Плавный скролл к якорям ===
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
            anchor.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();
                    
                    const headerHeight = document.querySelector('.site-header').offsetHeight;
                    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Обновляем URL без скролла
                    history.pushState(null, null, targetId);
                }
            });
        });
    }

    // === Подсветка активного пункта навигации ===
    function initActiveNavHighlight() {
        const sections = document.querySelectorAll('h2[id], h3[id]');
        const navLinks = document.querySelectorAll('.sidebar-nav a');
        
        if (sections.length === 0 || navLinks.length === 0) return;

        const observerOptions = {
            rootMargin: '-20% 0px -80% 0px'
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    navLinks.forEach(function(link) {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === '#' + id) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }, observerOptions);

        sections.forEach(function(section) {
            observer.observe(section);
        });
    }

    // === Кнопки копирования кода ===
    function initCodeCopyButtons() {
        const codeBlocks = document.querySelectorAll('pre code');
        
        codeBlocks.forEach(function(codeBlock) {
            const pre = codeBlock.parentElement;
            const wrapper = document.createElement('div');
            wrapper.className = 'code-block-wrapper';
            wrapper.style.position = 'relative';
            
            pre.parentNode.insertBefore(wrapper, pre);
            wrapper.appendChild(pre);
            
            const copyButton = document.createElement('button');
            copyButton.className = 'copy-code-btn';
            copyButton.innerHTML = '📋 Копировать';
            copyButton.style.cssText = `
                position: absolute;
                top: 8px;
                right: 8px;
                padding: 4px 12px;
                font-size: 12px;
                background: rgba(255, 255, 255, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: 4px;
                color: #fff;
                cursor: pointer;
                opacity: 0;
                transition: opacity 0.2s ease;
            `;
            
            wrapper.appendChild(copyButton);
            
            wrapper.addEventListener('mouseenter', function() {
                copyButton.style.opacity = '1';
            });
            
            wrapper.addEventListener('mouseleave', function() {
                copyButton.style.opacity = '0';
            });
            
            copyButton.addEventListener('click', function() {
                const code = codeBlock.textContent;
                
                navigator.clipboard.writeText(code).then(function() {
                    copyButton.innerHTML = '✅ Скопировано!';
                    setTimeout(function() {
                        copyButton.innerHTML = '📋 Копировать';
                    }, 2000);
                }).catch(function(err) {
                    console.error('Ошибка копирования:', err);
                    copyButton.innerHTML = '❌ Ошибка';
                    setTimeout(function() {
                        copyButton.innerHTML = '📋 Копировать';
                    }, 2000);
                });
            });
        });
    }

    // === Кнопка "Наверх" ===
    function initScrollToTop() {
        const scrollTopBtn = document.createElement('button');
        scrollTopBtn.className = 'scroll-to-top';
        scrollTopBtn.innerHTML = '↑';
        scrollTopBtn.setAttribute('aria-label', 'Наверх');
        scrollTopBtn.style.cssText = `
            position: fixed;
            bottom: 24px;
            right: 24px;
            width: 48px;
            height: 48px;
            border-radius: 50%;
            background: var(--color-primary, #2563eb);
            color: white;
            border: none;
            cursor: pointer;
            font-size: 20px;
            font-weight: bold;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
            z-index: 999;
        `;
        
        document.body.appendChild(scrollTopBtn);
        
        // Показываем/скрываем кнопку при скролле
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                scrollTopBtn.style.opacity = '1';
                scrollTopBtn.style.visibility = 'visible';
            } else {
                scrollTopBtn.style.opacity = '0';
                scrollTopBtn.style.visibility = 'hidden';
            }
        });
        
        scrollTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
        
        // Hover эффект
        scrollTopBtn.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1)';
        });
        
        scrollTopBtn.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    }

    // === Утилиты ===
    
    // Debounce функция для оптимизации
    function debounce(func, wait) {
        let timeout;
        return function executedFunction() {
            const context = this;
            const args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(function() {
                func.apply(context, args);
            }, wait);
        };
    }

    // Throttle функция
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const context = this;
            const args = arguments;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(function() {
                    inThrottle = false;
                }, limit);
            }
        };
    }

    // Экспортируем утилиты в глобальную область 
    window.ThemeUtils = {
        debounce: debounce,
        throttle: throttle
    };

})();