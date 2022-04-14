/*
Я решил реализовать примитивный поиск по сотрудникам и отображение небольшого количества информации при клике на каждого из них. 
В нормальных условиях для этого использовались бы AJAX запросы в базу данных на сервер,
но у меня этими средствами нет возможности воспользоваться, поэтому я сделал это, используя только функционал нативного JS 
*/
const searchInput = document.querySelector('.search__input');
const workerCollection = document.querySelectorAll('.employees__worker');
// получение необохидомой информации через HTML коллекции
const workerNameCollection = document.querySelectorAll('.worker__name');
const workerPositionCollection = document.querySelectorAll('.worker__position');
const workerPhotoCollection = document.querySelectorAll('.worker__avatar');
const workerStatusCollection = document.querySelectorAll('.worker__status');
const workerNumberCollection = document.querySelectorAll('.worker__number');
const workerStatusArr = ["fired", '', 'd-none'] // массив БЭМ-модификаторов, определяющих стиль статуса сотрудника, для уволенных-fired, для тех кто в отпуске-ничего и для тех у кого статус не отображается - d-none
let workerIsVisible = ['', 'active', ''] //массив БЭМ-модификаторов, определяющих стиль всей панели работника, если он в данный момент отображается в основной части контента, то active. Изначально имеет такой вид

// получение необходимых для вывода информации "контейнеров"
const employeesContainer = document.querySelector('.employees');
const employeeName = document.querySelector('.employee__name');
const employeePhoto = document.querySelector('.employee__avatar>img');
const employeePosition = document.querySelector('.employee__position');
const employeeLastActive = document.querySelector('.last-activites__value');
const employeeLastActiveArr = ['вчера в 14:54', 'сегодня в 12:22', '20.04.2022 в 17:30']; //Какие-то значения, которые не даны в макете, я буду выдумывать сам 

const employeeRiskValue = document.querySelector('.static__value-main.level-risks');
const employeeRiskChange = document.querySelector('.static__value-change.level-risks');
const employeeRiskValueArr = ['220', '157', '133']; //массив уровней риска сотрудников ниже будут такие же массивы для других показателей
const employeeRiskChangeArr = ['+30', '-100', '-55']; // массив изменения уровней риска сотрудников

const employeeProductivityValue = document.querySelector('.static__value-main.productivity');
const employeeProductivityChange = document.querySelector('.static__value-change.productivity');
const employeeProductivityValueArr = ['90', '86', '75'];
const employeeProductivityChangeArr = ['+10', '+3', '-5'];

const employeeActivityIndexValue = document.querySelector('.static__value-main.activity-index');
const employeeActivityIndexChange = document.querySelector('.static__value-change.activity-index');
const employeeActivityIndexValueArr = ['3.5', '2.4', '1.8'];
const employeeActivityIndexChangeArr = ['+21', '+14', '-20'];

let workerInfo = [];

for (let i = 0; i < workerNameCollection.length; i++) { //Создание массива объектов - "базы данных"
    workerInfo[i] = {
        imgSrc: workerPhotoCollection[i].firstElementChild.src,
        name: workerNameCollection[i].innerText,
        status: workerStatusCollection[i].textContent,
        position: workerPositionCollection[i].textContent,
        number: workerNumberCollection[i].textContent,
        timeActive: employeeLastActiveArr[i],
        riskValue: employeeRiskValueArr[i],
        riskChange: employeeRiskChangeArr[i],
        productivityValue: employeeProductivityValueArr[i],
        productivityChange: employeeProductivityChangeArr[i],
        indexActivityValue: employeeActivityIndexValueArr[i],
        indexActivityChange: employeeActivityIndexChangeArr[i],
    }
}
searchInput.addEventListener('input', (e) => {
    if (searchIndexOfWorker(e.target.value)) {
        printResults(searchIndexOfWorker(e.target.value));
    }
    if (!searchIndexOfWorker(e.target.value)) {
        employeesContainer.innerHTML = 'Поиск не дал результатов';
    }
});

