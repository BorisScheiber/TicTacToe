let fields = [
    null, null, null,
    null, null, null,
    null, null, null
];

let currentPlayer = 'circle';

function init() {
    render();
}

function render() {
    let tableHtml = '<table>';
    for (let i = 0; i < 3; i++) {
        tableHtml += '<tr>';
        for (let j = 0; j < 3; j++) {
            let index = i * 3 + j;
            let symbol = '';

            if (fields[index] === 'circle') {
                symbol = generateSVGCircle();
            } else if (fields[index] === 'cross') {
                symbol = generateSVGCross();
            }

            tableHtml += `<td onclick="handleClick(this, ${index})">${symbol}</td>`;
        }
        tableHtml += '</tr>';
    }
    tableHtml += '</table>';
    document.getElementById('content').innerHTML = tableHtml;
}

function handleClick(cell, index) {
    if (fields[index] === null) {
        fields[index] = currentPlayer;
        cell.innerHTML = currentPlayer === 'circle' ? generateSVGCircle() : generateSVGCross();
        cell.onclick = null;

        if (isGameFinished()) {
            const winCombination = getWinningCombination();
            if (winCombination) {
                drawWinningLine(winCombination);
            }
        }

        currentPlayer = currentPlayer === 'circle' ? 'cross' : 'circle';
    }
}

const WINNING_COMBINATIONS = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // horizontal
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // vertical
    [0, 4, 8], [2, 4, 6], // diagonal
];

function isGameFinished() {
    return fields.every((field) => field !== null) || getWinningCombination() !== null;
}

function getWinningCombination() {
    for (let i = 0; i < WINNING_COMBINATIONS.length; i++) {
        const [a, b, c] = WINNING_COMBINATIONS[i];
        if (fields[a] === fields[b] && fields[b] === fields[c] && fields[a] !== null) {
            return WINNING_COMBINATIONS[i];
        }
    }
    return null;
}

function drawWinningLine(combination) {
    const lineColor = '#ffffff';
    const lineWidth = 5;

    const container = document.getElementById('content');
    const table = container.querySelector('table');
    const rect = table.getBoundingClientRect();
    const td1 = container.querySelectorAll('td')[combination[0]].getBoundingClientRect();
    const td2 = container.querySelectorAll('td')[combination[2]].getBoundingClientRect();

    const x1 = td1.left + td1.width / 2 - rect.left;
    const y1 = td1.top + td1.height / 2 - rect.top;
    const x2 = td2.left + td2.width / 2 - rect.left;
    const y2 = td2.top + td2.height / 2 - rect.top;

    const length = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    const angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);

    const line = document.createElement('div');
    line.classList.add('line');
    line.style.width = `${length}px`;
    line.style.height = `${lineWidth}px`;
    line.style.backgroundColor = lineColor;
    line.style.position = 'absolute';
    line.style.top = `${y1 - lineWidth / 2}px`;
    line.style.left = `${x1}px`;
    line.style.transform = `rotate(${angle}deg)`;
    line.style.transformOrigin = '2px 1px';

    container.appendChild(line);
}

function generateSVGCircle() {
    const color = "#00B0EF";
    const width = 70;
    const height = 70;
    const radius = 30;
    const circumference = 2 * Math.PI * radius;
    const duration = "0.2s";

    return `
        <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
            <circle cx="${width / 2}" cy="${height / 2}" r="${radius}" stroke="${color}" stroke-width="5" fill="none"
                stroke-dasharray="${circumference}" stroke-dashoffset="${circumference}">
                <animate 
                    attributeName="stroke-dashoffset" 
                    from="${circumference}" 
                    to="0" 
                    dur="${duration}" 
                    fill="freeze" 
                    repeatCount="1" 
                    keyTimes="0;1" 
                    calcMode="spline" 
                    keySplines=".28,.58,.73,.94" />
            </circle>
        </svg>
    `;
}

function generateSVGCross() {
    const color = "#FFC000";
    const width = 70;
    const height = 70;
    const innerSize = 60; // Die Innenabmessung des Kreuzes
    const offset = (width - innerSize) / 2; // Der Offset, um das Kreuz zu zentrieren
    const duration = "0.2s";
    const lineLength = Math.sqrt(2) * innerSize;

    return `
        <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
            <line x1="${offset}" y1="${offset}" x2="${offset + innerSize}" y2="${offset + innerSize}" stroke="${color}" stroke-width="5">
                <animate 
                    attributeName="stroke-dasharray" 
                    from="0 ${lineLength}" 
                    to="${lineLength} ${lineLength}" 
                    dur="${duration}" 
                    fill="freeze" 
                    keyTimes="0; 1" 
                    calcMode="linear" />
            </line>
            <line x1="${offset + innerSize}" y1="${offset}" x2="${offset}" y2="${offset + innerSize}" stroke="${color}" stroke-width="5">
                <animate 
                    attributeName="stroke-dasharray" 
                    from="0 ${lineLength}" 
                    to="${lineLength} ${lineLength}" 
                    dur="${duration}" 
                    fill="freeze" 
                    keyTimes="0; 1" 
                    calcMode="linear" />
            </line>
        </svg>
    `;
}

function restartGame() {
    fields = [
        null, null, null,
        null, null, null,
        null, null, null
    ];
    currentPlayer = 'circle';
    document.querySelectorAll('.line').forEach(line => line.remove()); // Entferne alle Linien
    render();
}
