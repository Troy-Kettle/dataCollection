// script3.js

// Vital Signs Data
const vitalSignsData = [
    {
        name: "Heart Rate",
        unit: "beats/min",
    },
    {
        name: "Systolic Blood Pressure",
        unit: "mmHg",
    },
    {
        name: "Respiratory Rate",
        unit: "breaths/min",
    },
    {
        name: "Temperature",
        unit: "℃",
    },
    {
        name: "Oxygen Saturation",
        unit: "%",
    }
];

// Part 3 Questions
const part3Questions = [
    "What is normal for that individual patient.",
    "Whether the general trend is worsening or improving",
    "Abnormal values that have occurred within the past 24 hours"
];

// Create Part 3 Section (Further Interpretation)
const part3Container = document.getElementById('part3Container');

vitalSignsData.forEach(vitalSign => {
    const questionSet = document.createElement('div');
    questionSet.className = 'question-set';

    const title = document.createElement('h3');
    title.textContent = `When interpreting ${vitalSign.name}, how important is it to take account of:`;
    questionSet.appendChild(title);

    // Add subheading
    const subheading = document.createElement('h4');
    subheading.innerHTML = '0 = not at all important<br>5 = moderately important<br>10 = Extremely important:';
    questionSet.appendChild(subheading);

    part3Questions.forEach(questionText => {
        const question = document.createElement('div');
        question.className = 'question';

        const label = document.createElement('label');
        label.textContent = questionText;
        label.setAttribute('for', `${vitalSign.name}-${questionText}`);
        question.appendChild(label);

        // Create slider
        const sliderContainer = document.createElement('div');
        sliderContainer.className = 'slider-container';

        const sliderInput = document.createElement('input');
        sliderInput.type = 'range';
        sliderInput.min = 0;
        sliderInput.max = 10;
        sliderInput.value = 5;
        sliderInput.step = 1;
        sliderInput.name = `${vitalSign.name}-${questionText}`;
        sliderContainer.appendChild(sliderInput);

        const sliderValueDisplay = document.createElement('span');
        sliderValueDisplay.textContent = '5';
        sliderContainer.appendChild(sliderValueDisplay);

        // Load saved value if available
        const savedData = JSON.parse(localStorage.getItem('part3Data'));
        if (savedData) {
            const vitalSignData = savedData.find(v => v['Vital Sign'] === vitalSign.name);
            if (vitalSignData && vitalSignData.Questions[questionText]) {
                sliderInput.value = vitalSignData.Questions[questionText];
                sliderValueDisplay.textContent = sliderInput.value;
            }
        }

        // Save data when input changes
        sliderInput.addEventListener('input', () => {
            sliderValueDisplay.textContent = sliderInput.value;
            saveData();
        });

        question.appendChild(sliderContainer);
        questionSet.appendChild(question);
    });

    part3Container.appendChild(questionSet);
});

function collectData() {
    // Collect responses from Part 3
    const part3Responses = [];
    vitalSignsData.forEach(vitalSign => {
        const response = {
            'Vital Sign': vitalSign.name,
            'Questions': {}
        };
        part3Questions.forEach(question => {
            const sliderInput = document.querySelector(`input[name="${vitalSign.name}-${question}"]`);
            response['Questions'][question] = sliderInput.value;
        });
        part3Responses.push(response);
    });

    // Store data in localStorage
    localStorage.setItem('part3Data', JSON.stringify(part3Responses));

    return part3Responses;
}

// Function to save data whenever input changes
function saveData() {
    collectData();
}

// Save data when the page is unloaded (optional redundancy)
window.addEventListener('beforeunload', saveData);

function downloadCSV(data) {
    let csvContent = 'data:text/csv;charset=utf-8,';

    // Retrieve data from localStorage
    const part1Data = JSON.parse(localStorage.getItem('part1Data')) || {};
    const part2Data = JSON.parse(localStorage.getItem('part2Data')) || [];
    const part3Data = data;

    // Part 1 Data
    csvContent += 'Vital Sign,Unit,Thresholds\n';
    if (part1Data.thresholds) {
        part1Data.thresholds.forEach(row => {
            csvContent += `${row['Vital Sign']},${row['Unit']},${row['Values']}\n`;
        });
    }

    // Part 2 Data
    csvContent += '\nPart 2 Ratings\n';
    csvContent += 'Combination,Rating\n';
    part2Data.forEach(row => {
        csvContent += `${row['Combination']},${row['Rating']}\n`;
    });

    // Part 3 Data
    csvContent += '\nPart 3 Responses\n';
    part3Data.forEach(response => {
        csvContent += `Vital Sign: ${response['Vital Sign']}\n`;
        Object.keys(response['Questions']).forEach(question => {
            csvContent += `${question},${response['Questions'][question]}\n`;
        });
        csvContent += '\n';
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'vital_signs_complete_data.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

const submitButton = document.getElementById('submitButton');
submitButton.addEventListener('click', () => {
    const data = collectData();
    downloadCSV(data);
    alert('Your responses have been saved. Thank you for completing the survey.');

    // Optionally, clear localStorage if you want to reset the survey after completion
    // localStorage.clear();

    // Redirect to a thank you page or back to the landing page
    window.location.href = 'index.html';
});
