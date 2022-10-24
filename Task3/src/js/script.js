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

/**
 * @type {700 | 1200};
 */
let ticketPrice = 700;


/** @type {{ id: string, localDtFormat: string, utcDt: Date, direction: string }} */
let scheduleSelected = null;

/** @type {'ab' | 'ba' | 'abba'} */
let dir = 'ab';


 const defaultTravelTime = 50;

/**
 * @type {{direction: string, time: Date}}
 */
let finalForwardInfo = {};
let finalBackInfo = {};

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
    calcResult();
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
    finalForwardInfo.time = selectForward.utcDt;
    selectForward.addEventListener('change', () => {
        const id = selectForward.options[selectForward.selectedIndex].value;
        scheduleSelected = schedule.find(item => item.id === id);
        console.log(scheduleSelected); //Оставил для удобства проверки
        finalForwardInfo.direction = scheduleSelected.direction === 'ba' ? 'из B в А' : 'из А в В';
        finalForwardInfo.time = scheduleSelected.utcDt;
        updateSelectBack(schedule, selectBack);
    });
    selectBack.addEventListener('change', () => {
        const id = selectBack.options[selectBack.selectedIndex].value;
        scheduleSelected = schedule.find(item => item.id === id);
        finalBackInfo.time = scheduleSelected.utcDt;
        console.log(scheduleSelected); // Оставил для удобства проверки
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
        dir === "abba" ? ticketPrice = 1200 : ticketPrice = 700;
        dir === "abba" ? finalBackInfo.direction = 'и обратно в А' :  finalBackInfo.direction = null;
    });
}

/**
 * 
 * @param {HTMLSelectElement} scheduleSelectBack 
 */
function updateScheduleBackSelectVisibility(scheduleSelectBack) {   
    scheduleSelectBack.style.display = dir === "abba" ? "inline" : "none";
}

function calcResult() {

    document.querySelector('button').addEventListener('click', function() {
        const num = document.querySelector('#num').value;
        if (dir === "abba") {
            if (finalBackInfo.time == undefined || finalForwardInfo.time == undefined) {
                document.querySelector('#result').innerText = 'Выберите время!';
            }
            else {
                let distance = new Date(((finalBackInfo.time.getTime() + 50 *60 *1000) - finalForwardInfo.time.getTime())).getTime();
                let newBackTime = new Date (finalBackInfo.time.getTime()+50*60*1000);
                let days = Math.floor(distance / (1000 * 60 * 60 * 24));
                let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                let seconds = Math.floor((distance % (1000 * 60)) / 1000);

                document.querySelector('#result').innerText = `Вы выбрали ${num} билета по маршруту ${finalForwardInfo.direction} ${finalBackInfo.direction ? finalBackInfo.direction+" " : ""}стоимостью ${ticketPrice*num}\n Это путешествие займет у вас ${days + "d " + hours + "h "
                + minutes + "m " + seconds + "s "}\n Теплоход отправляется  ${DATETIME_FORMATTER.format(new Date(finalForwardInfo.time + 'Z'))}, a прибудет ${DATETIME_FORMATTER.format(new Date((newBackTime) + 'Z'))}`;

            }
        } else {
            if (finalForwardInfo.time == undefined) {
                document.querySelector('#result').innerText = 'Выберите время!';
            } else {
                let newForwardTime = new Date(finalForwardInfo.time.getTime()+50*60*1000);

                document.querySelector('#result').innerText = `Вы выбрали ${num} билета по маршруту ${finalForwardInfo.direction} стоимостью ${ticketPrice*num}\n  Это путешествие займет у вас ${defaultTravelTime} минут\n Теплоход отправляется  ${DATETIME_FORMATTER.format(new Date(finalForwardInfo.time + 'Z'))}, a прибудет ${DATETIME_FORMATTER.format(new Date((newForwardTime) + 'Z'))}`;
            }
        }
    });
}

init();
