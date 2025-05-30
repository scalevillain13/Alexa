function initTheme() {
    const savedTheme = localStorage.getItem('alexa-theme');
    const themeSwitcher = document.querySelector('.theme-switcher');
    
    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
        themeSwitcher.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
        document.body.classList.remove('light-theme');
        themeSwitcher.innerHTML = '<i class="fas fa-moon"></i>';
    }
    
    themeSwitcher.addEventListener('click', () => {
        if (document.body.classList.contains('light-theme')) {
            document.body.classList.remove('light-theme');
            localStorage.setItem('alexa-theme', 'dark');
            themeSwitcher.innerHTML = '<i class="fas fa-moon"></i>';
        } else {
            document.body.classList.add('light-theme');
            localStorage.setItem('alexa-theme', 'light');
            themeSwitcher.innerHTML = '<i class="fas fa-sun"></i>';
        }
    });
}

function alexaAI(question) {
    const q = question.toLowerCase().trim();
    
    // Математические операции
    if (q.match(/(сколько будет|посчитай|реши)/)) {
        const mathRegex = /(\d+)\s*([\+\-\*\/x])\s*(\d+)/;
        const match = q.match(mathRegex);
        
        if (match) {
            const a = parseFloat(match[1]);
            const b = parseFloat(match[3]);
            const op = match[2];
            
            let result;
            switch(op) {
                case '+': result = a + b; break;
                case '-': result = a - b; break;
                case '*': case 'x': result = a * b; break;
                case '/': result = b !== 0 ? a / b : 'Ошибка (деление на ноль)'; break;
                default: return "Поддерживаются только операции: +, -, *, /";
            }
            
            return `Результат: ${a} ${op} ${b} = <strong>${result}</strong>`;
        }
    }
    
    // Ответы на вопросы
    const responses = {
        "привет": "Здравствуйте. Чем могу помочь?",
        "как дела": "Всё функционирует в штатном режиме",
        "как тебя зовут": "Меня зовут Alexa, ваш цифровой помощник",
        "что такое фотосинтез": "Процесс преобразования света в энергию растениями",
        "кто создал электричество": "Многие учёные внесли вклад, включая Фарадея и Теслу",
        "спасибо": "Всегда пожалуйста",
        "пока": "До свидания",
        "alexa": "Да, я вас слушаю"
    };
    
    // Поиск совпадений
    for (const [keyword, response] of Object.entries(responses)) {
        if (q.includes(keyword)) {
            return response;
        }
    }
    
    // Генеративные ответы
    if (q.includes("почему")) {
        const reasons = [
            "Это связано с фундаментальными законами природы",
            "У этого явления есть несколько объяснений",
            "На этот вопрос нет однозначного ответа",
            "Требуется дополнительное исследование"
        ];
        return reasons[Math.floor(Math.random() * reasons.length)];
    }
    
    if (q.includes("когда")) {
        const times = [
            "В ближайшее время",
            "Точные сроки неизвестны",
            "Это зависит от многих факторов",
            "Когда будут выполнены необходимые условия"
        ];
        return times[Math.floor(Math.random() * times.length)];
    }
    
    // Рандомные ответы
    const randomResponses = [
        "Пока не могу ответить на этот вопрос",
        "Моя текущая версия не поддерживает этот функционал",
        "Уточните ваш запрос",
        "Обратитесь с другим вопросом"
    ];
    
    return randomResponses[Math.floor(Math.random() * randomResponses.length)];
}

function animateResponse(responseElement, text) {
    let i = 0;
    responseElement.innerHTML = "";
    
    const interval = setInterval(() => {
        if (i < text.length) {
            if (text[i] === '<') {
                const tagEnd = text.indexOf('>', i) + 1;
                responseElement.innerHTML += text.substring(i, tagEnd);
                i = tagEnd;
            } else {
                responseElement.innerHTML += text[i];
                i++;
            }
        } else {
            clearInterval(interval);
        }
    }, 20);
}

function adaptExamplesForMobile() {
    const examplesContainer = document.querySelector('.examples p');
    const examples = document.querySelectorAll('.example');
    
    if (window.innerWidth < 600) {
        examplesContainer.innerHTML = 'Попробуйте: ';
        examples.forEach(example => {
            const clone = example.cloneNode(true);
            examplesContainer.appendChild(clone);
            examplesContainer.appendChild(document.createTextNode(' '));
        });
    }
}

function setupMobileKeyboardBehavior() {
    const input = document.getElementById('user-input');
    const container = document.querySelector('.container');
    
    input.addEventListener('focus', () => {
        if (window.innerWidth < 700) {
            container.style.marginBottom = '100px';
            container.scrollIntoView({behavior: 'smooth', block: 'center'});
        }
    });
    
    input.addEventListener('blur', () => {
        if (window.innerWidth < 700) {
            container.style.marginBottom = '';
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    
    const input = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    const responseElement = document.getElementById('ai-response');
    const examples = document.querySelectorAll('.example');
    
    input.focus();
    
    function sendMessage() {
        const question = input.value.trim();
        if (!question) return;
        
        responseElement.innerHTML = '<div class="typing-indicator"><span></span><span></span><span></span></div>';
        input.value = '';
        input.blur();
        
        setTimeout(() => {
            const response = alexaAI(question);
            animateResponse(responseElement, response);
        }, 800);
    }
    
    sendBtn.addEventListener('click', sendMessage);
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });
    
    examples.forEach(example => {
        example.addEventListener('click', () => {
            input.value = example.textContent;
            sendMessage();
        });
    });
    
    setTimeout(() => {
        animateResponse(responseElement, "Здравствуйте. Я Alexa, ваш цифровой помощник. Чем могу помочь?");
    }, 1000);
    
    // Адаптация для мобильных устройств
    adaptExamplesForMobile();
    setupMobileKeyboardBehavior();
    window.addEventListener('resize', adaptExamplesForMobile);
    
    // Автоматическое изменение высоты input для мобильных
    input.addEventListener('input', function() {
        if (window.innerWidth < 600) {
            this.style.height = 'auto';
            this.style.height = (this.scrollHeight > 100 ? 100 : this.scrollHeight) + 'px';
        }
    });
    
    // Оптимизация для сенсорных экранов
    document.body.addEventListener('touchstart', function() {}, false);
});
