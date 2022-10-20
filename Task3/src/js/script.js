'use strict'

const DATETIME_FORMATTER = new Intl.DateTimeFormat('ru', { dateStyle: 'short', timeStyle: 'short' });

/** Время в UTC */
const inputDates = {
  ab: [
    "2021-08-21T15:00:00",
    "2021-08-21T15:30:00",
    "2021-08-21T15:45:00",
    "2021-08-21T16:00:00",
    "2021-08-21T16:15:00",
    "2021-08-21T18:00:00",
  ],
  ba: [
    "2021-08-21T15:30:00",
    "2021-08-21T15:45:00",
    "2021-08-21T16:00:00",
    "2021-08-21T16:15:00",
    "2021-08-21T16:35:00",
    "2021-08-21T18:50:00",
    "2021-08-21T18:55:00",
  ],
};

/** @type {{ id: string, localDtFormat: string, utcDt: Date, direction: string }} */
let shceduleSelected = null;

/** @type {'ab' | 'ba' | 'abba'} */
let dir = 'ab';

function init() {
    // Автоматический перевод из UTC в локальное время браузера
    /**
     * Список schedule-объектов, хранящий информацию о локальном времени, utc времени и направлении
     * @type {{ id: string, localDtFormat: string, utcDt: Date, direction: string }[]}
     */
    const schedule = [
        ...inputDates.ab.map(date => getScheduleObject(date, 'ab')),
        ...inputDates.ba.map(date => getScheduleObject(date, 'ba')),
    ];

    /** @type {HTMLSelectElement} */
    const scheduleSelect = document.querySelector('#schedule-list');

    initDirectionSelect(schedule, scheduleSelect);
    initScheduleSelect(schedule, scheduleSelect);
}

/**
 * 
 * @param {string} dateStr 
 * @param {'ab' | 'ba'} direction 
 * @returns {{ id: string, localDtFormat: string, utcDt: Date, direction: string }}
 */
function getScheduleObject(dateStr, direction) {
    return {
        id: String(Math.random()),
        localDtFormat: DATETIME_FORMATTER.format(new Date(dateStr + 'Z')),
        utcDt: new Date(dateStr),
        direction
    };
}

/**
 * 
 * @param {{ id: string, localDtFormat: string, utcDt: Date, direction: string }[]} schedule 
 * @param {HTMLSelectElement} select 
 */
function initScheduleSelect(schedule, select) {
    generateScheduleOptions(schedule, select);
    select.addEventListener('change', () => {
        const id = select.options[select.selectedIndex].value;
        shceduleSelected = schedule.find(item => item.id === id);
    });
}

/**
 * 
 * @param {{ id: string, localDtFormat: string, utcDt: Date, direction: string }[]} schedule 
 * @param {HTMLSelectElement} selectEl 
 */
function generateScheduleOptions(schedule, selectEl) {
    selectEl.innerHTML = '';
    const scheduleFiltered = dir === 'abba' ? schedule :
        schedule.filter(item => item.direction === dir);

    scheduleFiltered.forEach((item) => {
        const option = document.createElement('option');
        option.innerText = `${item.localDtFormat} ${
            item.direction === 'ab' ? '(из A в B)' : '(из B в A)'
        }`;
        option.value = item.id;
        selectEl.appendChild(option);
    });
    shceduleSelected = schedule[0];
}

/**
 * 
 * @param {{ id: string, localDtFormat: string, utcDt: Date, direction: string }[]} schedule 
 * @param {HTMLSelectElement} scheduleSelect 
 */
function initDirectionSelect(schedule, scheduleSelect) {
    /** @type {HTMLSelectElement} */
    const dirSelect = document.querySelector('#select-direction');
    dirSelect.value = dir;

    dirSelect.addEventListener('change', () => {
        dir = dirSelect.options[dirSelect.selectedIndex].value;
        generateScheduleOptions(schedule, scheduleSelect);
    });
}

init();
