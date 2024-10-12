const puzzlePieces = document.querySelectorAll('.puzzle-piece');
let activePiece = null;
let offsetX = 0;
let offsetY = 0;

// Función para iniciar el movimiento
function startMove(e) {
    activePiece = e.target;

    // Calcula la posición de inicio según el tipo de evento
    if (e.type === 'mousedown') {
        offsetX = e.clientX - activePiece.getBoundingClientRect().left;
        offsetY = e.clientY - activePiece.getBoundingClientRect().top;
        document.addEventListener('mousemove', movePiece);
        document.addEventListener('mouseup', stopMove);
    } else if (e.type === 'touchstart') {
        offsetX = e.touches[0].clientX - activePiece.getBoundingClientRect().left;
        offsetY = e.touches[0].clientY - activePiece.getBoundingClientRect().top;
        document.addEventListener('touchmove', movePiece);
        document.addEventListener('touchend', stopMove);
    }
}

// Función para mover la pieza
function movePiece(e) {
    if (!activePiece) return;

    let x, y;
    if (e.type === 'mousemove') {
        x = e.clientX - offsetX;
        y = e.clientY - offsetY;
    } else if (e.type === 'touchmove') {
        x = e.touches[0].clientX - offsetX;
        y = e.touches[0].clientY - offsetY;
    }

    // Evitar que las piezas se muevan fuera del contenedor
    const containerRect = activePiece.parentElement.getBoundingClientRect();
    const pieceRect = activePiece.getBoundingClientRect();

    if (x < containerRect.left) x = containerRect.left;
    if (y < containerRect.top) y = containerRect.top;
    if (x + pieceRect.width > containerRect.right) x = containerRect.right - pieceRect.width;
    if (y + pieceRect.height > containerRect.bottom) y = containerRect.bottom - pieceRect.height;

    activePiece.style.left = `${x - containerRect.left}px`;
    activePiece.style.top = `${y - containerRect.top}px`;

    // Verificar la cercanía a otras piezas
    checkForSnap();
}

// Función para verificar si se debe unir a otra pieza
function checkForSnap() {
    const threshold = 20; // Distancia para hacer "snap"
    const pieceRect = activePiece.getBoundingClientRect();

    puzzlePieces.forEach(piece => {
        if (piece !== activePiece) {
            const otherRect = piece.getBoundingClientRect();
            if (
                Math.abs(pieceRect.left - otherRect.left) < threshold &&
                Math.abs(pieceRect.top - otherRect.top) < threshold
            ) {
                piece.style.left = `${activePiece.style.left}`;
                piece.style.top = `${activePiece.style.top}`;
                activePiece.style.pointerEvents = 'none'; // Desactiva el movimiento de la pieza que se ha unido
            }
        }
    });
}

// Función para detener el movimiento
function stopMove() {
    document.removeEventListener('mousemove', movePiece);
    document.removeEventListener('mouseup', stopMove);
    document.removeEventListener('touchmove', movePiece);
    document.removeEventListener('touchend', stopMove);
    activePiece = null;
}

// Añadir eventos de mouse y touch a cada pieza
puzzlePieces.forEach(piece => {
    piece.addEventListener('mousedown', startMove);
    piece.addEventListener('touchstart', startMove);
});
