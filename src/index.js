import word from "./word.json";

const { speechSynthesis } = window;
const arrWords = word;
const LANG_RU = "ru-RU";

const pitch = 0.5;
const rate = 1.2;
let text = arrayRandElement(arrWords);

let s = setSpeech();
let voicesArr;

generateVoices();
speechSynthesis.addEventListener("voiceschanged", generateVoices);
document.getElementById("send-word__btn").addEventListener("click", checkWord);
document.addEventListener('keydown', function (event) {
    if (event.code == 'Enter') checkWord();
});

function setSpeech() {
    return new Promise(function (resolve, reject) {
        let synth = window.speechSynthesis;
        let id = setInterval(() => {
            if (synth.getVoices().length !== 0) {
                resolve(synth.getVoices());
                clearInterval(id);
            }
        }, 10);
    });
}

//Генерация голосов
function generateVoices() {
    s.then(() => {
        voicesArr = speechSynthesis.getVoices();
        voicesArr = voicesArr.filter((voice) => voice.lang === LANG_RU);
    });
};

// Воспроизведение
function speak() {
    if (!speechSynthesis.speaking) {
        const ssUtterance = new SpeechSynthesisUtterance(text);

        ssUtterance.voice = voicesArr[1];
        ssUtterance.pitch = rate;
        ssUtterance.rate = pitch;

        speechSynthesis.speak(ssUtterance);
    }
};

function arrayRandElement(arr) {
    var rand = Math.floor(Math.random() * arr.length);
    return arr[rand];
}

function checkWord() {
    if (!speechSynthesis.speaking) {
        const inputText = document.getElementById('input-word__input').value;
        if (inputText === text) console.log('приавильно');
        else console.log('неприавильно');
        text = arrayRandElement(arrWords);
        speak();
        document.getElementById('input-word__input').value = '';
    }
}