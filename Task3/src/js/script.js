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
let scheduleSelected = null;

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
    const scheduleSelectForward = document.querySelector('#schedule-list-forward'),
          scheduleSelectBack = document.querySelector('#schedule-list-back');

    initDirectionSelect(schedule, scheduleSelectForward, scheduleSelectBack);
    initScheduleSelect(schedule, scheduleSelectForward, scheduleSelectBack);
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
function initScheduleSelect(schedule, selectForward, selectBack) {
    updateSelectForward(schedule, selectForward);
    selectForward.addEventListener('change', () => {
        const id = selectForward.options[selectForward.selectedIndex].value;
        scheduleSelected = schedule.find(item => item.id === id);
        updateSelectBack(schedule, selectBack);
    });
}

/**
 * 
 * @param {{ id: string, localDtFormat: string, utcDt: Date, direction: string }[]} schedule 
 * @param {HTMLSelectElement} selectEl 
 */
function updateSelectForward(schedule, selectEl) {
    const scheduleFiltered = dir === 'ba' ? 
        schedule.filter(item => item.direction === dir) :
        schedule.filter(item => item.direction === 'ab');
    generateSelectOptions(scheduleFiltered, selectEl);

}

function updateSelectBack(schedule, selectEl) {
    const addedTime = new Date(scheduleSelected.utcDt.getTime()+50 *60 *1000);
    const scheduleFiltered = schedule.filter(item => item.direction === 'ba' && item.utcDt >= addedTime);
    generateSelectOptions(scheduleFiltered, selectEl);  
}

/**
 * 
 * @param {*} scheduleItems 
 * @param {HTMLSelectElement} selectEl 
 */
function generateSelectOptions(scheduleItems, selectEl) {
    selectEl.innerHTML = '';
    scheduleItems.forEach((item) => {
        const option = document.createElement('option');
        option.innerText = `${item.localDtFormat} ${
            item.direction === 'ab' ? '(из A в B)' : '(из B в A)'
        }`;
        option.value = item.id;
        selectEl.appendChild(option);
    });
    scheduleSelected = scheduleItems[0];
}



/**
 * 
 * @param {{ id: string, localDtFormat: string, utcDt: Date, direction: string }[]} schedule 
 * @param {HTMLSelectElement} scheduleSelectForward 
 */
function initDirectionSelect(schedule, scheduleSelectForward, scheduleSelectBack) {
    /** @type {HTMLSelectElement} */
    const dirSelect = document.querySelector('#select-direction');
    dirSelect.value = dir;

    dirSelect.addEventListener('change', () => {
        dir = dirSelect.options[dirSelect.selectedIndex].value;
        updateSelectForward(schedule, scheduleSelectForward);
        updateSelectBack(schedule, scheduleSelectBack);
        updateScheduleBackSelectVisibility(scheduleSelectBack);        
    });
}

/**
 * 
 * @param {HTMLSelectElement} scheduleSelectBack 
 */
function updateScheduleBackSelectVisibility(scheduleSelectBack) {   
    scheduleSelectBack.style.display = dir === "abba" ? "inline" : "none";
}

init();
