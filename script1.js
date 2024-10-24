// script1.js

// Vital Signs Data
const vitalSignsData = [
    {
        name: "Heart Rate",
        unit: "beats/min",
        min: 20,
        max: 200,
        step: 1,
        majorTick: 10,
        hasBothDirections: true
    },
    {
        name: "Systolic Blood Pressure",
        unit: "mmHg",
        min: 40,
        max: 250,
        step: 1,
        majorTick: 10,
        hasBothDirections: true
    },
    {
        name: "Respiratory Rate",
        unit: "breaths/min",
        min: 1,
        max: 60,
        step: 1,
        majorTick: 5,
        hasBothDirections: true
    },
    {
        name: "Temperature",
        unit: "℃",
        min: 32.0,
        max: 42.0,
        step: 0.1,
        majorTick: 1,
        hasBothDirections: true
    },
    {
        name: "Oxygen Saturation",
        unit: "%",
        min: 50,
        max: 100,
        step: 1,
        majorTick: 5,
        hasBothDirections: false,
        reverseScale: true
    },
    {
        name: "Inspired Oxygen ",
        unit: "L/min",
        min: 0,
        max: 15,
        step: 1,
        majorTick: 5,
        hasBothDirections: false,
        reverseScale: true
    },
    {
        name: "Inspired Oxygen",
        unit: "%",
        min: 20,
        max: 100,
        step: 1,
        majorTick: 5,
        hasBothDirections: false,
        reverseScale: true
    }
];

