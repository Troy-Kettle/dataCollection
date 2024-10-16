document.addEventListener('DOMContentLoaded', () => {
    // Vital Signs Data
    const vitalSignsData = [
        { name: "Heart Rate", unit: "beats/min" },
        { name: "Systolic Blood Pressure", unit: "mmHg" },
        { name: "Respiratory Rate", unit: "breaths/min" },
        { name: "Temperature", unit: "℃" },
        { name: "Oxygen Saturation", unit: "%" }
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
            const savedData = JSON.parse(localStorage.getItem('part3Data')) || [];
            const vitalSignData = savedData.find(v => v['Vital Sign'] === vitalSign.name);
            if (vitalSignData && vitalSignData.Questions[questionText] !== undefined) {
                sliderInput.value = vitalSignData.Questions[questionText];
                sliderValueDisplay.textContent = sliderInput.value;
            }

            // Update display value and save on input
            sliderInput.addEventListener('input', () => {
                sliderValueDisplay.textContent = sliderInput.value;
                saveData();
            });

            question.appendChild(sliderContainer);
            questionSet.appendChild(question);
        });

        part3Container.appendChild(questionSet);
    });

    // Collect and save Part 3 data
    function saveData() {
        collectData();
    }

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
                response['Questions'][question] = sliderInput ? sliderInput.value : 'No response';
            });
            part3Responses.push(response);
        });

        // Store data in localStorage
        localStorage.setItem('part3Data', JSON.stringify(part3Responses));

        return part3Responses;
    }

    // Save Consent Data
    function saveConsentData() {
        const consent1 = document.querySelector('input[name="consent1"]');
        const consent2 = document.querySelector('input[name="consent2"]');
        const consent3 = document.querySelector('input[name="consent3"]');

        const consentData = {
            consent1: consent1 ? (consent1.checked ? "Consented" : "Not Consented") : "Not available",
            consent2: consent2 ? (consent2.checked ? "Consented" : "Not Consented") : "Not available",
            consent3: consent3 ? (consent3.checked ? "Consented" : "Not Consented") : "Not available"
        };

        localStorage.setItem('consentData', JSON.stringify(consentData));
    }

    // Save Basic Info Data
    function saveBasicInfoData() {
        const experienceElement = document.querySelector('input[name="experience"]');
        const locationElement = document.querySelector('input[name="location"]');
        const roleElement = document.querySelector('input[name="role"]');
        const specialtyElement = document.querySelector('input[name="specialty"]');
        const experienceYearsElement = document.querySelector('input[name="experience_years"]');

        if (!experienceElement || !locationElement || !roleElement || !specialtyElement || !experienceYearsElement) {
            console.error('Error: Some fields in Basic Info are missing.');
            alert('Please complete all the required fields.');
            return;
        }

        const basicInfoData = {
            experience: experienceElement.value,
            location: locationElement.value,
            role: roleElement.value,
            specialty: specialtyElement.value,
            experience_years: experienceYearsElement.value
        };

        localStorage.setItem('basicInfoData', JSON.stringify(basicInfoData));
    }

    // Save Part 1 Data (Thresholds)
    function savePart1Data() {
        const part1Data = {
            thresholds: []
        };

        vitalSignsData.forEach(vitalSign => {
            const values = document.querySelectorAll(`input[name="${vitalSign.name}-threshold"]`);
            const thresholdValues = Array.from(values).map(input => input.value);

            part1Data.thresholds.push({
                'Vital Sign': vitalSign.name,
                'Unit': vitalSign.unit,
                'Values': thresholdValues.join(', ') // Join multiple thresholds if needed
            });
        });

        localStorage.setItem('part1Data', JSON.stringify(part1Data));
    }

    // Save Part 2 Data (Ratings)
    function savePart2Data() {
        const part2Data = [];

        // Assume there are sliders for rating various combinations of vitals
        const combinations = document.querySelectorAll('.combination-rating');
        combinations.forEach(combo => {
            const combinationName = combo.getAttribute('data-combination');
            const ratingValue = combo.querySelector('input[type="range"]').value;

            part2Data.push({
                'Combination': combinationName,
                'Rating': ratingValue
            });
        });

        localStorage.setItem('part2Data', JSON.stringify(part2Data));
    }

    // Download CSV
    function downloadCSV() {
        let csvContent = 'data:text/csv;charset=utf-8,';

        // Retrieve data from localStorage
        const consentData = JSON.parse(localStorage.getItem('consentData')) || {};
        const basicInfoData = JSON.parse(localStorage.getItem('basicInfoData')) || {};
        const part1Data = JSON.parse(localStorage.getItem('part1Data')) || {};
        const part2Data = JSON.parse(localStorage.getItem('part2Data')) || [];
        const part3Data = JSON.parse(localStorage.getItem('part3Data')) || [];

        // Consent Data
        csvContent += 'Consent Form\n';
        csvContent += 'Consent 1,Consent 2,Consent 3\n';
        csvContent += `${consentData.consent1 || 'Not Consented'},${consentData.consent2 || 'Not Consented'},${consentData.consent3 || 'Not Consented'}\n`;

        // Basic Info Data
        csvContent += '\nBasic Information\n';
        csvContent += 'Experience,Location,Role,Specialty,Years of Experience\n';
        csvContent += `${basicInfoData.experience || 'No selection'},${basicInfoData.location || 'No selection'},${basicInfoData.role || 'No selection'},${basicInfoData.specialty || 'No selection'},${basicInfoData.experience_years || 'No selection'}\n`;

        // Part 1 Data (if applicable)
        if (part1Data.thresholds && part1Data.thresholds.length > 0) {
            csvContent += '\nPart 1 Thresholds\n';
            csvContent += 'Vital Sign,Unit,Thresholds\n';
            part1Data.thresholds.forEach(row => {
                csvContent += `${row['Vital Sign']},${row['Unit']},${row['Values']}\n`;
            });
        }

        // Part 2 Data (if applicable)
        if (part2Data.length > 0) {
            csvContent += '\nPart 2 Ratings\n';
            csvContent += 'Combination,Rating\n';
            part2Data.forEach(row => {
                csvContent += `${row['Combination']},${row['Rating']}\n`;
            });
        }

        // Part 3 Data (if applicable)
        if (part3Data.length > 0) {
            csvContent += '\nPart 3 Responses\n';
            part3Data.forEach(response => {
                csvContent += `Vital Sign: ${response['Vital Sign']}\n`;
                Object.keys(response['Questions']).forEach(question => {
                    csvContent += `${question},${response['Questions'][question]}\n`;
                });
                csvContent += '\n';
            });
        }

        // Generate and trigger the CSV download
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', 'vital_signs_complete_data.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // Event listener for the submit button
    const submitButton = document.getElementById('submitButton');
    if (submitButton) {
        submitButton.addEventListener('click', () => {
            // Collect all data and then download the CSV
            saveConsentData();
            saveBasicInfoData();
            savePart1Data();
            savePart2Data();
            collectData(); // Part 3 data
            downloadCSV();
            alert('Your responses have been saved. Thank you for completing the survey.');

            // Redirect after submission
            window.location.href = 'index.html';
        });
    }
});
