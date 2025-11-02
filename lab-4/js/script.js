const columns = document.querySelectorAll('.column');

function randomColor() {
    const colors = [
        '#FFEB99',
        '#FFC1CC',
        '#C4E9FF',
        '#D3FFD3',
        '#FFD6A5',
        '#E5CFFF',
        '#B4E1FF',
    ];
    return colors[Math.floor(Math.random() * colors.length)];
}

function saveBoard() {
    const board = {};
    columns.forEach((col) => {
        const cards = [...col.querySelectorAll('.card')].map((card) => ({
            id: card.dataset.id,
            text: card.querySelector('.content').innerText,
            color: card.style.backgroundColor,
        }));
        board[col.id] = cards;
    });
    localStorage.setItem('kanbanBoard', JSON.stringify(board));
}

function loadBoard() {
    const data = JSON.parse(localStorage.getItem('kanbanBoard'));
    if (!data) return;
    Object.keys(data).forEach((colId) => {
        const column = document.getElementById(colId);
        data[colId].forEach((cardData) =>
            createCard(column, cardData.text, cardData.color, cardData.id)
        );
    });
}

function updateCount(column) {
    const count = column.querySelector('.count');
    count.textContent = column.querySelectorAll('.card').length;
}

function createCard(
    column,
    text = 'Nowa karta',
    color = randomColor(),
    id = Date.now()
) {
    const columnId = column.id;
    const card = document.createElement('div');
    card.classList.add('card');
    card.style.backgroundColor = color;
    card.dataset.id = id;

    let leftArrow =
        columnId !== 'todo' ? '<button class="move-left">←</button>' : '';
    let rightArrow =
        columnId !== 'done' ? '<button class="move-right">→</button>' : '';

    card.innerHTML = `
    <div class="card-controls">
      ${leftArrow}
      <button class="color-btn">🖌</button>
      <button class="delete-btn">✖</button>
      ${rightArrow}
    </div>
    <div class="content" contenteditable="true">${text}</div>
  `;

    card.querySelector('.content').addEventListener('input', saveBoard);

    card.querySelector('.delete-btn').addEventListener('click', () => {
        card.remove();
        updateCount(column);
        saveBoard();
    });

    card.querySelector('.color-btn').addEventListener('click', () => {
        card.style.backgroundColor = randomColor();
        saveBoard();
    });

    column.querySelector('.cards').appendChild(card);
    updateCount(column);
    saveBoard();
}

columns.forEach((column) => {
    const cardsContainer = column.querySelector('.cards');

    column.querySelector('.add-card').addEventListener('click', () => {
        createCard(column);
    });

    column.querySelector('.color-column').addEventListener('click', () => {
        column.querySelectorAll('.card').forEach((card) => {
            card.style.backgroundColor = randomColor();
        });
        saveBoard();
    });

    column.querySelector('.sort-column').addEventListener('click', () => {
        const cards = [...cardsContainer.querySelectorAll('.card')];
        cards.sort((a, b) =>
            a
                .querySelector('.content')
                .innerText.localeCompare(
                    b.querySelector('.content').innerText,
                    'pl'
                )
        );
        cards.forEach((card) => cardsContainer.appendChild(card));
        saveBoard();
    });

    column.addEventListener('click', (e) => {
        if (
            e.target.classList.contains('move-right') ||
            e.target.classList.contains('move-left')
        ) {
            const card = e.target.closest('.card');
            let targetCol;

            if (e.target.classList.contains('move-right')) {
                targetCol = column.nextElementSibling;
            } else {
                targetCol = column.previousElementSibling;
            }

            if (targetCol && targetCol.classList.contains('column')) {
                targetCol.querySelector('.cards').appendChild(card);
                updateCount(column);
                updateCount(targetCol);

                const controls = card.querySelector('.card-controls');
                controls.innerHTML = '';

                if (targetCol.id !== 'todo') {
                    controls.innerHTML +=
                        '<button class="move-left">←</button>';
                }
                controls.innerHTML +=
                    '<button class="color-btn">🖌</button><button class="delete-btn">✖</button>';
                if (targetCol.id !== 'done') {
                    controls.innerHTML +=
                        '<button class="move-right">→</button>';
                }

                card.querySelector('.delete-btn').addEventListener(
                    'click',
                    () => {
                        card.remove();
                        updateCount(targetCol);
                        saveBoard();
                    }
                );
                card.querySelector('.color-btn').addEventListener(
                    'click',
                    () => {
                        card.style.backgroundColor = randomColor();
                        saveBoard();
                    }
                );

                saveBoard();
            }
        }
    });
});

window.addEventListener('load', loadBoard);
