import { store } from './store.js';
import { randomHsl } from './helpers.js';

const board = document.getElementById('board');
const cntSquares = document.getElementById('cntSquares');
const cntCircles = document.getElementById('cntCircles');

function createElementForShape(s) {
    const el = document.createElement('div');
    el.className = `shape ${s.type}`;
    el.dataset.id = s.id;
    el.style.background = s.color;
    el.title = `${s.type} — kliknij, aby usunąć`;
    return el;
}

function render(state) {
    const existingEls = Array.from(board.children);
    const existingIds = new Set(existingEls.map((e) => e.dataset.id));
    const desiredIds = new Set(state.shapes.map((s) => s.id));

    for (const el of existingEls) {
        if (!desiredIds.has(el.dataset.id)) el.remove();
    }

    for (const shape of state.shapes) {
        if (!existingIds.has(shape.id)) {
            const el = createElementForShape(shape);
            board.appendChild(el);
        }
    }

    for (const shape of state.shapes) {
        const el = board.querySelector(`[data-id="${shape.id}"]`);
        if (el && el.style.background !== shape.color) {
            el.style.background = shape.color;
        }
    }

    cntSquares.textContent = store.count('square');
    cntCircles.textContent = store.count('circle');
}

board.addEventListener('click', (e) => {
    const target = e.target.closest('.shape');
    if (!target) return;
    const id = target.dataset.id;
    if (!id) return;
    store.removeShape(id);
});

export function uiInit() {
    document.getElementById('addSquare').addEventListener('click', () => {
        store.addShape('square', randomHsl());
    });

    document.getElementById('addCircle').addEventListener('click', () => {
        store.addShape('circle', randomHsl());
    });

    document.getElementById('recolorSquares').addEventListener('click', () => {
        store.recolor('square', randomHsl);
    });

    document.getElementById('recolorCircles').addEventListener('click', () => {
        store.recolor('circle', randomHsl);
    });

    document.getElementById('return').addEventListener('click', () => {
        window.location.href = '../index.html';
    });

    store.subscribe(render);
}
