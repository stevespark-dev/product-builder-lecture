const generateBtn = document.getElementById('generate-btn');
const themeToggle = document.getElementById('theme-toggle');
const numberSpans = document.querySelectorAll('.number');

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
        // Add a small animation effect
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

// Event Listeners
generateBtn.addEventListener('click', generateNumbers);
themeToggle.addEventListener('click', toggleTheme);

// Initialize
const savedTheme = localStorage.getItem('theme') || 'dark';
setTheme(savedTheme);
generateNumbers();
