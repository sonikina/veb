document.addEventListener('DOMContentLoaded', () => {

    /* --- 1. SPA НАВІГАЦІЯ --- */
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section-view');

    window.navigateTo = function(targetId) {
        sections.forEach(sec => sec.classList.remove('active-section'));
        document.getElementById(targetId).classList.add('active-section');
        navLinks.forEach(link => {
            link.classList.remove('active');
            if(link.getAttribute('data-target') === targetId) link.classList.add('active');
        });
        window.scrollTo(0,0);
    };

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = link.getAttribute('data-target');
            navigateTo(target);
        });
    });

    /* --- 2. ТАЙМЕР --- */
    const deadline = new Date("May 14, 2026 09:00:00").getTime();
    function updateTimer() {
        const now = new Date().getTime();
        const t = deadline - now;
        if (t >= 0) {
            document.getElementById("days").innerText = Math.floor(t / (1000 * 60 * 60 * 24));
            document.getElementById("hours").innerText = Math.floor((t % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            document.getElementById("minutes").innerText = Math.floor((t % (1000 * 60 * 60)) / (1000 * 60));
            document.getElementById("seconds").innerText = Math.floor((t % (1000 * 60)) / 1000);
        }
    }
    setInterval(updateTimer, 1000);
    updateTimer();

    /* --- 3. АКОРДЕОНИ (Головна та Калькулятор) --- */
    const setupAccordion = (selector) => {
        document.querySelectorAll(selector).forEach(btn => {
            btn.addEventListener('click', () => {
                btn.classList.toggle('active');
                const content = btn.nextElementSibling;
                content.style.maxHeight = content.style.maxHeight ? null : content.scrollHeight + "px";
            });
        });
    };
    setupAccordion('.accordion-header');
    setupAccordion('.acc-btn');

    /* --- 4. КАЛЬКУЛЯТОР КБ --- */
    const calcBtn = document.getElementById('calculate-kb-btn');
    if (calcBtn) {
        const specs = {
            '121': [0.3, 0.5, 0.2, 0.2],
            '081': [0.4, 0.3, 0.4, 0.2],
            '222': [0.35, 0.35, 0.2, 0.2],
            '035': [0.4, 0.2, 0.3, 0.3]
        };
        const inputsK = ['coef-ukr', 'coef-math', 'coef-hist', 'coef-opt'].map(id => document.getElementById(id));

        document.getElementById('specialty-select').addEventListener('change', function() {
            const k = specs[this.value];
            if(k) inputsK.forEach((inp, i) => inp.value = k[i]);
        });

        calcBtn.addEventListener('click', () => {
            const getVal = id => parseFloat(document.getElementById(id).value) || 0;
            const scores = ['score-ukr', 'score-math', 'score-hist', 'score-opt'].map(getVal);
            const coefs = inputsK.map(i => parseFloat(i.value) || 0);
            
            for(let s of scores) { if(s < 100 || s > 200) { alert("Бали мають бути 100-200!"); return; } }
            if(coefs[0] === 0) { alert("Введіть коефіцієнти!"); return; }

            let sumS = 0, sumK = 0;
            scores.forEach((s, i) => { sumS += s * coefs[i]; sumK += coefs[i]; });
            let final = (sumS / sumK);
            if(final > 200) final = 200;

            document.getElementById('result-box').classList.remove('hidden');
            let temp = 100;
            const timer = setInterval(() => {
                temp += 0.5;
                if(temp >= final) { temp = final; clearInterval(timer); showCalcRecs(final); }
                document.getElementById('final-kb').innerText = temp.toFixed(2);
            }, 10);
        });

        function showCalcRecs(score) {
            const grid = document.getElementById('mini-uni-grid');
            document.getElementById('calc-recommendations').classList.remove('hidden');
            grid.innerHTML = '';
            const recs = [{n: "КПІ (Бюджет)", p: 175}, {n: "КНУ (Бюджет)", p: 182}, {n: "Львівська Політехніка", p: 168}];
            recs.forEach(r => {
                const pass = score >= r.p;
                if(pass) grid.innerHTML += `<div class="uni-mini-card pass"><span>${r.n}</span> <span>✅</span></div>`;
                else grid.innerHTML += `<div class="uni-mini-card"><span>${r.n} (мін ${r.p})</span> <span>❌</span></div>`;
            });
        }
    }

    /* --- 5. ТОП-10 УНІВЕРСИТЕТІВ --- */
    const uniList = document.getElementById('universities-list');
    const uniData = [
        { name: "КПІ ім. Ігоря Сікорського", city: "Київ", rating: 1, price: 36800 },
        { name: "КНУ ім. Тараса Шевченка", city: "Київ", rating: 2, price: 47500 },
        { name: "Львівська Політехніка", city: "Львів", rating: 3, price: 31800 },
        { name: "ХНУ (Каразіна)", city: "Харків", rating: 4, price: 29000 },
        { name: "ЛНУ ім. Франка", city: "Львів", rating: 5, price: 36000 },
        { name: "НаУКМА", city: "Київ", rating: 6, price: 62000 },
        { name: "Сумський державний ун-т", city: "Суми", rating: 7, price: 22000 },
        { name: "НУБіП", city: "Київ", rating: 8, price: 30000 },
        { name: "ОНУ (Мечникова)", city: "Одеса", rating: 9, price: 28000 },
        { name: "ЧНУ (Федьковича)", city: "Чернівці", rating: 10, price: 25000 }
    ];

    function renderUnis(list) {
        uniList.innerHTML = '';
        list.forEach(u => {
            uniList.innerHTML += `
                <div class="uni-card fade-in-element">
                    <div class="uni-logo">${u.name[0]}</div>
                    <div class="uni-info">
                        <span class="uni-rank">🏆 ТОП ${u.rating}</span>
                        <h3>${u.name}</h3>
                        <p style="color:#666; font-size:14px;">📍 ${u.city}</p>
                        <div class="uni-price">${u.price} грн/рік</div>
                    </div>
                </div>
            `;
        });
    }
    renderUnis(uniData);

    document.getElementById('apply-filters').addEventListener('click', () => {
        const city = document.getElementById('city-select').value;
        const search = document.getElementById('search-input').value.toLowerCase();
        const sort = document.getElementById('sort-select').value;

        let res = uniData.filter(u => (city === 'all' || u.city === city) && u.name.toLowerCase().includes(search));
        if(sort === 'rating') res.sort((a,b) => a.rating - b.rating);
        if(sort === 'price-asc') res.sort((a,b) => a.price - b.price);
        if(sort === 'price-desc') res.sort((a,b) => b.price - a.price);
        renderUnis(res);
    });
    document.getElementById('reset-filters').addEventListener('click', () => {
        renderUnis(uniData); document.getElementById('search-input').value='';
    });

    /* --- 6. МАТЕРІАЛИ --- */
    window.openSubject = function(subj) {
        document.getElementById('materials-overview').classList.add('hidden');
        document.getElementById('subject-detail-view').classList.remove('hidden');
        const list = document.getElementById('detail-list');
        const title = document.getElementById('detail-title');
        list.innerHTML = ''; list.className = 'resources-list';

        if(subj === 'math') {
            title.innerText = "Математика";
            list.innerHTML = `
                <div class="res-item"><div><b>🎓 iLearn</b><br><small>Курси</small></div><a href="https://ilearn.org.ua/" target="_blank" class="btn btn-sm btn-primary">Перейти</a></div>
                <div class="res-item"><div><b>📐 Формули</b><br><small>Zaxid.net</small></div><a href="https://zaxid.net/yaki_matematichni_formuli_dadut_uchasnikam_nmt_2025_pid_chas_testuvannya_perelik_n1609616" target="_blank" class="btn btn-sm btn-primary">Дивитись</a></div>
                <div class="res-item"><div><b>📝 Тести</b><br><small>ZNO.OSVITA</small></div><a href="https://zno.osvita.ua/mathematics/" target="_blank" class="btn btn-sm btn-primary">Тренуватись</a></div>
            `;
        } else if(subj === 'ukr') {
            title.innerText = "Укр. мова (Відео)";
            list.className = 'video-grid';
            ["LwH4y3iB2rU", "gG78dcD7iEw", "7qX0g8o9m3k"].forEach(v => {
                list.innerHTML += `<div class="video-item"><iframe src="https://www.youtube.com/embed/xhygAJli6SU"${v}" allowfullscreen style="width:100%; height:180px; border:none;"></iframe></div>`;
            });
        } else {
            title.innerText = "Історія України";
            list.innerHTML = `<div class="res-item"><div><b>📅 Дати (PDF)</b></div><a href="materials/history.pdf" target="_blank" class="btn btn-sm btn-primary">Скачати</a></div>`;
        }
    };
    window.closeSubject = () => {
        document.getElementById('materials-overview').classList.remove('hidden');
        document.getElementById('subject-detail-view').classList.add('hidden');
    };

    /* --- 7. ЧИТАТИ ДАЛІ --- */
    const textBtn = document.getElementById('toggle-text-btn');
    if(textBtn) {
        textBtn.addEventListener('click', () => {
            const txt = document.getElementById('seo-text');
            txt.classList.toggle('collapsed');
            textBtn.innerText = txt.classList.contains('collapsed') ? "Читати далі ▼" : "Згорнути ▲";
        });
    }

    /* --- 8. ТЕСТ (5 Питань) --- */
    const modal = document.getElementById('quiz-modal');
    const qData = [
        {q: "Що тебе більше цікавить?", a: [{t:"Комп'ютери",s:"tech"}, {t:"Історія/Мови",s:"hum"}, {t:"Малювання",s:"art"}]},
        {q: "Улюблений урок?", a: [{t:"Алгебра",s:"tech"}, {t:"Література",s:"hum"}, {t:"Мистецтво",s:"art"}]},
        {q: "Вільний час?", a: [{t:"Ігри/Код",s:"tech"}, {t:"Книги",s:"hum"}, {t:"Фото/Дизайн",s:"art"}]},
        {q: "Робота мрії?", a: [{t:"Створювати програми",s:"tech"}, {t:"Захищати людей",s:"hum"}, {t:"Архітектор",s:"art"}]},
        {q: "Ти любиш цифри?", a: [{t:"Так, дуже",s:"tech"}, {t:"Ні, краще слова",s:"hum"}, {t:"Мені байдуже",s:"art"}]}
    ];
    let qIdx = 0, scores = {tech:0, hum:0, art:0};

    document.getElementById('open-quiz-btn').addEventListener('click', () => {
        modal.style.display = 'block';
        document.getElementById('quiz-start-screen').classList.remove('hidden');
        document.getElementById('quiz-game-screen').classList.add('hidden');
        document.getElementById('quiz-result-screen').classList.add('hidden');
    });

    document.getElementById('start-quiz').addEventListener('click', () => {
        document.getElementById('quiz-start-screen').classList.add('hidden');
        document.getElementById('quiz-game-screen').classList.remove('hidden');
        qIdx = 0; scores = {tech:0, hum:0, art:0}; showQ();
    });

    function showQ() {
        if(qIdx >= qData.length) { finishQ(); return; }
        const q = qData[qIdx];
        document.getElementById('q-text').innerText = q.q;
        document.getElementById('q-progress').innerText = `${qIdx+1}/5`;
        const opts = document.getElementById('q-options');
        opts.innerHTML = '';
        q.a.forEach(ans => {
            const btn = document.createElement('button');
            btn.innerText = ans.t;
            btn.onclick = () => { scores[ans.s]++; qIdx++; showQ(); };
            opts.appendChild(btn);
        });
    }

    function finishQ() {
        document.getElementById('quiz-game-screen').classList.add('hidden');
        document.getElementById('quiz-result-screen').classList.remove('hidden');
        let max = Math.max(scores.tech, scores.hum, scores.art);
        let res = "Ти - Різнобічна особистість! ✨";
        if(scores.tech === max) res = "Ти - Технар 💻 (IT, Інженерія)";
        else if(scores.hum === max) res = "Ти - Гуманітарій 📚 (Право, Філологія)";
        else if(scores.art === max) res = "Ти - Творча натура 🎨 (Дизайн, Арт)";
        document.getElementById('q-result').innerText = res;
    }

    window.closeModal = () => modal.style.display = 'none';
    window.onclick = (e) => { if(e.target == modal) closeModal(); };
});