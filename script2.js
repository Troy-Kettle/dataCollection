// script2.js

// Part 2: Combinations of vital signs
const combinations = [
    // 1) High heart rate and low systolic blood pressure
    {'Heart Rate': { value: "High", abnormal: true }, 'Systolic Blood Pressure': { value: 'Low', abnormal: true }, 'Respiratory Rate': { value: "Normal", abnormal: false }, 'Temperature': { value: "Normal", abnormal: false }, 'Oxygen Saturation': { value: "Normal", abnormal: false }},
    
    // 2) High heart rate and high respiratory rate
    {'Heart Rate': { value: "High", abnormal: true }, 'Systolic Blood Pressure': { value: 'Normal', abnormal: false }, 'Respiratory Rate': { value: "High", abnormal: true }, 'Temperature': { value: "Normal", abnormal: false }, 'Oxygen Saturation': { value: "Normal", abnormal: false }},
    
    // 3) High heart rate and low temperature
    {'Heart Rate': { value: "High", abnormal: true }, 'Systolic Blood Pressure': { value: 'Normal', abnormal: false }, 'Respiratory Rate': { value: "Normal", abnormal: false }, 'Temperature': { value: "Low", abnormal: true }, 'Oxygen Saturation': { value: "Normal", abnormal: false }},
    
    // 4) High heart rate and high temperature
    {'Heart Rate': { value: "High", abnormal: true }, 'Systolic Blood Pressure': { value: "Normal", abnormal: false }, 'Respiratory Rate': { value: "Normal", abnormal: false }, 'Temperature': { value: "High", abnormal: true }, 'Oxygen Saturation': { value: "Normal", abnormal: false }},
    
    // 5) High heart rate and low oxygen saturations
    {'Heart Rate': { value: "High", abnormal: true }, 'Systolic Blood Pressure': { value: 'Normal', abnormal: false }, 'Respiratory Rate': { value: "Normal", abnormal: false }, 'Temperature': { value: "Normal", abnormal: false }, 'Oxygen Saturation': { value: "Low", abnormal: true }},
    
    // 6) Low systolic blood pressure and high respiratory rate
    {'Heart Rate': { value: "Normal", abnormal: false }, 'Systolic Blood Pressure': { value: 'Low', abnormal: true }, 'Respiratory Rate': { value: "High", abnormal: true }, 'Temperature': { value: "Normal", abnormal: false }, 'Oxygen Saturation': { value: "Normal", abnormal: false }},
    
    // 7) Low systolic blood pressure and low temperature
    {'Heart Rate': { value: "Normal", abnormal: false }, 'Systolic Blood Pressure': { value: 'Low', abnormal: true }, 'Respiratory Rate': { value: "Normal", abnormal: false }, 'Temperature': { value: "Low", abnormal: true }, 'Oxygen Saturation': { value: "Normal", abnormal: false }},
    
    // 8) Low systolic blood pressure and high temperature
    {'Heart Rate': { value: "Normal", abnormal: false }, 'Systolic Blood Pressure': { value: 'Low', abnormal: true }, 'Respiratory Rate': { value: "Normal", abnormal: false }, 'Temperature': { value: "High", abnormal: true }, 'Oxygen Saturation': { value: "Normal", abnormal: false }},
    
    // 9) Low systolic blood pressure and low oxygen saturations
    {'Heart Rate': { value: "Normal", abnormal: false }, 'Systolic Blood Pressure': { value: 'Low', abnormal: true }, 'Respiratory Rate': { value: "Normal", abnormal: false }, 'Temperature': { value: 'Normal', abnormal: false }, 'Oxygen Saturation': { value: "Low", abnormal: true }},
    
    // 10) High respiratory rate and low temperature
    {'Heart Rate': { value: "Normal", abnormal: false }, 'Systolic Blood Pressure': { value: 'Normal', abnormal: false }, 'Respiratory Rate': { value: "High", abnormal: true }, 'Temperature': { value: "Low", abnormal: true }, 'Oxygen Saturation': { value: "Normal", abnormal: false }},
    
    // 11) High respiratory rate and high temperature
    {'Heart Rate': { value: "Normal", abnormal: false }, 'Systolic Blood Pressure': { value: 'Normal', abnormal: false }, 'Respiratory Rate': { value: "High", abnormal: true }, 'Temperature': { value: "High", abnormal: true }, 'Oxygen Saturation': { value: "Normal", abnormal: false }},
    
    // 12) High respiratory rate and low oxygen saturations
    {'Heart Rate': { value: "Normal", abnormal: false }, 'Systolic Blood Pressure': { value: 'Normal', abnormal: false }, 'Respiratory Rate': { value: "High", abnormal: true }, 'Temperature': { value: "Normal", abnormal: false }, 'Oxygen Saturation': { value: "Low", abnormal: true }},
    
    // 13) Low temperature and low oxygen saturations
    {'Heart Rate': { value: "Normal", abnormal: false }, 'Systolic Blood Pressure': { value: 'Normal', abnormal: false }, 'Respiratory Rate': { value: "Normal", abnormal: false }, 'Temperature': { value: "Low", abnormal: true }, 'Oxygen Saturation': { value: "Low", abnormal: true }},
    
    // 14) High temperature and low oxygen saturations
    {'Heart Rate': { value: "Normal", abnormal: false }, 'Systolic Blood Pressure': { value: 'Normal', abnormal: false }, 'Respiratory Rate': { value: "Normal", abnormal: false }, 'Temperature': { value: "High", abnormal: true }, 'Oxygen Saturation': { value: "Low", abnormal: true }},
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
    const sliderContainer = document.createElement('div');
    sliderContainer.className = 'slider-container';

    const sliderLabel = document.createElement('label');
    sliderLabel.innerHTML = 'Rate your level of concern:<br>0 = No more concerning <br>5 = Moderately more concerning<br>10 = Much more concerning';
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
        saveData();
    });

    // Load saved value if available
    const savedData = JSON.parse(localStorage.getItem('part2Data'));
    if (savedData && savedData[index]) {
        sliderInput.value = savedData[index].Rating;
        sliderValueDisplay.textContent = sliderInput.value;
    }

    container.appendChild(sliderContainer);

    return container;
}

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

