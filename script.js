// Function to plot Gaussian membership functions on a canvas
function plotGaussianMembershipFunction(lowMin, lowMax, normalMin, normalMax, high1Min, high1Max, high2Min, high2Max) {
    const canvas = document.getElementById('membershipCanvas');
    const ctx = canvas.getContext('2d');
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    // Adjust canvas size
    canvas.width = width;
    canvas.height = height;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Normalize the x-axis scale based on the maximum heart rate input
    const maxHeartRate = Math.max(lowMax, normalMax, high1Max, high2Max) * 1.1; // Add 10% padding
    const scaleX = width / maxHeartRate;
    const scaleY = height * 0.8; // Leave some space at the top and bottom

    // Function to calculate Gaussian membership value
    function gaussianMembership(x, center, width) {
        return Math.exp(-Math.pow(x - center, 2) / (2 * Math.pow(width, 2)));
    }

    // Function to draw Gaussian membership sets
    function drawGaussianSet(min, max, color, label) {
        const center = (min + max) / 2;
        const width = (max - min) / 4; // Adjust this value to change the curve's steepness

        ctx.beginPath();
        for (let x = 0; x <= maxHeartRate; x += 0.5) {
            const y = gaussianMembership(x, center, width);
            const canvasX = x * scaleX;
            const canvasY = scaleY - y * scaleY;
            if (x === 0) {
                ctx.moveTo(canvasX, canvasY);
            } else {
                ctx.lineTo(canvasX, canvasY);
            }
        }

        // Stroke the path
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Fill with semi-transparent color
        ctx.globalAlpha = 0.2;
        ctx.lineTo(width, scaleY);
        ctx.lineTo(0, scaleY);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.globalAlpha = 1.0;

        // Add label
        ctx.fillStyle = color;
        ctx.font = '14px Arial';
        const labelX = center * scaleX;
        const labelY = scaleY + 20;
        ctx.fillText(label, labelX, labelY);
    }

    // Draw Gaussian membership sets
    drawGaussianSet(lowMin, lowMax, 'blue', 'Low');
    drawGaussianSet(normalMin, normalMax, 'green', 'Normal');
    drawGaussianSet(high1Min, high1Max, 'orange', 'High 1');
    drawGaussianSet(high2Min, high2Max, 'red', 'High 2');

    // Draw x-axis
    ctx.beginPath();
    ctx.moveTo(0, scaleY);
    ctx.lineTo(width, scaleY);
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Add x-axis labels
    ctx.fillStyle = 'black';
    ctx.font = '12px Arial';
    const xStep = maxHeartRate / 5;
    for (let i = 0; i <= 5; i++) {
        const x = i * xStep * scaleX;
        const label = Math.round(i * xStep);
        ctx.fillText(label, x, scaleY + 15);
    }
}

// Form submission event handler
document.getElementById('heartRateForm').addEventListener('submit', function(event) {
    event.preventDefault();

    // Collect input values from the form
    const lowMin = parseFloat(document.getElementById('lowMin').value);
    const lowMax = parseFloat(document.getElementById('lowMax').value);
    const normalMin = parseFloat(document.getElementById('normalMin').value);
    const normalMax = parseFloat(document.getElementById('normalMax').value);
    const high1Min = parseFloat(document.getElementById('high1Min').value);
    const high1Max = parseFloat(document.getElementById('high1Max').value);
    const high2Min = parseFloat(document.getElementById('high2Min').value);
    const high2Max = parseFloat(document.getElementById('high2Max').value);

    // Validate inputs (ensure min <= max for each set)
    if (lowMin > lowMax || normalMin > normalMax || high1Min > high1Max || high2Min > high2Max) {
        alert("Please ensure the 'min' values are less than or equal to 'max' values for each set.");
        return;
    }

    // Call the function to plot the Gaussian membership functions
    plotGaussianMembershipFunction(lowMin, lowMax, normalMin, normalMax, high1Min, high1Max, high2Min, high2Max);
});