document.addEventListener('DOMContentLoaded', () => {
    const vitalSignsData = [
        { name: "Heart Rate", unit: "beats/min" },
        { name: "Systolic Blood Pressure", unit: "mmHg" },
        { name: "Respiratory Rate", unit: "breaths/min" },
        { name: "Temperature", unit: "℃" },
        { name: "Oxygen Saturation", unit: "%" },
        { name: "Inspired Oxygen", unit: "L/min" }
    ];

    const part3Questions = [
        "What is normal for that individual patient.",
        "Whether the general trend is worsening or improving",
        "Abnormal values that have occurred within the past 24 hours"
    ];

    const part3Container = document.getElementById('part3Container');

    vitalSignsData.forEach(vitalSign => {
        const questionSet = document.createElement('div');
        questionSet.className = 'question-set';

        const title = document.createElement('h3');
        title.textContent = `When interpreting ${vitalSign.name}, how important is it to take account of:`;
        questionSet.appendChild(title);

        const subheading = document.createElement('h4');
        subheading.innerHTML = '0 = Not at all important<br>5 = Moderately important<br>10 = Extremely important';
        questionSet.appendChild(subheading);

        part3Questions.forEach(questionText => {
            const question = document.createElement('div');
            question.className = 'question';

            const label = document.createElement('label');
            label.textContent = questionText;
            label.setAttribute('for', `${vitalSign.name}-${questionText}`);
            question.appendChild(label);

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

            sliderInput.addEventListener('input', () => {
                sliderValueDisplay.textContent = sliderInput.value;
            });

            question.appendChild(sliderContainer);
            questionSet.appendChild(question);
        });

        part3Container.appendChild(questionSet);
    });

    // Save data to Firestore
    function saveDataToFirestore() {
        // Collect Consent Data
        const consentData = {
            consent1: document.querySelector('input[name="consent1"]')?.checked ? 'Consented' : 'Not Consented',
            consent2: document.querySelector('input[name="consent2"]')?.checked ? 'Consented' : 'Not Consented',
            consent3: document.querySelector('input[name="consent3"]')?.checked ? 'Consented' : 'Not Consented'
        };

        // Collect Basic Info Data
        const basicInfoData = {
            experience: document.querySelector('input[name="experience"]')?.value || 'Not provided',
            location: document.querySelector('input[name="location"]')?.value || 'Not provided',
            role: document.querySelector('input[name="role"]')?.value || 'Not provided',
            specialty: document.querySelector('input[name="specialty"]')?.value || 'Not provided',
            experience_years: document.querySelector('input[name="experience_years"]')?.value || 'Not provided'
        };

        // Collect Part 1 Data (Thresholds)
        const part1Data = {
            thresholds: vitalSignsData.map(vitalSign => {
                const values = document.querySelectorAll(`input[name="${vitalSign.name}-threshold"]`);
                return {
                    'Vital Sign': vitalSign.name,
                    'Unit': vitalSign.unit,
                    'Values': values.length > 0 ? Array.from(values).map(input => input.value).join(', ') : 'Not provided'
                };
            })
        };

        // Collect Part 2 Data (Ratings)
        const part2Data = [];
        const combinations = document.querySelectorAll('.combination-rating');
        combinations.forEach(combo => {
            const ratingValue = combo.querySelector('input[type="range"]')?.value || 'Not provided';
            part2Data.push({
                'Combination': combo.getAttribute('data-combination') || 'Not provided',
                'Rating': ratingValue
            });
        });

        // Collect Part 3 Data (Further Interpretation)
        const part3Data = vitalSignsData.map(vitalSign => {
            const response = {
                'Vital Sign': vitalSign.name,
                'Questions': {}
            };
            part3Questions.forEach(question => {
                const sliderInput = document.querySelector(`input[name="${vitalSign.name}-${question}"]`);
                response['Questions'][question] = sliderInput ? sliderInput.value : 'No response';
            });
            return response;
        });

        // Combine all data into one object
        const allData = {
            consentData,
            basicInfoData,
            part1Data,
            part2Data,
            part3Data,
            timestamp: new Date() // Add timestamp
        };

        console.log(allData);

        // Save to Firestore
        db.collection('vital_signs_survey').add(allData)
            .then(docRef => {
                console.log('Document written with ID: ', docRef.id);
                alert('Your responses have been saved. Thank you for completing the survey.');
                window.location.href = 'index.html'; // Redirect after submission
            })
            .catch(error => {
                console.error('Error adding document: ', error);
                alert('There was an error saving your data. Please try again.');
            });
    }

    // Event listener for the submit button
    const submitButton = document.getElementById('submitButton');
    if (submitButton) {
        submitButton.addEventListener('click', (event) => {
            event.preventDefault();
            saveDataToFirestore(); // Save all data to Firestore on submit
        });
    }
});