for (let i = 0; i < workerCollection.length; i++) {
    workerCollection[i].addEventListener('click', (e) => {
        for (let j = 0; j < workerCollection.length; j++) { //если сработал клик, то нужно со всех остальных работников убрать класс active
            workerCollection[j].classList.remove('active');
        }
        workerCollection[i].classList.add('active'); // а на необходимого работника наоборот повесить класс active
        employeeName.innerHTML = workerInfo[i].name;
        employeePhoto.src = workerInfo[i].imgSrc;
        employeeLastActive.innerHTML = workerInfo[i].timeActive;

        employeeRiskValue.innerHTML = employeeRiskValueArr[i];
        if (employeeRiskChangeArr[i] > 0) { // если тенденция положительная, то добавляется соответствующий css-класс, так для всех трех показателей
            employeeRiskChange.classList.remove('negative');
            employeeRiskChange.classList.add('positive');

        }
        if (employeeRiskChangeArr[i] < 0) {
            employeeRiskChange.classList.remove('positive');
            employeeRiskChange.classList.add('negative');
        }
        employeeRiskChange.innerHTML = `${employeeRiskChangeArr[i]}%`;
        employeeProductivityValue.innerHTML = employeeProductivityValueArr[i];
        if (employeeProductivityChangeArr[i] > 0) {
            employeeProductivityChange.classList.remove('negative');
            employeeProductivityChange.classList.add('positive');
        }
        if (employeeProductivityChangeArr[i] < 0) {
            employeeProductivityChange.classList.remove('positive');
            employeeProductivityChange.classList.add('negative');
        }
        employeeProductivityChange.innerHTML = `${employeeProductivityChangeArr[i]}%`;
        employeeActivityIndexValue.innerHTML = employeeActivityIndexValueArr[i];
        if (employeeActivityIndexChangeArr[i] > 0) {
            employeeActivityIndexChange.classList.remove('negative');
            employeeActivityIndexChange.classList.add('positive');
        }
        if (employeeActivityIndexChangeArr[i] < 0) {
            employeeActivityIndexChange.classList.remove('positive');
            employeeActivityIndexChange.classList.add('negative');
        }
        employeeActivityIndexChange.innerHTML = `${employeeActivityIndexChangeArr[i]}%`;

    })

}

function searchIndexOfWorker(inputValue) { //Функция которая ищет результаты совпадения. Возвращает массив индексов или false, если ничего не найдено
    let resultsArr = [];
    for (let i = 0; i < workerNameCollection.length; i++) {
        if (inputValue != '' && inputValue != ' ') {
            if (workerNameCollection[i].textContent.includes(inputValue)) {
                resultsArr.push(i);
            }
        }
    }
    if (resultsArr.length > 0) {
        return resultsArr;
    } else {
        if (inputValue == '') { // если строка поиска пустая, то всё возвращается в изначальное положение 
            resultsArr = [0, 1, 2];
            return resultsArr;
        } else {
            return false;
        }
    }
}

function printResults(arrayOfIndex) { // функция, отрисовывающая результаты поиска на основе массива совпадающих индексов 
    employeesContainer.innerHTML = '';
    for (let i = 0; i < arrayOfIndex.length; i++) {
        employeesContainer.insertAdjacentHTML('beforeend', `
			<div class="employees__worker ${workerIsVisible[arrayOfIndex[i]]}">
			<div class="worker__left-side">
				 <div class="worker__avatar">
					  <img src="${workerInfo[arrayOfIndex[i]].imgSrc}" alt="">
				 </div>
				 <div class="worker__info">
					  <div class="worker__name">${workerInfo[arrayOfIndex[i]].name}</div>
					  <div class="worker__position">${workerInfo[arrayOfIndex[i]].position}</div>
					  <div class="worker__status ${workerStatusArr[arrayOfIndex[i]]}">${workerInfo[arrayOfIndex[i]].status}</div>
				 </div>
			</div>
			<div class="worker__number">${workerInfo[arrayOfIndex[i]].number}</div>
	  </div>
			`);
    }

}