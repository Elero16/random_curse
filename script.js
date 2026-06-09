
document.addEventListener('DOMContentLoaded', () => {
    // ==================== ЭЛЕМЕНТЫ DOM ====================
    const stepStart   = document.getElementById('step-start');
    const stepForm    = document.getElementById('step-form');
    const stepResult  = document.getElementById('step-result');

    const btnStart    = document.getElementById('btn-start');
    const btnCast     = document.getElementById('btn-cast');
    const btnBack     = document.getElementById('btn-back');
    const btnNewCurse = document.getElementById('btn-new-curse');

    // Поля формы
    const fieldName      = document.getElementById('target-name');
    const fieldPosition  = document.getElementById('target-position');
    const fieldWorkplace = document.getElementById('target-workplace');
    const fieldCrime     = document.getElementById('target-crime');
    const fieldCurse     = document.getElementById('curse-text');
    const fieldDuration  = document.getElementById('curse-duration');

    // Блоки ошибок
    const errorName      = document.getElementById('error-name');
    const errorPosition  = document.getElementById('error-position');
    const errorWorkplace = document.getElementById('error-workplace');
    const errorCrime     = document.getElementById('error-crime');
    const errorCurse     = document.getElementById('error-curse');

    // Счётчики символов
    const counterCrime = document.getElementById('counter-crime');
    const counterCurse = document.getElementById('counter-curse');

    // Блок результата
    const resultText    = document.getElementById('result-text');
    const resultDetails = document.getElementById('result-details');
    const curseSummary  = document.getElementById('curse-summary');

    // Мем-элементы
    const memeCaption = document.getElementById('meme-caption');
    const memeImage   = document.getElementById('meme-image');

    // ==================== СОСТОЯНИЕ ====================
    let cursesCast = 0; // счётчик проклятий за сессию

    const memePhrases = [
        '«Вижу... вижу... кого-то надо срочно проклясть!»',
        '«Духи говорят: пора кого-то наказать!»',
        '«Карты сказали — сегодня день проклятий!»',
        '«Я чувствую сильное возмущение в астрале...»',
        '«Экстрасенсорная служба доставки проклятий. Кто первый?»',
        '«Звёзды шепчут: готовь проклятие!»',
    ];

    // ==================== ФОНОВЫЕ ЧАСТИЦЫ ====================
    const particlesContainer = document.getElementById('particles-container');
    const emojiList = ['🕯️', '💀', '🧿', '🔮', '✨', '🌙', '⚡', '🩸', '👁️', '🕷️', '🌑', '🔥'];

    function createParticle() {
        const particle = document.createElement('span');
        particle.classList.add('particle');
        particle.textContent = emojiList[Math.floor(Math.random() * emojiList.length)];
        particle.style.left = Math.random() * 100 + '%';
        particle.style.fontSize = (Math.random() * 24 + 14) + 'px';
        particle.style.animationDuration = (Math.random() * 8 + 8) + 's';
        particle.style.animationDelay = Math.random() * 5 + 's';
        particlesContainer.appendChild(particle);

        // Удаляем после завершения анимации
        setTimeout(() => {
            particle.remove();
        }, 14000);
    }

    // Запускаем частицы
    setInterval(createParticle, 1500);
    // Начальный залп
    for (let i = 0; i < 8; i++) {
        setTimeout(createParticle, i * 400);
    }

    // ==================== СЛУЧАЙНАЯ ФРАЗА МЕМА ====================
    function randomMemePhrase() {
        const randomIndex = Math.floor(Math.random() * memePhrases.length);
        memeCaption.textContent = memePhrases[randomIndex];
    }
    // Меняем фразу при загрузке
    randomMemePhrase();

    // ==================== СЧЁТЧИКИ СИМВОЛОВ ====================
    function updateCharCounter(textarea, counterElement, maxLength) {
        const currentLength = textarea.value.length;
        counterElement.textContent = `${currentLength} / ${maxLength}`;

        // Сбрасываем классы
        counterElement.classList.remove('warning', 'danger');

        if (currentLength >= maxLength) {
            counterElement.classList.add('danger');
        } else if (currentLength >= maxLength * 0.85) {
            counterElement.classList.add('warning');
        }
    }

    fieldCrime.addEventListener('input', () => {
        updateCharCounter(fieldCrime, counterCrime, 500);
    });

    fieldCurse.addEventListener('input', () => {
        updateCharCounter(fieldCurse, counterCurse, 500);
    });

    // ==================== ВАЛИДАЦИЯ ====================
    function showError(inputElement, errorElement, message) {
        inputElement.classList.add('input-error');
        errorElement.textContent = message;
        errorElement.classList.add('visible');
    }

    function clearError(inputElement, errorElement) {
        inputElement.classList.remove('input-error');
        errorElement.textContent = '';
        errorElement.classList.remove('visible');
    }

    function clearAllErrors() {
        const fields = [
            { input: fieldName, error: errorName },
            { input: fieldPosition, error: errorPosition },
            { input: fieldWorkplace, error: errorWorkplace },
            { input: fieldCrime, error: errorCrime },
            { input: fieldCurse, error: errorCurse },
        ];
        fields.forEach(f => clearError(f.input, f.error));
    }

    function validateForm() {
        let isValid = true;
        clearAllErrors();

        if (!fieldName.value.trim()) {
            showError(fieldName, errorName, '⚠️ Имя жертвы обязательно!');
            isValid = false;
        }
        if (!fieldPosition.value.trim()) {
            showError(fieldPosition, errorPosition, '⚠️ Должность обязательна!');
            isValid = false;
        }
        if (!fieldWorkplace.value.trim()) {
            showError(fieldWorkplace, errorWorkplace, '⚠️ Место работы обязательно!');
            isValid = false;
        }
        if (!fieldCrime.value.trim()) {
            showError(fieldCrime, errorCrime, '⚠️ Опишите преступление!');
            isValid = false;
        } else if (fieldCrime.value.trim().length < 5) {
            showError(fieldCrime, errorCrime, '⚠️ Слишком коротко! Нужно хотя бы 5 символов.');
            isValid = false;
        }
        if (!fieldCurse.value.trim()) {
            showError(fieldCurse, errorCurse, '⚠️ Напишите текст проклятия!');
            isValid = false;
        } else if (fieldCurse.value.trim().length < 5) {
            showError(fieldCurse, errorCurse, '⚠️ Проклятие должно быть минимум 5 символов!');
            isValid = false;
        }

        return isValid;
    }

    // Очистка ошибок при вводе
    [fieldName, fieldPosition, fieldWorkplace, fieldCrime, fieldCurse].forEach(field => {
        field.addEventListener('input', () => {
            const errorMap = {
                [fieldName.id]: errorName,
                [fieldPosition.id]: errorPosition,
                [fieldWorkplace.id]: errorWorkplace,
                [fieldCrime.id]: errorCrime,
                [fieldCurse.id]: errorCurse,
            };
            if (field.value.trim().length > 0) {
                clearError(field, errorMap[field.id]);
            }
        });
    });

    // ==================== НАВИГАЦИЯ ====================
    function showStep(step) {
        [stepStart, stepForm, stepResult].forEach(s => s.classList.remove('active'));
        step.classList.add('active');
    }

    function resetForm() {
        fieldName.value = '';
        fieldPosition.value = '';
        fieldWorkplace.value = '';
        fieldCrime.value = '';
        fieldCurse.value = '';
        fieldDuration.value = '1 неделя';
        clearAllErrors();
        counterCrime.textContent = '0 / 500';
        counterCurse.textContent = '0 / 500';
        counterCrime.classList.remove('warning', 'danger');
        counterCurse.classList.remove('warning', 'danger');
    }

    // Старт
    btnStart.addEventListener('click', () => {
        randomMemePhrase(); // меняем фразу для разнообразия
        showStep(stepForm);
    });

    // Назад
    btnBack.addEventListener('click', () => {
        resetForm();
        showStep(stepStart);
    });

    // Новое проклятие
    btnNewCurse.addEventListener('click', () => {
        resetForm();
        curseSummary.style.display = 'none';
        showStep(stepForm);
    });

    // ==================== ОТПРАВКА ПРОКЛЯТИЯ ====================
    btnCast.addEventListener('click', () => {
        if (!validateForm()) {
            // Трясём кнопку для эффекта
            btnCast.style.animation = 'none';
            btnCast.offsetHeight; // reflow
            btnCast.style.animation = 'shake 0.5s ease';
            return;
        }

        // Данные формы
        const name     = fieldName.value.trim();
        const position = fieldPosition.value.trim();
        const workplace = fieldWorkplace.value.trim();
        const crime    = fieldCrime.value.trim();
        const curse    = fieldCurse.value.trim();
        const duration = fieldDuration.value;

        // Блокируем кнопку, показываем "отправку"
        btnCast.textContent = '🕯️ НАСЫЛАЕМ...';
        btnCast.disabled = true;

        // Имитация отправки (2 секунды)
        setTimeout(() => {
            cursesCast++;

            // Формируем текст результата
            if (cursesCast >= 5) {
                resultText.textContent = '⚠️ Вы превысили лимит бесплатных проклятий!';
                resultDetails.innerHTML = 'Шучу. Проклятие успешно наложено.<br><small>(Но карма, кажется, что-то заподозрила...)</small>';
            } else if (cursesCast === 1) {
                resultText.textContent = 'Вы успешно прокляли эту сранину!';
                resultDetails.innerHTML = 'Проклятие уже в пути. Астральные силы оповещены.<br><small>(Гарантия 99.9% — или вернём ваши кармические баллы)</small>';
            } else {
                resultText.textContent = 'Ещё одно проклятие улетело в цель!';
                resultDetails.innerHTML = `Это уже ${cursesCast}-е проклятие за сессию. Вы в ударе!<br><small>(Астрал работает без выходных)</small>`;
            }

            // Показываем детали проклятия
            curseSummary.style.display = 'block';
            curseSummary.innerHTML = `
                <strong>📋 Детали проклятия:</strong><br>
                🎯 <strong>Цель:</strong> ${escapeHTML(name)}, ${escapeHTML(position)}, ${escapeHTML(workplace)}<br>
                😈 <strong>Преступление:</strong> ${escapeHTML(crime)}<br>
                📜 <strong>Проклятие:</strong> ${escapeHTML(curse)}<br>
                ⏳ <strong>Срок:</strong> ${duration}<br>
                🕐 <strong>Отправлено:</strong> ${new Date().toLocaleString('ru-RU')}
            `;

            // Логируем в консоль
            console.log('=== ПРОКЛЯТИЕ ОТПРАВЛЕНО ===');
            console.log('№:', cursesCast);
            console.log('Цель:', name, '|', position, '|', workplace);
            console.log('Преступление:', crime);
            console.log('Проклятие:', curse);
            console.log('Срок:', duration);
            console.log('Время:', new Date().toLocaleString('ru-RU'));
            console.log('Статус: УСПЕШНО ✅');
            console.log('===========================');

            // Переключаем на результат
            showStep(stepResult);

            // Восстанавливаем кнопку
            btnCast.textContent = '⚡ ПРОКЛЯНУТЬ ⚡';
            btnCast.disabled = false;
        }, 2000);
    });

    // ==================== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ====================
    function escapeHTML(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    // Анимация тряски для кнопки
    const shakeKeyframes = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
    `;
    const styleSheet = document.createElement('style');
    styleSheet.textContent = shakeKeyframes;
    document.head.appendChild(styleSheet);
});