// Save data whenever input changes
function saveData() {
    collectData();
}

// Save data when the page is unloaded (optional redundancy)
window.addEventListener('beforeunload', saveData);

const part2Container = document.getElementById('part2Container');
combinations.forEach((combination, index) => {
    const combinationElement = createCombinationElement(combination, index);
    part2Container.appendChild(combinationElement);
});

const submitButton = document.getElementById('submitButton');
submitButton.addEventListener('click', () => {
    const data = collectData();
    alert('Your responses have been saved. Please proceed to Part 3.');
    window.location.href = 'part3.html';
});

// Function to initialize Part 2 with data from Part 1
function initPart2() {
    // Retrieve the collected data from localStorage
    const part1Data = JSON.parse(localStorage.getItem('part1Data'));

    // Check if data is available
    // if (!part1Data) {
    //     alert('No data from Part 1 found. Please complete Part 1 first.');
    //     window.location.href = 'part1.html';
    //     return;
    // }

// Display thresholds from Part 1 in Part 2 -THIS WORKS DO NOT DELETE
    // part1Data.thresholds.forEach(item => {
    //     const combinationDiv = document.createElement('div');
    //     combinationDiv.className = 'combination-item';

    //     const title = document.createElement('h3');
    //     title.textContent = `Combination for: ${item['Vital Sign']} (${item['Unit']})`;
    //     combinationDiv.appendChild(title);

    //     const values = document.createElement('p');
    //     values.textContent = `Thresholds: ${item['Values']}`;
    //     combinationDiv.appendChild(values);

    //     part2Container.appendChild(combinationDiv);
    // });
}

// Call the initialization function when the page loads
window.onload = initPart2;
