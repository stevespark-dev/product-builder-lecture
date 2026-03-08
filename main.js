const generateBtn = document.getElementById('generate-btn');
const themeToggle = document.getElementById('theme-toggle');
const numberSpans = document.querySelectorAll('.number');

// Animal Test Elements
const imageUpload = document.getElementById('image-upload');
const uploadBtn = document.getElementById('upload-btn');
const imagePreview = document.getElementById('image-preview');
const labelContainer = document.getElementById('label-container');
const resultMessage = document.getElementById('result-message');

// Lotto Number Generation Logic
function generateNumbers() {
    const numbers = new Set();
    while (numbers.size < 6) {
        const randomNumber = Math.floor(Math.random() * 45) + 1;
        numbers.add(randomNumber);
    }

    const sortedNumbers = Array.from(numbers).sort((a, b) => a - b);

    numberSpans.forEach((span, index) => {
        span.textContent = sortedNumbers[index];
        span.style.transform = 'scale(1.1)';
        setTimeout(() => {
            span.style.transform = 'scale(1)';
        }, 200);
    });
}

// Theme Switching Logic
function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    themeToggle.textContent = theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode';
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
}

// Animal Face Test Logic (Teachable Machine)
const MODEL_URL = "https://teachablemachine.withgoogle.com/models/2rwCYmHap/";
let model, maxPredictions;

async function initModel() {
    const modelURL = MODEL_URL + "model.json";
    const metadataURL = MODEL_URL + "metadata.json";
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();
}

async function predict() {
    if (!model) await initModel();
    const prediction = await model.predict(imagePreview);
    
    labelContainer.innerHTML = "";
    let bestMatch = { className: "", probability: 0 };

    for (let i = 0; i < maxPredictions; i++) {
        const classPrediction = prediction[i];
        const prob = (classPrediction.probability * 100).toFixed(0);
        
        if (classPrediction.probability > bestMatch.probability) {
            bestMatch = classPrediction;
        }

        const barContainer = document.createElement("div");
        barContainer.className = "result-bar-container";
        barContainer.innerHTML = `
            <span class="label-name">${classPrediction.className}</span>
            <div class="bar-bg">
                <div class="bar-fill" style="width: ${prob}%"></div>
            </div>
            <span class="percentage">${prob}%</span>
        `;
        labelContainer.appendChild(barContainer);
    }

    resultMessage.textContent = `You look like a ${bestMatch.className}!`;
}

// Event Listeners
generateBtn.addEventListener('click', generateNumbers);
themeToggle.addEventListener('click', toggleTheme);

uploadBtn.addEventListener('click', () => imageUpload.click());

imageUpload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = async (event) => {
            imagePreview.src = event.target.result;
            imagePreview.style.display = 'block';
            resultMessage.textContent = "Analyzing image...";
            await predict();
        };
        reader.readAsDataURL(file);
    }
});

// Initialize
const savedTheme = localStorage.getItem('theme') || 'dark';
setTheme(savedTheme);
generateNumbers();
initModel(); // Pre-load model