// Function to create vital sign elements
function createVitalSignElement(vitalSign) {
    const container = document.createElement('div');
    container.className = 'vital-sign';

    const title = document.createElement('h3');
    title.textContent = `${vitalSign.name} (${vitalSign.unit})`;
    container.appendChild(title);

    const scaleContainer = document.createElement('div');
    scaleContainer.className = 'scale-container';
    scaleContainer.style.position = 'relative';
    container.appendChild(scaleContainer);

    const track = document.createElement('div');
    track.className = 'track';
    track.style.position = 'relative';
    scaleContainer.appendChild(track);

    const ranges = [];
    const thumbs = [];
    const thumbLabels = [];

    const levels = getConcernLevels(vitalSign);

    let thresholds = [];
    let numArrows = getNumArrows(vitalSign);
    const min = vitalSign.min;
    const max = vitalSign.max;

    // Initialize thresholds at positions evenly distributed
    thresholds.push({ value: min, levelIndex: 0 }); // thresholds[0] - fixed
    const positions = getInitialPositions(numArrows, min, max, vitalSign.step);
    positions.forEach((pos, idx) => thresholds.push({ value: pos, levelIndex: idx + 1 }));
    thresholds.push({ value: max, levelIndex: levels.length - 1 }); // Last threshold - fixed

    // Add tick marks and labels
    const tickMarksContainer = document.createElement('div');
    tickMarksContainer.className = 'tick-marks';
    tickMarksContainer.style.position = 'relative';
    scaleContainer.appendChild(tickMarksContainer);

    const labelsContainer = document.createElement('div');
    labelsContainer.className = 'labels';
    labelsContainer.style.position = 'relative';
    scaleContainer.appendChild(labelsContainer);

    // Function to add tick marks and labels
    function addTickMarksAndLabels() {
        tickMarksContainer.innerHTML = '';
        labelsContainer.innerHTML = '';

        const range = max - min;
        const step = vitalSign.step;
        const majorTick = vitalSign.majorTick;
        const minorTickInterval = step;
        const majorTickInterval = majorTick;

        const totalMinorTicks = Math.round(range / minorTickInterval);
        const totalMajorTicks = Math.round(range / majorTickInterval);

        // Add minor ticks
        for (let i = 0; i <= totalMinorTicks; i++) {
            const value = min + i * minorTickInterval;
            const percent = ((value - min) / range) * 100;

            const tick = document.createElement('div');
            tick.className = 'tick minor';
            tick.style.left = `${percent}%`;
            tick.style.transform = 'translateX(-50%)';
            tick.style.position = 'absolute';
            tick.dataset.value = value;
            tickMarksContainer.appendChild(tick);
        }

        // Add major ticks and labels
        for (let i = 0; i <= totalMajorTicks; i++) {
            const value = min + i * majorTickInterval;
            const percent = ((value - min) / range) * 100;

            const tick = document.createElement('div');
            tick.className = 'tick major';
            tick.style.left = `${percent}%`;
            tick.style.transform = 'translateX(-50%)';
            tick.style.position = 'absolute';
            tick.dataset.value = value;
            tickMarksContainer.appendChild(tick);

            const label = document.createElement('span');
            label.className = 'label';
            label.textContent = formatValueForLabel(value, vitalSign);
            label.style.left = `${percent}%`;
            label.style.transform = 'translateX(-50%)';
            label.style.position = 'absolute';
            labelsContainer.appendChild(label);
        }
    }

    addTickMarksAndLabels();

    const concernLevelsContainer = document.createElement('div');
    concernLevelsContainer.className = 'concern-levels';
    levels.forEach(level => {
        const levelDiv = document.createElement('div');
        levelDiv.className = `concern-level ${level.class}`;
        levelDiv.textContent = level.label;
        concernLevelsContainer.appendChild(levelDiv);
    });
    container.appendChild(concernLevelsContainer);

    // Create table to display ranges
    const thresholdTable = document.createElement('table');
    thresholdTable.className = 'threshold-table';

    const tableHeader = document.createElement('thead');
    const headerRow = document.createElement('tr');

    const levelHeader = document.createElement('th');
    levelHeader.textContent = 'Concern Level';

    const lowerHeader = document.createElement('th');
    lowerHeader.textContent = 'Lower Limit';

    const upperHeader = document.createElement('th');
    upperHeader.textContent = 'Upper Limit';

    headerRow.appendChild(levelHeader);
    headerRow.appendChild(lowerHeader);
    headerRow.appendChild(upperHeader);
    tableHeader.appendChild(headerRow);
    thresholdTable.appendChild(tableHeader);

    const tableBody = document.createElement('tbody');
    thresholdTable.appendChild(tableBody);

    container.appendChild(thresholdTable);

    function createThumbs() {
        // Clear existing thumbs and ranges
        thumbs.forEach(thumb => thumb.remove());
        thumbLabels.forEach(label => label.remove());
        ranges.forEach(range => range.remove());
        thumbs.length = 0;
        thumbLabels.length = 0;
        ranges.length = 0;

        // Recreate thumbs and labels
        thresholds.forEach((threshold, index) => {
            if (index > 0 && index < thresholds.length - 1) {
                const level = getArrowLevel(index, vitalSign);
                const thumb = document.createElement('div');
                thumb.className = `thumb ${level.thumbClass}`;
                thumb.dataset.index = index;
                thumb.style.position = 'absolute';
                scaleContainer.appendChild(thumb);
                thumbs.push(thumb);

                // Create label for thumb
                const thumbLabel = document.createElement('div');
                thumbLabel.className = `thumb-label ${level.thumbLabelClass}`;
                thumbLabel.textContent = formatValue(threshold.value, vitalSign);
                thumbLabel.style.position = 'absolute';
                scaleContainer.appendChild(thumbLabel);
                thumbLabels.push(thumbLabel);

                // Event listeners for thumb
                let isDragging = false;
                let currentThumbIndex;

                thumb.addEventListener('mousedown', e => {
                    isDragging = true;
                    currentThumbIndex = parseInt(thumb.dataset.index);
                    document.addEventListener('mousemove', onMouseMove);
                    document.addEventListener('mouseup', onMouseUp);
                    e.preventDefault();
                });

                function onMouseMove(e) {
                    if (!isDragging) return;
                    const rect = track.getBoundingClientRect();
                    let offsetX = e.clientX - rect.left;
                    offsetX = Math.max(0, Math.min(offsetX, rect.width));
                    const percent = offsetX / rect.width;
                    let value = min + percent * (max - min);

                    // Snap to nearest step
                    value = Math.round(value / vitalSign.step) * vitalSign.step;

                    // Enforce min and max
                    value = Math.max(min, Math.min(value, max));

                    // Move current thumb
                    thresholds[currentThumbIndex].value = value;

                    // Enforce boundaries and push adjacent thumbs
                    enforceBoundaries(currentThumbIndex);

                    updatePositions();
                }

                function onMouseUp() {
                    isDragging = false;
                    document.removeEventListener('mousemove', onMouseMove);
                    document.removeEventListener('mouseup', onMouseUp);
                }
            }
        });

        // Create ranges between thresholds
        for (let i = 0; i < thresholds.length - 1; i++) {
            const range = document.createElement('div');
            range.className = 'range';
            range.style.position = 'absolute';
            scaleContainer.appendChild(range);
            ranges.push(range);
        }

        updatePositions();
    }

    function enforceBoundaries(index) {
        const threshold = thresholds[index];

        // Ensure thresholds stay within min and max
        threshold.value = Math.max(min, Math.min(threshold.value, max));

        // Push adjacent thumbs if overlapping
        if (index > 0) {
            if (thresholds[index - 1].value >= threshold.value) {
                thresholds[index - 1].value = threshold.value - vitalSign.step;
                enforceBoundaries(index - 1);
            }
        }

        if (index < thresholds.length - 1) {
            if (thresholds[index + 1].value <= threshold.value) {
                thresholds[index + 1].value = threshold.value + vitalSign.step;
                enforceBoundaries(index + 1);
            }
        }
    }

    function updatePositions() {
        // Update thumbs and labels
        thresholds.forEach((threshold, index) => {
            if (index > 0 && index < thresholds.length - 1) {
                const percent = ((threshold.value - min) / (max - min)) * 100;
                const thumb = thumbs[index - 1];
                thumb.style.left = `${percent}%`;
                thumb.style.transform = 'translateX(-50%)';

                // Update thumb label position and value
                const thumbLabel = thumbLabels[index - 1];
                thumbLabel.style.left = `${percent}%`;
                thumbLabel.style.transform = 'translateX(-50%)';
                thumbLabel.textContent = formatValue(threshold.value, vitalSign);
                thumbLabel.style.display = 'block';
            }
        });

        // Build ranges
        const rangesData = [];
        for (let i = 0; i < thresholds.length - 1; i++) {
            const startValue = thresholds[i].value;
            const endValue = thresholds[i + 1].value;

            let startPercent = ((startValue - min) / (max - min)) * 100;
            let endPercent = ((endValue - min) / (max - min)) * 100;
            let width = endPercent - startPercent;

            rangesData.push({
                left: startPercent,
                width: width,
                levelIndex: thresholds[i].levelIndex
            });
        }

        // Update ranges
        ranges.forEach(range => range.remove());
        ranges.length = 0;

        rangesData.forEach(rangeData => {
            const range = document.createElement('div');
            range.className = 'range';
            range.style.left = `${rangeData.left}%`;
            range.style.width = `${rangeData.width}%`;
            range.style.backgroundColor = levels[rangeData.levelIndex].color;
            range.style.position = 'absolute';
            scaleContainer.appendChild(range);
            ranges.push(range);
        });

        // Update tick marks colors
        updateTickMarksColor();

        // Update the table
        updateThresholdTable(rangesData);
    }

    function updateTickMarksColor() {
        const tickElements = tickMarksContainer.querySelectorAll('.tick');
        tickElements.forEach(tick => {
            const value = parseFloat(tick.dataset.value);
            const color = getTickColor(value, thresholds, levels);
            tick.style.backgroundColor = color;
        });
    }

    function updateThresholdTable(rangesData) {
        // Clear existing table rows
        tableBody.innerHTML = '';

        // For each range, create a table row
        rangesData.forEach(rangeData => {
            const row = document.createElement('tr');
            const levelCell = document.createElement('td');
            levelCell.textContent = levels[rangeData.levelIndex].label;

            const lowerLimit = formatValue(min + (rangeData.left / 100) * (max - min), vitalSign);
            const upperLimit = formatValue(min + ((rangeData.left + rangeData.width) / 100) * (max - min), vitalSign);

            const lowerCell = document.createElement('td');
            lowerCell.textContent = lowerLimit;

            const upperCell = document.createElement('td');
            upperCell.textContent = upperLimit;

            row.appendChild(levelCell);
            row.appendChild(lowerCell);
            row.appendChild(upperCell);
            tableBody.appendChild(row);
        });
    }

    function formatValue(value, vitalSign) {
        const decimals = getMaxDecimalDigits(vitalSign.step);
        return value.toFixed(decimals);
    }

    function formatValueForLabel(value, vitalSign) {
        return formatValue(value, vitalSign);
    }

    function getMaxDecimalDigits(step) {
        const stepString = step.toString();
        if (stepString.includes('.')) {
            return stepString.split('.')[1].length;
        } else {
            return 0;
        }
    }

    function getConcernLevels(vitalSign) {
        if (vitalSign.name === "Oxygen Saturation") {
            return [
                { label: 'Low - severe concern', class: 'severe-concern', color: '#e74c3c' },
                { label: 'Low - moderate concern', class: 'moderate-concern', color: '#e67e22' },
                { label: 'Low - mild concern', class: 'mild-concern', color: '#f1c40f' },
                { label: 'No concern', class: 'no-concern', color: '#2ecc71' }
            ];
        } else {
            return [
                { label: 'Low - severe concern', class: 'severe-concern', color: '#e74c3c' },
                { label: 'Low - moderate concern', class: 'moderate-concern', color: '#e67e22' },
                { label: 'Low - mild concern', class: 'mild-concern', color: '#f1c40f' },
                { label: 'No concern', class: 'no-concern', color: '#2ecc71' },
                { label: 'High - mild concern', class: 'mild-concern', color: '#f1c40f' },
                { label: 'High - moderate concern', class: 'moderate-concern', color: '#e67e22' },
                { label: 'High - severe concern', class: 'severe-concern', color: '#e74c3c' }
            ];
        }
    }

    function getTickColor(value, thresholds, levels) {
        for (let i = thresholds.length - 1; i >= 0; i--) {
            if (value >= thresholds[i].value) {
                return levels[thresholds[i].levelIndex].color;
            }
        }
        return '#999';
    }

    function getArrowLevel(index, vitalSign) {
        if (vitalSign.name === "Oxygen Saturation") {
            switch (index) {
                case 1:
                    return { thumbClass: 'thumb-severe', thumbLabelClass: 'thumb-label-severe' };
                case 2:
                    return { thumbClass: 'thumb-moderate', thumbLabelClass: 'thumb-label-moderate' };
                case 3:
                    return { thumbClass: 'thumb-mild', thumbLabelClass: 'thumb-label-mild' };
                default:
                    return { thumbClass: '', thumbLabelClass: '' };
            }
        } else {
            switch (index) {
                case 1:
                    return { thumbClass: 'thumb-severe', thumbLabelClass: 'thumb-label-severe' };
                case 2:
                    return { thumbClass: 'thumb-moderate', thumbLabelClass: 'thumb-label-moderate' };
                case 3:
                    return { thumbClass: 'thumb-mild', thumbLabelClass: 'thumb-label-mild' };
                case 4:
                    return { thumbClass: 'thumb-mild', thumbLabelClass: 'thumb-label-mild' };
                case 5:
                    return { thumbClass: 'thumb-moderate', thumbLabelClass: 'thumb-label-moderate' };
                case 6:
                    return { thumbClass: 'thumb-severe', thumbLabelClass: 'thumb-label-severe' };
                default:
                    return { thumbClass: '', thumbLabelClass: '' };
            }
        }
    }

    function getNumArrows(vitalSign) {
        if (vitalSign.name === "Oxygen Saturation") {
            return 3; // thresholds[1] to thresholds[3]
        } else {
            return 6; // thresholds[1] to thresholds[6]
        }
    }

    // Function to initialize arrows at positions evenly distributed within the range
    function getInitialPositions(numArrows, min, max, step) {
        const positions = [];
        const interval = (max - min) / (numArrows + 1);
        for (let i = 1; i <= numArrows; i++) {
            const position = min + i * interval;
            // Snap to nearest step
            const snappedPosition = Math.round(position / step) * step;
            positions.push(snappedPosition);
        }
        // Ensure positions are within bounds and sorted
        return positions.map(pos => Math.max(min, Math.min(pos, max))).sort((a, b) => a - b);
    }

    vitalSign.getValues = function() {
        if (thresholds.length > 2) {
            return thresholds.slice(1, -1).map(t => formatValue(t.value, vitalSign));
        } else {
            return [];
        }
    };

    // Save thresholds to vitalSign object for later retrieval
    vitalSign.thresholds = thresholds;

    // Function to load saved data
    function loadSavedData() {
        const savedData = JSON.parse(localStorage.getItem('part1Data'));
        if (savedData && savedData.thresholds) {
            const vitalSignData = savedData.thresholds.find(v => v['Vital Sign'] === vitalSign.name);
            if (vitalSignData && vitalSignData.Values) {
                const savedValues = vitalSignData.Values.split(';').map(v => parseFloat(v));
                // Reconstruct thresholds based on saved values
                thresholds = [{ value: min, levelIndex: 0 }];

                savedValues.forEach((val, idx) => {
                    thresholds.push({ value: val, levelIndex: idx + 1 });
                });

                thresholds.push({ value: max, levelIndex: levels.length - 1 });

                createThumbs();
                updatePositions();
            } else {
                createThumbs();
            }
        } else {
            createThumbs();
        }
    }

    loadSavedData();

    return container;
}

const vitalSignsContainer = document.getElementById('vitalSignsContainer');

vitalSignsData.forEach(vitalSign => {
    const vitalSignElement = createVitalSignElement(vitalSign);
    vitalSignsContainer.appendChild(vitalSignElement);
});

const submitButton = document.getElementById('submitButton');

if (submitButton) {
    submitButton.addEventListener('click', () => {
        // Collect data and store it in localStorage
        collectData();
        alert('Your responses have been saved. Please proceed to Part 2.');
        // Navigate to the next page
        window.location.href = 'part2.html';
    });
} else {
    console.error('Submit button not found!');
}

function collectData() {
    const data = {};
    data.thresholds = [];

    vitalSignsData.forEach(vitalSign => {
        const values = vitalSign.getValues();
        data.thresholds.push({
            'Vital Sign': vitalSign.name,
            'Unit': vitalSign.unit,
            'Values': values.join(';')
        });
    });

    // Save data to localStorage
    localStorage.setItem('part1Data', JSON.stringify(data));

    console.log('Data collected and saved to localStorage:', data);

    return data;
}
