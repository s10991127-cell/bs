// routines/1k.js
// ১ম সেমিস্টার - ক শাখার রুটিন (এই ফাইলটি script.js-এর global `routines` অবজেক্টকে পূরণ করবে)
(function () {
    const data = {
        'রবিবার': [
            { time: '09:30 – 10:15', subject: 'রসায়ন-১' },
            { time: '10:20 – 11:05', subject: 'পদার্থ-১' },
            { time: '11:10 – 11:55', subject: 'গণিত-১' }
        ],
        'সোমবার': [
            { time: '09:30 – 10:15', subject: 'ব্যব : রসায়ন-১' },
            { time: '10:20 – 11:05', subject: 'জীববিজ্ঞান-১' },
            { time: '11:10 – 11:55', subject: 'ব্যব : পদার্থ-১' }
        ],
        'মঙ্গলবার': [
            { time: '09:30 – 10:15', subject: 'ইংরেজি-১' },
            { time: '10:20 – 11:05', subject: 'ব্যব: জীববিজ্ঞান-১' },
            { time: '11:10 – 11:55', subject: 'গণিত -১' }
        ],
        'বুধবার': [
            { time: '11:10 – 11:55', subject: 'ইংরেজি-১' },
            { time: '12:00 – 12:45', subject: 'রসায়ন -১' }
        ],
        'বৃহস্পতিবার': [
            { time: '12:00 – 12:45', subject: 'ব্যব: গণিত-১' },
            { time: '12:50 – 01:35', subject: 'পদার্থ-১' }
        ]
    };

    // যদি global routines অবজেক্ট থাকে, সেখানেই ঢুকিয়ে দিন
    if (window.routines && window.routines['1'] && window.routines['1'].branches) {
        window.routines['1'].branches['k'] = window.routines['1'].branches['k'] || { name: 'ক শাখা', routine: null };
        window.routines['1'].branches['k'].routine = data;
    } else {
        // fallback: routines নেই => create minimal structure
        window.routines = window.routines || {};
        window.routines['1'] = window.routines['1'] || { name: '১ম সেমিস্টার', branches: {} };
        window.routines['1'].branches['k'] = { name: 'ক শাখা', routine: data };
    }
})();
