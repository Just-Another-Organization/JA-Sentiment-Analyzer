const BASE_URL = window.location.origin + '/api'

RECENT_MODE = 'recent'
POPULAR_MODE = 'popular'

MODES = [
    RECENT_MODE,
    POPULAR_MODE
]

NO_TIMEFRAME = 'NONE'
ONE_HOUR = '1h'
FOUR_HOUR = '4h'
ONE_DAY = '1d'
THREE_DAYS = '3d'
ONE_WEEK = '7d'
ONE_MONTH = '1M'

TIMEFRAMES = [
    NO_TIMEFRAME,
    ONE_HOUR,
    FOUR_HOUR,
    ONE_DAY,
    THREE_DAYS,
    ONE_WEEK,
    ONE_MONTH
]

let currentMode = RECENT_MODE
const MODES_NUMBER = MODES.length;
let currentTimeframe = ONE_HOUR

let timeframeListElement
let timeframePickerElement
let modeElement
let inputSearchElement
let chipsWrapperElement
let timeframeButton
let ignoreNeutralButton
let combineButton
let timeFrameShowed = false
let ignoreNeutralOption = false
let combineOption = false
let keywords = []

function submitSearch() {
    const input = inputSearchElement.value
    let query = ''

    for (const keyword of keywords) {
        query += keyword + ','
    }
    query = query.substr(0, query.length - 1)

    if (combineOption) {
        query += ' ' + input
    }

    query = query.trim()
    if (query.length <= 0) {
        showError('Please insert a valid input')
        return false
    }

    showInfo('Searching')

    fetch(BASE_URL
        + '/analyze-keywords?keywords=' + query
        + '&ignore_neutral=' + ignoreNeutralOption
        + '&combine=' + combineOption)
        .then((response) => response.json())
        .then(data => console.log(data));
}

function showInfo(text) {
    console.log(text)
}

function showError(text) {
    console.warn(text)
}

function changeMode() {
    const nextModeNumber = MODES.indexOf(currentMode) + 1
    if (nextModeNumber >= MODES_NUMBER) {
        currentMode = MODES[0]
    } else {
        currentMode = MODES[nextModeNumber]
    }
    setMode(currentMode)
}

function setMode(modeName) {
    currentMode = modeName
    setModeText(modeName)
    checkModeOptions()
    animate()
}

function setIgnoreNeutralOption(status = null) {
    if (!status) {
        status = !ignoreNeutralOption
    }
    ignoreNeutralOption = status
    if (ignoreNeutralOption) {
        ignoreNeutralButton.classList.add('active-btn')
    } else {
        ignoreNeutralButton.classList.remove('active-btn')
    }
}

function setCombineOption(status = null) {
    if (!status) {
        status = !combineOption
    }
    combineOption = status
    if (combineOption) {
        combineButton.classList.add('active-btn')
    } else {
        combineButton.classList.remove('active-btn')
    }
}

function setModeText(text) {
    modeElement.textContent = text;
}

function animate() {
    modeElement.innerHTML = modeElement.textContent.replace(/\S/g, "<span class='letter'>$&</span>");
    anime.timeline({loop: true})
        .add({
            targets: '#search-mode .letter',
            scale: [0.3, 1],
            opacity: [0, 1],
            translateZ: 0,
            easing: "easeOutExpo",
            duration: 4000,
            delay: (el, i) => 80 * (i + 1)
        })
}

function setTimeframe(timeframe) {
    currentTimeframe = timeframe;
    showTimeframes(false)
}

function showTimeframes(status = null) {
    if (timeFrameShowed || status === false) {
        timeframeListElement.style.display = 'none';
        timeframePickerElement.style.display = 'none';
    } else {
        timeframeListElement.style.display = 'flex';
        timeframePickerElement.style.display = 'block';
        timeframeListElement.innerHTML = '';
        for (const timeframe of TIMEFRAMES) {
            const li = document.createElement("li");
            li.classList.add('timeframe-item')

            if (timeframe === currentTimeframe) {
                li.classList.add('active-timeframe')
            }
            li.appendChild(document.createTextNode(timeframe));
            li.onclick = () => setTimeframe(timeframe)
            timeframeListElement.appendChild(li);
        }
    }
    timeFrameShowed = !timeFrameShowed;
}

function checkModeOptions() {
    if (inputSearchElement.value.length > 0) {
        if (currentMode === RECENT_MODE) {
            inputSearchElement.style.width = '78rem';
            timeframeButton.style.display = 'block';
        } else {
            inputSearchElement.style.width = '84rem';
            timeframeButton.style.display = 'none';
            setTimeframe(NO_TIMEFRAME)
        }
    } else {
        inputSearchElement.style.width = '90rem';
        timeframeButton.style.display = 'none';
        setTimeframe(NO_TIMEFRAME)
    }
}

function checkInput() {
    checkModeOptions()
    checkChips()
}

function checkChips() {
    const input = inputSearchElement.value
    if (input[input.length - 1] === ',') {
        createChip(input.substr(0, input.length - 1))
    }
}

function removeChip(keyword) {
    const position = keywords.indexOf(keyword)
    chipsWrapperElement.removeChild(chipsWrapperElement.children[position]);
    keywords.splice(position, 1)
}

function createChip(text) {
    keywords.push(text)
    inputSearchElement.value = ''
    chipsWrapperElement.innerHTML = ''
    if (keywords.length > 0) {
        chipsWrapperElement.style.display = 'flex'
        for (const keyword of keywords) {
            const chip = document.createElement("div");
            chip.appendChild(document.createTextNode(keyword));
            chip.classList.add('chip')
            chip.onclick = () => removeChip(keyword)
            chipsWrapperElement.appendChild(chip)
            console.log(chip)
        }
    }
}

function init() {
    modeElement = document.getElementById('search-mode')
    inputSearchElement = document.getElementById('search')
    timeframeListElement = document.getElementById('timeframes-list')
    timeframePickerElement = document.getElementById('timeframes-picker')
    timeframeButton = document.getElementById('timeframe-btn')
    ignoreNeutralButton = document.getElementById('ignore-neutral-btn')
    combineButton = document.getElementById('combine-btn')
    chipsWrapperElement = document.getElementById('chips-wrapper')
    setMode(currentMode)
    setIgnoreNeutralOption(true)
}