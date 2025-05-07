// Custom cursor
const cursor = document.querySelector('.cursor');
const cursorFollower = document.querySelector('.cursor-follower');

// Плавное движение курсора
function moveCursor(e) {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
    
    // Небольшая задержка для следящего курсора
    setTimeout(() => {
        cursorFollower.style.left = e.clientX + 'px';
        cursorFollower.style.top = e.clientY + 'px';
    }, 50);
}

// Следим за движением мыши
document.addEventListener('mousemove', moveCursor);

// Эффект при наведении на обычные интерактивные элементы
const interactiveElements = document.querySelectorAll('a:not(.social-link), button');

interactiveElements.forEach(element => {
    element.addEventListener('mouseenter', () => {
        cursor.classList.add('active');
        cursorFollower.classList.add('active');
    });

    element.addEventListener('mouseleave', () => {
        cursor.classList.remove('active');
        cursorFollower.classList.remove('active');
    });
});

// Отдельный эффект для карточек релизов
const releaseCards = document.querySelectorAll('.release-card');

releaseCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        cursor.classList.add('release-active');
        cursorFollower.classList.add('release-active');
    });

    card.addEventListener('mouseleave', () => {
        cursor.classList.remove('release-active');
        cursorFollower.classList.remove('release-active');
    });
});

// Отдельный эффект для социальных ссылок
const socialLinks = document.querySelectorAll('.social-link');

socialLinks.forEach(link => {
    link.addEventListener('mouseenter', () => {
        cursor.classList.add('social-active');
        cursorFollower.classList.add('social-active');
    });

    link.addEventListener('mouseleave', () => {
        cursor.classList.remove('social-active');
        cursorFollower.classList.remove('social-active');
    });
});

// Скрываем курсор при выходе за пределы окна
document.addEventListener('mouseout', () => {
    cursor.style.opacity = '0';
    cursorFollower.style.opacity = '0';
});

document.addEventListener('mouseover', () => {
    cursor.style.opacity = '1';
    cursorFollower.style.opacity = '1';
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Header scroll effect
const header = document.querySelector('header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
        header.classList.remove('scroll-up');
        return;
    }
    
    if (currentScroll > lastScroll && !header.classList.contains('scroll-down')) {
        header.classList.remove('scroll-up');
        header.classList.add('scroll-down');
    } else if (currentScroll < lastScroll && header.classList.contains('scroll-down')) {
        header.classList.remove('scroll-down');
        header.classList.add('scroll-up');
    }
    
    lastScroll = currentScroll;
});

// Add parallax effect to hero section
const hero = document.querySelector('.hero');

window.addEventListener('scroll', () => {
    const scroll = window.pageYOffset;
    hero.style.transform = `translateY(${scroll * 0.5}px)`;
    hero.style.opacity = 1 - (scroll * 0.003);
});

// Загрузка и отображение релизов
async function loadReleases() {
    try {
        const response = await fetch('releases.json');
        const data = await response.json();
        const container = document.getElementById('releases-container');

        data.releases.forEach(release => {
            const releaseCard = document.createElement('div');
            releaseCard.className = 'release-card';
            releaseCard.setAttribute('data-release', release.title);

            releaseCard.innerHTML = `
                <img src="${release.cover}" alt="${release.alt}" class="release-cover">
                <div class="release-info">
                    <h3>${release.title}</h3>
                    ${release.with ? `<p class="release-with">${release.with}</p>` : ''}
                </div>
            `;

            // Добавляем обработчик клика для открытия попапа
            releaseCard.addEventListener('click', () => {
                openPopup(release);
            });

            container.appendChild(releaseCard);
        });

        // Добавляем обработчики событий для новых карточек
        initializeReleaseCards();
    } catch (error) {
        console.error('Ошибка при загрузке релизов:', error);
    }
}

// Инициализация обработчиков событий для карточек релизов
function initializeReleaseCards() {
    const releaseCards = document.querySelectorAll('.release-card');

    releaseCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            cursor.classList.add('release-active');
            cursorFollower.classList.add('release-active');
        });

        card.addEventListener('mouseleave', () => {
            cursor.classList.remove('release-active');
            cursorFollower.classList.remove('release-active');
        });
    });
}

// Функция для открытия попапа
function openPopup(release) {
    const popup = document.getElementById('release-popup');
    const title = popup.querySelector('.popup-title');
    const withText = popup.querySelector('.popup-with');
    const description = popup.querySelector('.popup-description');
    const links = popup.querySelectorAll('.popup-link');

    // Заполняем информацию
    title.textContent = release.title;
    withText.textContent = release.with || '';
    description.textContent = release.description;

    // Обновляем ссылки
    links.forEach(link => {
        const service = link.classList[1]; // vk, yandex, sber, etc.
        const url = release.links[service];
        if (url) {
            link.href = url;
            link.style.display = 'inline-block';
        } else {
            link.style.display = 'none';
        }
    });

    // Показываем попап
    popup.classList.add('active');
    document.body.style.overflow = 'hidden'; // Блокируем прокрутку страницы
}

// Закрытие попапа
document.querySelector('.popup-close').addEventListener('click', () => {
    const popup = document.getElementById('release-popup');
    popup.classList.remove('active');
    document.body.style.overflow = ''; // Разблокируем прокрутку страницы
});

// Закрытие попапа по клику вне его содержимого
document.getElementById('release-popup').addEventListener('click', (e) => {
    if (e.target.id === 'release-popup') {
        e.target.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// Закрытие попапа по Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const popup = document.getElementById('release-popup');
        if (popup.classList.contains('active')) {
            popup.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
});

// Загружаем релизы при загрузке страницы
document.addEventListener('DOMContentLoaded', loadReleases); 