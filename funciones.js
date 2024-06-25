document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('wheel');
    const ctx = canvas.getContext('2d');
    const spinButton = document.getElementById('spin-button');
    const resetButton = document.getElementById('reset-button');
    const optionsInput = document.getElementById('options-input');
    const resultDiv = document.getElementById('result');
    const themeSwitch = document.getElementById('themeSwitch');
    let options = [];
    let startAngle = 0;
    let arc = Math.PI / 3;

    themeSwitch.addEventListener('change', function() {
        if (themeSwitch.checked) {
            document.body.classList.remove('dark-mode');
            document.body.classList.add('light-mode');
        } else {
            document.body.classList.remove('light-mode');
            document.body.classList.add('dark-mode');
        }
    });

    function drawWheel() {
        const outsideRadius = 200;
        const textRadius = 160;
        const insideRadius = 125;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;

        ctx.font = '16px Arial'; 

        for (let i = 0; i < options.length; i++) {
            const angle = startAngle + i * arc;
            ctx.fillStyle = getColor(i, options.length);

            ctx.beginPath();
            ctx.arc(canvas.width / 2, canvas.height / 2, outsideRadius, angle, angle + arc, false);
            ctx.arc(canvas.width / 2, canvas.height / 2, insideRadius, angle + arc, angle, true);
            ctx.stroke();
            ctx.fill();

            ctx.save();
            ctx.fillStyle = 'black';
            ctx.translate(canvas.width / 2 + Math.cos(angle + arc / 2) * textRadius,
                          canvas.height / 2 + Math.sin(angle + arc / 2) * textRadius);
            ctx.rotate(angle + arc / 2 + Math.PI / 2);
            const text = options[i];
            ctx.fillText(text, -ctx.measureText(text).width / 2, 0);
            ctx.restore();
        }
    }

    function getColor(item, maxItem) {
        const colors = [
            '#FF5733', '#33FF57', '#3357FF', '#FF33A6', '#A633FF', '#FF8A33',
            '#FFC300', '#DAF7A6', '#581845', '#900C3F', '#C70039', '#FF5733',
            '#FFBD33', '#75FF33', '#33FFDD', '#33A1FF', '#7133FF', '#FF33FB',
            '#FF336E', '#FF3380', '#FF338C', '#33FFB5', '#33FFAA', '#33FF9F'
        ];
        return colors[item % colors.length];
    }
    
    function rotateWheel() {
        const spinAngleStart = Math.random() * 10 + 10;
        const spinTimeTotal = Math.random() * 3 + 4 * 1000;
        let spinTime = 0;

        function rotate() {
            spinTime += 30;
            if (spinTime >= spinTimeTotal) {
                stopRotateWheel();
                return;
            }
            const spinAngle = spinAngleStart - easeOut(spinTime, 0, spinAngleStart, spinTimeTotal);
            startAngle += (spinAngle * Math.PI / 180);
            drawWheel();
            requestAnimationFrame(rotate);
        }

        function stopRotateWheel() {
            const degrees = startAngle * 180 / Math.PI + 90;
            const arcd = arc * 180 / Math.PI;
            const index = Math.floor((360 - degrees % 360) / arcd);
            const selectedOption = options[index];
            resultDiv.innerHTML = `Resultado: ${selectedOption}`;
            alert(`Resultado: ${selectedOption}`);
        }

        function easeOut(t, b, c, d) {
            const ts = (t /= d) * t;
            const tc = ts * t;
            return b + c * (tc + -3 * ts + 3 * t);
        }

        rotate();
    }

    spinButton.addEventListener('click', () => {
        const inputText = optionsInput.value.trim();
        if (!inputText) {
            alert('Por favor, introduce opciones.');
            return;
        }
        options = inputText.split('\n').filter(option => option.trim() !== '');
        if (options.length < 2) {
            alert('Por favor, introduce al menos dos opciones.');
            return;
        }
        arc = Math.PI * 2 / options.length;
        drawWheel();
        rotateWheel();
    });

    resetButton.addEventListener('click', () => {
        options = [];
        optionsInput.value = '';
        resultDiv.innerHTML = '';
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    });
});
