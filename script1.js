// script1.js

// Vital Signs Data
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
    container.appendChild(scaleContainer);

    const track = document.createElement('div');
    track.className = 'track';
    scaleContainer.appendChild(track);

    const ranges = [];
    const thumbs = [];
    const thumbLabels = [];

    const levels = getConcernLevels(vitalSign);

    let thresholds = [];
    let numArrows = getNumArrows(vitalSign);
    const min = vitalSign.min;
    const max = vitalSign.max;

    // Initialize thresholds at random positions
    thresholds.push({ value: min, levelIndex: 0, lastAdjusted: false }); // thresholds[0] - fixed
    const positions = getInitialPositions(numArrows, min, max, vitalSign.step);
    positions.forEach((pos, idx) => thresholds.push({ value: pos, levelIndex: idx + 1, lastAdjusted: false }));
    thresholds.push({ value: max, levelIndex: levels.length - 1, lastAdjusted: false }); // Last threshold - fixed

    // Add tick marks and labels
    const tickMarksContainer = document.createElement('div');
    tickMarksContainer.className = 'tick-marks';
    scaleContainer.appendChild(tickMarksContainer);

    const labelsContainer = document.createElement('div');
    labelsContainer.className = 'labels';
    scaleContainer.appendChild(labelsContainer);

    // Function to add tick marks and labels
    function addTickMarksAndLabels() {
        tickMarksContainer.innerHTML = '';
        labelsContainer.innerHTML = '';

        const totalTicks = 100; // Total number of minor ticks
        for (let i = 0; i <= totalTicks; i++) {
            const percent = (i / totalTicks) * 100;
            const value = min + (percent / 100) * (max - min);

            const tick = document.createElement('div');
            tick.className = 'tick minor';
            tick.style.left = `${percent}%`;
            tick.dataset.value = value;
            tickMarksContainer.appendChild(tick);
        }

        // Add major ticks and labels
        let currentValue = min;
        while (currentValue <= max) {
            const percent = ((currentValue - min) / (max - min)) * 100;

            const tick = document.createElement('div');
            tick.className = 'tick major';
            tick.style.left = `${percent}%`;
            tick.dataset.value = currentValue;
            tickMarksContainer.appendChild(tick);

            const label = document.createElement('span');
            label.textContent = formatValueForLabel(currentValue, vitalSign);
            label.style.left = `${percent}%`;
            labelsContainer.appendChild(label);

            currentValue += vitalSign.majorTick;
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
                scaleContainer.appendChild(thumb);
                thumbs.push(thumb);

                // Create label for thumb
                const thumbLabel = document.createElement('div');
                thumbLabel.className = `thumb-label ${level.thumbLabelClass}`;
                thumbLabel.textContent = formatValue(threshold.value, vitalSign);
                scaleContainer.appendChild(thumbLabel);
                thumbLabels.push(thumbLabel);

                // Event listeners for thumb
                let isDragging = false;
                thumb.addEventListener('mousedown', e => {
                    isDragging = true;
                    currentThumb = thumb;
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
                    value = Math.max(min, Math.min(value, max));

                    thresholds[currentThumbIndex].value = value;

                    // Enforce boundaries
                    enforceBoundaries(currentThumbIndex, value);

                    // Set lastAdjusted
                    thresholds.forEach((t, idx) => {
                        t.lastAdjusted = (idx === currentThumbIndex);
                    });

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
            scaleContainer.appendChild(range);
            ranges.push(range);
        }
    }

    function enforceBoundaries(index, value) {
        const threshold = thresholds[index];

        // Ensure thresholds stay within min and max
        if (value < min) {
            threshold.value = min;
        } else if (value > max) {
            threshold.value = max;
        } else {
            threshold.value = value;
        }

        // Prevent thresholds from crossing over
        if (index > 0) {
            if (thresholds[index - 1].value > threshold.value) {
                thresholds[index - 1].value = threshold.value;
                enforceBoundaries(index - 1, thresholds[index - 1].value);
            }
        }

        if (index < thresholds.length - 1) {
            if (thresholds[index + 1].value < threshold.value) {
                thresholds[index + 1].value = threshold.value;
                enforceBoundaries(index + 1, thresholds[index + 1].value);
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

                // Update thumb label position and value
                const thumbLabel = thumbLabels[index - 1];
                thumbLabel.style.left = `${percent}%`;
                thumbLabel.textContent = formatValue(threshold.value, vitalSign);
                thumbLabel.style.display = 'block';
            }
        });

        // Build merged ranges
        const mergedRanges = [];
        let i = 0;
        while (i < thresholds.length - 1) {
            let startThreshold = thresholds[i];
            let endIndex = i + 1;

            // Merge ranges where thresholds have the same value
            while (endIndex < thresholds.length && thresholds[endIndex].value === thresholds[i].value) {
                endIndex++;
            }

            // Determine concern level
            let levelIndex = thresholds[i].levelIndex;
            if (endIndex - i > 1) {
                for (let j = i; j < endIndex; j++) {
                    if (thresholds[j].lastAdjusted) {
                        levelIndex = thresholds[j].levelIndex;
                        break;
                    }
                }
            }

            // Create range
            let startValue = thresholds[i].value;
            let endValue = thresholds[endIndex] ? thresholds[endIndex].value : thresholds[thresholds.length - 1].value;
            let startPercent = ((startValue - min) / (max - min)) * 100;
            let endPercent = ((endValue - min) / (max - min)) * 100;
            let width = endPercent - startPercent;

            mergedRanges.push({
                left: startPercent,
                width: width,
                levelIndex: levelIndex
            });

            i = endIndex;
        }

        // Update ranges
        ranges.forEach(range => range.remove());
        ranges.length = 0;

        mergedRanges.forEach(rangeData => {
            const range = document.createElement('div');
            range.className = 'range';
            range.style.left = `${rangeData.left}%`;
            range.style.width = `${rangeData.width}%`;
            range.style.backgroundColor = levels[rangeData.levelIndex].color;
            range.style.zIndex = 1;
            scaleContainer.appendChild(range);
            ranges.push(range);
        });

        // Update tick marks colors
        updateTickMarksColor();

        // Update the table
        updateThresholdTable(mergedRanges);
    }

    function updateTickMarksColor() {
        const tickElements = tickMarksContainer.querySelectorAll('.tick');
        tickElements.forEach(tick => {
            const value = parseFloat(tick.dataset.value);
            const color = getTickColor(value, thresholds, levels);
            tick.style.backgroundColor = color;
        });
    }

    function updateThresholdTable(mergedRanges) {
        // Clear existing table rows
        tableBody.innerHTML = '';

        // For each merged range, create a table row
        mergedRanges.forEach(rangeData => {
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
        if (vitalSign.unit === '℃') {
            return value.toFixed(1);
        } else if (vitalSign.unit === 'L/min') {
            return value.toFixed(1);
        } else {
            return Math.round(value);
        }
    }

    function formatValueForLabel(value, vitalSign) {
        return formatValue(value, vitalSign);
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
        for (let i = 0; i < thresholds.length - 1; i++) {
            const lowerLimit = thresholds[i].value;
            const upperLimit = thresholds[i + 1].value;
            if (value >= lowerLimit && value <= upperLimit) {
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

    // Function to initialize arrows at random positions within the range
    function getInitialPositions(numArrows, min, max, step) {
        const positions = [];
        for (let i = 0; i < numArrows; i++) {
            const randomValue = min + Math.random() * (max - min);
            const snappedValue = Math.max(min, Math.min(Math.round(randomValue / step) * step, max));
            positions.push(snappedValue);
        }
        // Sort positions to prevent overlapping thresholds
        return positions.sort((a, b) => a - b);
    }

    vitalSign.getValues = function() {
        if (thresholds.length > 2) {
            return thresholds.slice(1, -1).map(t => formatValue(t.value, vitalSign));
        } else {
            return [];
        }
    };

    // NEW: Save thresholds to vitalSign object for later retrieval
    vitalSign.thresholds = thresholds;

    // NEW: Function to load saved data
    function loadSavedData() {
        const savedData = JSON.parse(localStorage.getItem('part1Data'));
        if (savedData && savedData.thresholds) {
            const vitalSignData = savedData.thresholds.find(v => v['Vital Sign'] === vitalSign.name);
            if (vitalSignData && vitalSignData.Values) {
                const savedValues = vitalSignData.Values.split(';').map(v => parseFloat(v));
                // Reconstruct thresholds based on saved values
                thresholds = [{ value: min, levelIndex: 0, lastAdjusted: false }];

                savedValues.forEach((val, idx) => {
                    thresholds.push({ value: val, levelIndex: idx + 1, lastAdjusted: false });
                });

                thresholds.push({ value: max, levelIndex: levels.length - 1, lastAdjusted: false });

                createThumbs();
                updatePositions();
            }
        }
    }

    loadSavedData();

    return container;
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

    // Store data in localStorage
    localStorage.setItem('part1Data', JSON.stringify(data));

    return data;
}

const vitalSignsContainer = document.getElementById('vitalSignsContainer');

vitalSignsData.forEach(vitalSign => {
    const vitalSignElement = createVitalSignElement(vitalSign);
    vitalSignsContainer.appendChild(vitalSignElement);
});

const submitButton = document.getElementById('submitButton');
submitButton.addEventListener('click', () => {
    const data = collectData();
    // downloadCSV(data); // Optional: Remove or keep based on preference
    alert('Your responses have been saved. Please proceed to Part 2.');
    window.location.href = 'part2.html';
});