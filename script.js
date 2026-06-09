
document.addEventListener('DOMContentLoaded', () => {

    // ==================== ЭЛЕМЕНТЫ DOM ====================
    const stepStart   = document.getElementById('step-start');
    const stepForm    = document.getElementById('step-form');
    const stepResult  = document.getElementById('step-result');

    const btnStart    = document.getElementById('btn-start');
    const btnCast     = document.getElementById('btn-cast');
    const btnBack     = document.getElementById('btn-back');
    const btnNewCurse = document.getElementById('btn-new-curse');

    const fieldName      = document.getElementById('target-name');
    const fieldPosition  = document.getElementById('target-position');
    const fieldWorkplace = document.getElementById('target-workplace');
    const fieldCrime     = document.getElementById('target-crime');
    const fieldCurse     = document.getElementById('curse-text');
    const fieldDuration  = document.getElementById('curse-duration');

    const errorName      = document.getElementById('error-name');
    const errorPosition  = document.getElementById('error-position');
    const errorWorkplace = document.getElementById('error-workplace');
    const errorCrime     = document.getElementById('error-crime');
    const errorCurse     = document.getElementById('error-curse');

    const counterCrime = document.getElementById('counter-crime');
    const counterCurse = document.getElementById('counter-curse');

    const resultText    = document.getElementById('result-text');
    const resultSubtitle = document.getElementById('result-subtitle');
    const curseSummary  = document.getElementById('curse-summary');

    let cursesCast = 0;

    // ==================== СЧЁТЧИКИ СИМВОЛОВ ====================
    function updateCharCounter(textarea, counterElement, maxLength) {
        const len = textarea.value.length;
        counterElement.textContent = `${len} / ${maxLength}`;
        counterElement.classList.remove('warning', 'danger');
        if (len >= maxLength) {
            counterElement.classList.add('danger');
        } else if (len >= maxLength * 0.85) {
            counterElement.classList.add('warning');
        }
    }

    fieldCrime.addEventListener('input', () => updateCharCounter(fieldCrime, counterCrime, 500));
    fieldCurse.addEventListener('input', () => updateCharCounter(fieldCurse, counterCurse, 500));

    // ==================== ВАЛИДАЦИЯ ====================
    function showError(input, errorEl, msg) {
        input.classList.add('input-error');
        errorEl.textContent = msg;
        errorEl.classList.add('visible');
    }
    function clearError(input, errorEl) {
        input.classList.remove('input-error');
        errorEl.textContent = '';
        errorEl.classList.remove('visible');
    }
    function clearAllErrors() {
        [
            [fieldName, errorName],
            [fieldPosition, errorPosition],
            [fieldWorkplace, errorWorkplace],
            [fieldCrime, errorCrime],
            [fieldCurse, errorCurse]
        ].forEach(([inp, err]) => clearError(inp, err));
    }

    function validateForm() {
        let valid = true;
        clearAllErrors();
        if (!fieldName.value.trim())          { showError(fieldName, errorName, 'Обязательное поле'); valid = false; }
        if (!fieldPosition.value.trim())      { showError(fieldPosition, errorPosition, 'Обязательное поле'); valid = false; }
        if (!fieldWorkplace.value.trim())     { showError(fieldWorkplace, errorWorkplace, 'Обязательное поле'); valid = false; }
        if (!fieldCrime.value.trim() || fieldCrime.value.trim().length < 5) {
            showError(fieldCrime, errorCrime, 'Минимум 5 символов');
            valid = false;
        }
        if (!fieldCurse.value.trim() || fieldCurse.value.trim().length < 5) {
            showError(fieldCurse, errorCurse, 'Минимум 5 символов');
            valid = false;
        }
        return valid;
    }

    [fieldName, fieldPosition, fieldWorkplace, fieldCrime, fieldCurse].forEach(f => {
        const errMap = {
            [fieldName.id]: errorName,
            [fieldPosition.id]: errorPosition,
            [fieldWorkplace.id]: errorWorkplace,
            [fieldCrime.id]: errorCrime,
            [fieldCurse.id]: errorCurse,
        };
        f.addEventListener('input', () => {
            if (f.value.trim().length > 0) clearError(f, errMap[f.id]);
        });
    });

    // ==================== НАВИГАЦИЯ ====================
    function showStep(step) {
        [stepStart, stepForm, stepResult].forEach(s => s.classList.remove('active'));
        step.classList.add('active');
    }

    function resetForm() {
        [fieldName, fieldPosition, fieldWorkplace, fieldCrime, fieldCurse].forEach(f => f.value = '');
        fieldDuration.value = 'неделя';
        clearAllErrors();
        counterCrime.textContent = '0 / 500';
        counterCurse.textContent = '0 / 500';
        counterCrime.classList.remove('warning', 'danger');
        counterCurse.classList.remove('warning', 'danger');
    }

    btnStart.addEventListener('click', () => showStep(stepForm));
    btnBack.addEventListener('click', () => { resetForm(); showStep(stepStart); });
    btnNewCurse.addEventListener('click', () => { resetForm(); showStep(stepForm); });

    // ==================== ОТПРАВКА ====================
    btnCast.addEventListener('click', () => {
        if (!validateForm()) {
            btnCast.style.animation = 'none';
            btnCast.offsetHeight;
            btnCast.style.animation = 'shake 0.4s ease';
            return;
        }

        const name     = fieldName.value.trim();
        const position = fieldPosition.value.trim();
        const workplace = fieldWorkplace.value.trim();
        const crime    = fieldCrime.value.trim();
        const curse    = fieldCurse.value.trim();
        const duration = fieldDuration.value;

        btnCast.textContent = 'Отправка...';
        btnCast.disabled = true;

        setTimeout(() => {
            cursesCast++;

            if (cursesCast >= 5) {
                resultText.textContent = 'Доставлено';
                resultSubtitle.textContent = 'Вы активно пользуетесь сервисом. Астрал впечатлён.';
            } else if (cursesCast === 1) {
                resultText.textContent = 'Готово';
                resultSubtitle.textContent = 'Проклятие доставлено по назначению';
            } else {
                resultText.textContent = 'Исполнено';
                resultSubtitle.textContent = `Проклятие №${cursesCast} успешно наложено`;
            }

            curseSummary.innerHTML = `
                <strong>Цель:</strong> ${esc(name)}, ${esc(position)}, ${esc(workplace)}<br>
                <strong>Проступок:</strong> ${esc(crime)}<br>
                <strong>Проклятие:</strong> ${esc(curse)}<br>
                <strong>Срок:</strong> ${duration}<br>
                <strong>Отправлено:</strong> ${new Date().toLocaleString('ru-RU')}
            `;

            console.log(`ПРОКЛЯТИЕ №${cursesCast}`, { name, position, workplace, crime, curse, duration });

            showStep(stepResult);
            btnCast.textContent = 'ПРОКЛЯНУТЬ';
            btnCast.disabled = false;
        }, 1800);
    });

    function esc(s) {
        const d = document.createElement('div');
        d.textContent = s;
        return d.innerHTML;
    }

    // Shake keyframes
    const shakeStyle = document.createElement('style');
    shakeStyle.textContent = `
        @keyframes shake {
            0%,100% { transform: translateX(0); }
            20%,60% { transform: translateX(-4px); }
            40%,80% { transform: translateX(4px); }
        }
    `;
    document.head.appendChild(shakeStyle);
});
