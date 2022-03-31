import word from "./word.json";
import "./style.css";

const { speechSynthesis } = window;

const LANG_RU = "ru-RU";
const pitch = 0.5;
const rate = 1.2;
const arrWords = shuffleArr(word);
const speakCompliment = [
    "Правильно",
    "Ты молодец",
    "Ты красавчик",
    "Всё верно",
    "Прекрасно",
    "Отлично",
];

let text = arrWords[0];
let voicesArr;
let ischeckWordsNow = false; // нужно для блокировки нажатия на Enter Надо от него избавиться
let countCorrectedWords = 0;
let countWordsWere = 0;
let arrWrongAnwser = [];

const promiseForGetVoices = () => {
    return new Promise(function (resolve, reject) {
        let id = setInterval(() => {
            if (speechSynthesis.getVoices().length !== 0) {
                resolve(speechSynthesis.getVoices());
                clearInterval(id);
            }
        }, 10);
    });
};

start();

function start() {
    console.log(arrWords)
    const domSendWord = "#send-word__btn";
    const domIconRepeatWord = ".reapet-word"

    document.querySelector(domSendWord).addEventListener("click", update);
    document.querySelector(domIconRepeatWord).addEventListener("click", clickRepeatIcon);
    document.addEventListener("keydown", checkKeyDown);
    speechSynthesis.addEventListener("voiceschanged", generateVoices);

    updateCounterWordsWere();
    generateVoices();
}
function update() {
    const inputText = String(
        document.getElementById("input-word__input").value
    ).trim();

    if (speechSynthesis.speaking) return;
    if (countWordsWere === arrWords.length) {
        text = "Молодец ты написал все слова";
        speak(text);
        sendResult();
        return;
    }
    if (inputText === '') {
        speak("Вы ввели пустую строку");
        return;
    }

    ischeckWordsNow = true;
    const isCorrectAnswer = inputText === text;

    if (isCorrectAnswer)
        countCorrectedWords++;
    else
        arrWrongAnwser.push([inputText, text]);

    countWordsWere++;
    updateCounterWordsWere();
    speakAnswerAndLightingText(isCorrectAnswer);
    showCorrectWordAndMistakes(isCorrectAnswer, inputText);

    setTimeout(() => {
        ischeckWordsNow = false;
        deleteLigthingInputAndClearInput();
        nextWord();
    }, 3000);
}
function clickRepeatIcon() {
    speak(text);
    document.querySelector(".reapet-word").style.animation =
        "speek 1s ease-in 0.2s";
    setInterval(() => {
        if (!speechSynthesis.speaking) {
            document.querySelector(".reapet-word").style.animation = "none";
        }
    }, 200);
}
function checkKeyDown(event) {
    event.code == "Enter" &&
        !speechSynthesis.speaking &&
        !ischeckWordsNow &&
        update();
}
function generateVoices() {
    promiseForGetVoices().then(() => {
        voicesArr = speechSynthesis.getVoices();
        voicesArr = voicesArr.filter((voice) => voice.lang === LANG_RU);
    });
}
function nextWord() {
    text = arrWords[countWordsWere];
    speak(text);
}
function deleteLigthingInputAndClearInput() {
    document
        .getElementById("input-word__input")
        .classList.remove("input-word__input--correct");

    document
        .getElementById("input-word__input")
        .classList.remove("input-word__input--wrong");


    document.getElementById("input-word__input").value = "";
}
function updateCounterWordsWere() {
    const domCounterAnswer = "#counter-correct-answer";

    document.querySelector(
        domCounterAnswer
    ).innerHTML = `${countWordsWere} / ${arrWords.length}`;
}
function speak(speakText) {
    if (!speechSynthesis.speaking) {
        const ssUtterance = new SpeechSynthesisUtterance(speakText);

        ssUtterance.voice = voicesArr[1];
        ssUtterance.pitch = rate;
        ssUtterance.rate = pitch;
        ssUtterance.volume = 2.0;

        speechSynthesis.speak(ssUtterance);
    }
}
function shuffleArr(arr) {
    for (let i = arr.length - 1; i >= 0; i--) {
        const num = Math.floor(Math.random() * (i + 1));
        const d = arr[num];
        arr[num] = arr[i];
        arr[i] = d;
    }
    return arr;
}
function arrayRandElement(arr) {
    const rand = Math.floor(Math.random() * arr.length);
    return arr[rand];
}
function speakAnswerAndLightingText(isCorrectAnswer) {
    if (isCorrectAnswer) {
        document
            .getElementById("input-word__input")
            .classList.add("input-word__input--correct");

        const compliment = arrayRandElement(speakCompliment);
        speak(compliment);
    } else {
        document
            .getElementById("input-word__input")
            .classList.add("input-word__input--wrong");

        speak("Неправильно");
    }
}
function showCorrectWordAndMistakes(isCorrectAnswer, inputText) {
    if (isCorrectAnswer) {
        document.querySelector("#output-word").innerHTML = "";
    } else {
        document.querySelector(
            "#output-word"
        ).innerHTML = `<span class="output-word--correct">${text}</span></br>
                       <span class="output-word--wrong">${inputText}</span> `;
    }
}

function sendResult() {

}