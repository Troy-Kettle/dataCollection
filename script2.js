// script2.js

// Part 2: Combinations of vital signs
const combinations = [
    {'Heart Rate': { value: "High", abnormal: true }, 'Systolic Blood Pressure': { value: 'Low', abnormal: true }, 'Respiratory Rate': { value: "Normal", abnormal: false }, 'Temperature': { value: "Normal", abnormal: false }, 'Oxygen Saturation': { value: "Normal", abnormal: false }},
    {'Heart Rate': { value: "High", abnormal: true }, 'Systolic Blood Pressure': { value: 'Normal', abnormal: false }, 'Respiratory Rate': { value: "High", abnormal: true }, 'Temperature': { value: "Normal", abnormal: false }, 'Oxygen Saturation': { value: "Normal", abnormal: false }},
    {'Heart Rate': { value: "High", abnormal: true }, 'Systolic Blood Pressure': { value: 'Normal', abnormal: false }, 'Respiratory Rate': { value: "Normal", abnormal: false }, 'Temperature': { value: "Low", abnormal: true }, 'Oxygen Saturation': { value: "Normal", abnormal: false }},
    {'Heart Rate': { value: "High", abnormal: true }, 'Systolic Blood Pressure': { value: 'Normal', abnormal: false }, 'Respiratory Rate': { value: "Normal", abnormal: false }, 'Temperature': { value: "Normal", abnormal: false }, 'Oxygen Saturation': { value: "Low", abnormal: true }},
    {'Heart Rate': { value: "Normal", abnormal: false }, 'Systolic Blood Pressure': { value: 'Low', abnormal: true }, 'Respiratory Rate': { value: "High", abnormal: true }, 'Temperature': { value: "Normal", abnormal: false }, 'Oxygen Saturation': { value: "Normal", abnormal: false }},
    {'Heart Rate': { value: "Normal", abnormal: false }, 'Systolic Blood Pressure': { value: 'Low', abnormal: true }, 'Respiratory Rate': { value: "Normal", abnormal: false }, 'Temperature': { value: "Low", abnormal: true }, 'Oxygen Saturation': { value: "Normal", abnormal: false }},
    {'Heart Rate': { value: "Normal", abnormal: false }, 'Systolic Blood Pressure': { value: 'Low', abnormal: true }, 'Respiratory Rate': { value: "Normal", abnormal: false }, 'Temperature': { value: 'Normal', abnormal: false }, 'Oxygen Saturation': { value: "Low", abnormal: true }},
    {'Heart Rate': { value: "Normal", abnormal: false }, 'Systolic Blood Pressure': { value: 'Normal', abnormal: false }, 'Respiratory Rate': { value: "High", abnormal: true }, 'Temperature': { value: "Low", abnormal: true }, 'Oxygen Saturation': { value: "Normal", abnormal: false }},
    {'Heart Rate': { value: "Normal", abnormal: false }, 'Systolic Blood Pressure': { value: 'Normal', abnormal: false }, 'Respiratory Rate': { value: "High", abnormal: true }, 'Temperature': { value: "Normal", abnormal: false }, 'Oxygen Saturation': { value: "Low", abnormal: true }},
    {'Heart Rate': { value: "Normal", abnormal: false }, 'Systolic Blood Pressure': { value: 'Normal', abnormal: false }, 'Respiratory Rate': { value: "Normal", abnormal: false }, 'Temperature': { value: "Low", abnormal: true }, 'Oxygen Saturation': { value: "Low", abnormal: true }}
];


function createCombinationElement(combination, index) {
    const container = document.createElement('div');
    container.className = 'combination';

    const title = document.createElement('h3');
    title.textContent = `Combination ${index + 1}`;
    container.appendChild(title);

    const table = document.createElement('table');
    table.className = 'combination-table';
    const tbody = document.createElement('tbody');

    Object.keys(combination).forEach(vitalSignName => {
        const vitalSignData = combination[vitalSignName];
        const value = vitalSignData.value;
        const isAbnormal = vitalSignData.abnormal;

        const tr = document.createElement('tr');

        const tdVitalSign = document.createElement('td');
        tdVitalSign.textContent = vitalSignName;
        tr.appendChild(tdVitalSign);

        const tdValue = document.createElement('td');
        tdValue.textContent = value;
        if (isAbnormal) {
            tdValue.style.color = '#e74c3c';
            tdValue.style.fontWeight = 'bold';
        }
        tr.appendChild(tdValue);

        tbody.appendChild(tr);
    });

    table.appendChild(tbody);
    container.appendChild(table);

    // Slider for rating (0 to 10)
    // Slider for rating (0 to 10)
    const sliderContainer = document.createElement('div');
    sliderContainer.className = 'slider-container';

    const sliderLabel = document.createElement('label');
    sliderLabel.innerHTML = 'Rate your level of concern:<br>0 = No more concerning than the individual abnormalities<br>5 = Moderately more concerning than individual abnormalities<br>10 = The combination is very much more concerning than the individual abnormalities';
    sliderContainer.appendChild(sliderLabel);

    const sliderInput = document.createElement('input');
    sliderInput.type = 'range';
    sliderInput.min = 0;
    sliderInput.max = 10;
    sliderInput.value = 5;
    sliderInput.step = 1;
    sliderInput.name = `combination-${index}`;
    sliderContainer.appendChild(sliderInput);

    const sliderValueDisplay = document.createElement('span');
    sliderValueDisplay.textContent = '5';
    sliderContainer.appendChild(sliderValueDisplay);

    sliderInput.addEventListener('input', () => {
        sliderValueDisplay.textContent = sliderInput.value;
        // Save value to localStorage whenever it changes
        saveData();
    });

    // NEW: Load saved value if available
    const savedData = JSON.parse(localStorage.getItem('part2Data'));
    if (savedData && savedData[index]) {
        sliderInput.value = savedData[index].Rating;
        sliderValueDisplay.textContent = sliderInput.value;
    }

    container.appendChild(sliderContainer);

    return container;
}

const part2Container = document.getElementById('part2Container');

combinations.forEach((combination, index) => {
    const combinationElement = createCombinationElement(combination, index);
    part2Container.appendChild(combinationElement);
});

function collectData() {
    // Collect ratings from Part 2
    const part2Ratings = combinations.map((combination, index) => {
        const sliderInput = document.querySelector(`input[name="combination-${index}"]`);
        const rating = sliderInput.value;
        return {
            'Combination': index + 1,
            'Rating': rating
        };
    });

    // Store data in localStorage
    localStorage.setItem('part2Data', JSON.stringify(part2Ratings));

    return part2Ratings;
}

// NEW: Function to save data whenever input changes
function saveData() {
    collectData();
}

// Save data when the page is unloaded (optional redundancy)
window.addEventListener('beforeunload', saveData);

const submitButton = document.getElementById('submitButton');
submitButton.addEventListener('click', () => {
    const data = collectData();
    // downloadCSV(data); // Optional: Remove or keep based on preference
    alert('Your responses have been saved. Please proceed to Part 3.');
    window.location.href = 'part3.html';
});