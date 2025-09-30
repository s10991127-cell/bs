document.addEventListener('DOMContentLoaded', () => {

    // --- DOM Elements ---
    const welcomePopup = document.getElementById('welcome-popup');
    const closePopupBtn = document.getElementById('close-popup-btn');
    const mainContainer = document.querySelector('.main-container');
    const sidebar = document.querySelector('.sidebar');
    const content = document.querySelector('.content');
    const semesterList = document.getElementById('semester-list');
    const branchNav = document.getElementById('branch-nav-1');
    const routineDisplay = document.getElementById('routine-display');
    const initialMessage = document.querySelector('.initial-message');
    const creatorText = document.getElementById('creator-text');

    // --- routines structure (metadata kept here; actual 'routine' can be null and loaded from separate files) ---
    const routines = {
        '1': {
            name: '১ম সেমিস্টার',
            branches: {
                'k': { name: 'ক শাখা', routine: null },   // routine in routines/1k.js
                'kh': { name: 'খ শাখা', routine: null },  // routines/1kh.js (create later)
                'g': { name: 'গ শাখা', routine: null }    // routines/1g.js (create later)
            }
        },
        '2': { name: '২য় সেমিস্টার', branches: null },
        '4': { name: '৪র্থ সেমিস্টার', branches: null },
        '6': { name: '৬ষ্ঠ সেমিস্টার', branches: null }
    };

    // --- Event Listeners ---
    closePopupBtn.addEventListener('click', () => {
        welcomePopup.style.display = 'none';
        mainContainer.classList.remove('hidden');
    });

    semesterList.addEventListener('click', handleSemesterClick);
    branchNav.addEventListener('click', handleBranchClick);

    // creator text playful click
    if (creatorText) {
        creatorText.addEventListener('click', () => {
            creatorText.classList.add('annoy');
            setTimeout(() => creatorText.classList.remove('annoy'), 3000);
        });
    }

    // --- Helper: get current active semester id ---
    function getActiveSemesterId() {
        const active = semesterList.querySelector('li.active');
        return active ? active.dataset.semester : null;
    }

    // --- Render branch-nav dynamically from routines metadata ---
    function renderBranchNav(semesterId) {
        branchNav.innerHTML = '';
        const sem = routines[semesterId];
        if (!sem || !sem.branches) {
            branchNav.classList.add('hidden');
            return;
        }
        for (const key in sem.branches) {
            const b = sem.branches[key];
            const div = document.createElement('div');
            div.className = 'branch-item';
            div.dataset.branch = key;
            div.dataset.semester = semesterId;
            div.textContent = b.name || key;
            branchNav.appendChild(div);
        }
        branchNav.classList.remove('hidden');
    }

    // --- Load a routine file dynamically (e.g., routines/1k.js) ---
    function loadRoutineFile(semesterId, branchId, cb) {
        const filePath = `routines/${semesterId}${branchId}.js`; // e.g., routines/1k.js
        // already loaded?
        if (document.querySelector(`script[src="${filePath}"]`)) {
            // small delay so that script's code (if it sets routines(...)) runs
            setTimeout(() => cb && cb(null), 50);
            return;
        }
        const s = document.createElement('script');
        s.src = filePath;
        s.onload = () => cb && cb(null);
        s.onerror = () => cb && cb(new Error('Failed to load ' + filePath));
        document.body.appendChild(s);
    }

    // --- Click handlers ---
    function handleSemesterClick(e) {
        const semesterItem = e.target.closest('li');
        if (!semesterItem) return;

        // ui active state
        const allSemesterItems = semesterList.querySelectorAll('li');
        allSemesterItems.forEach(item => item.classList.remove('active'));
        semesterItem.classList.add('active');

        const semesterId = semesterItem.dataset.semester;
        const semesterData = routines[semesterId];

        if (semesterData && semesterData.branches) {
            // render branch buttons dynamically for the selected semester
            renderBranchNav(semesterId);
            routineDisplay.innerHTML = `<div class="initial-message">শাখা নির্বাচন করুন</div>`;
            sidebar.classList.remove('sidebar-hidden');
            content.classList.remove('content-full');
        } else {
            branchNav.classList.add('hidden');
            showRoutine(semesterId);
        }
    }

    function handleBranchClick(e) {
        const branchItem = e.target.closest('.branch-item');
        if (!branchItem) return;

        // ui active state for branches
        const allBranchItems = branchNav.querySelectorAll('.branch-item');
        allBranchItems.forEach(item => item.classList.remove('active'));
        branchItem.classList.add('active');

        const branchId = branchItem.dataset.branch;
        const semesterId = branchItem.dataset.semester || getActiveSemesterId() || '1';
        showRoutine(semesterId, branchId);
    }

    // --- Show routine (will load external file if routine is null) ---
    function showRoutine(semesterId, branchId = null) {
        if (initialMessage) initialMessage.classList.add('hidden');

        const sem = routines[semesterId];
        if (!sem) {
            routineDisplay.innerHTML = createMessage('এই সেমিস্টারের তথ্য পাওয়া যায়নি।');
            return;
        }

        if (branchId) {
            const branchData = sem.branches ? sem.branches[branchId] : null;
            const title = `${sem.name} - ${(branchData && branchData.name) || branchId}`;

            if (branchData && branchData.routine) {
                routineDisplay.innerHTML = createRoutineTable(title, branchData.routine);
                sidebar.classList.add('sidebar-hidden');
                content.classList.add('content-full');
            } else {
                // try to load external file: routines/{semester}{branch}.js
                routineDisplay.innerHTML = createMessage('রুটিন লোড করা হচ্ছে...');
                loadRoutineFile(semesterId, branchId, (err) => {
                    const loadedBranch = routines[semesterId] && routines[semesterId].branches && routines[semesterId].branches[branchId];
                    if (!err && loadedBranch && loadedBranch.routine) {
                        routineDisplay.innerHTML = createRoutineTable(title, loadedBranch.routine);
                        sidebar.classList.add('sidebar-hidden');
                        content.classList.add('content-full');
                    } else {
                        // fallback message if file missing or routine not provided
                        routineDisplay.innerHTML = createMessage('রুটিন আপডেটের কাজ চলছে। শীঘ্রই জানানো হবে।');
                        sidebar.classList.add('sidebar-hidden');
                        content.classList.add('content-full');
                    }
                });
            }
        } else {
            // semester selected but no specific branch
            routineDisplay.innerHTML = createMessage(`রুটিন আপডেটের কাজ চলছে। শীঘ্রই জানানো হবে।`);
            sidebar.classList.remove('sidebar-hidden');
            content.classList.remove('content-full');
        }
    }

    // --- Helper Functions to create HTML content ---
    function createRoutineTable(title, routineData) {
        let dailyRoutineHTML = '';
        for (const day in routineData) {
            let subjectsHTML = '';
            routineData[day].forEach(period => {
                subjectsHTML += `<div class="time-and-subject"><strong>(${escapeHtml(period.time)})</strong> ${escapeHtml(period.subject)}</div>`;
            });
            dailyRoutineHTML += `
                <tr>
                    <td>${escapeHtml(day)}</td>
                    <td>${subjectsHTML}</td>
                </tr>
            `;
        }
        return `
            <h2>${escapeHtml(title)}</h2>
            <table>
                <thead>
                    <tr>
                        <th>দিন</th>
                        <th>বিষয়</th>
                    </tr>
                </thead>
                <tbody>
                    ${dailyRoutineHTML}
                </tbody>
            </table>
        `;
    }

    function createMessage(message) {
        return `<div class="message-box">${escapeHtml(message)}</div>`;
    }

    function escapeHtml(text) {
        if (!text && text !== 0) return '';
        return String(text)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");
    }

    // --- Initial state ---
    mainContainer.classList.add('hidden');
    welcomePopup.classList.remove('hidden');

    // If yo
