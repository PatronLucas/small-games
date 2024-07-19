class GameObject {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.element = document.createElement('div');
        this.element.className = `game-object ${type.toLowerCase()}`;
        this.render();
        document.getElementById('gameContainer').appendChild(this.element);
    }

    render() {
        this.element.style.left = `${this.x * 20}px`;
        this.element.style.top = `${this.y * 20}px`;
    }
}

class Movable extends GameObject {
    constructor(x, y, type) {
        super(x, y, type);
    }

    moveTo(x, y) {
        // Ensure the new position is within the boundaries of the game container
        const maxX = 29; // Assuming the game container is 600px wide (600 / 20 - 1)
        const maxY = 19; // Assuming the game container is 400px high (400 / 20 - 1)

        if (x >= 0 && x <= maxX && y >= 0 && y <= maxY) {
            this.x = x;
            this.y = y;
            this.render();
        } else {
            console.log('Movement out of bounds:', { x, y }); // Added logging for out-of-bounds movement
        }
    }
}

class Hero extends Movable {
    constructor(x, y) {
        super(x, y, 'Hero');
    }
}

class Enemy extends Movable {
    constructor(x, y) {
        super(x, y, 'Enemy');
    }
}

class Tree extends GameObject {
    constructor(x, y) {
        super(x, y, 'Tree');
    }
}

class EventEmitter {
    constructor() {
        this.listeners = {};
    }

    on(message, listener) {
        if (!this.listeners[message]) {
            this.listeners[message] = [];
        }
        this.listeners[message].push(listener);
    }

    emit(message, payload = null) {
        if (this.listeners[message]) {
            this.listeners[message].forEach(l => l(message, payload));
        }
    }
}

const Messages = {
    HERO_MOVE: 'HERO_MOVE',
    COLLISION: 'COLLISION'
};

const eventEmitter = new EventEmitter();

const hero = new Hero(0, 0);
const enemy = new Enemy(5, 5);
const tree = new Tree(2, 2);

eventEmitter.on(Messages.HERO_MOVE, (message, { x, y }) => {
    const previousX = hero.x; // Store previous position
    const previousY = hero.y; // Store previous position

    hero.moveTo(x, y);

    if (checkCollisions()) { // If collision detected, revert to previous position
        hero.moveTo(previousX, previousY); // Revert position on collision
    }
});

eventEmitter.on(Messages.COLLISION, (message, payload) => {
    console.log(`Collision with ${payload.with}`);
});

function checkCollisions() {
    let collision = false;

    if (hero.x === enemy.x && hero.y === enemy.y) {
        eventEmitter.emit(Messages.COLLISION, { with: 'Enemy' });
        collision = true;
    }
    if (hero.x === tree.x && hero.y === tree.y) {
        eventEmitter.emit(Messages.COLLISION, { with: 'Tree' });
        collision = true;
    }

    return collision; // Return true if a collision is detected
}

window.addEventListener('keyup', (evt) => {
    let newX = hero.x;
    let newY = hero.y;

    switch (evt.key) {
        case 'ArrowLeft':
            newX = hero.x - 1;
            break;
        case 'ArrowRight':
            newX = hero.x + 1;
            break;
        case 'ArrowUp':
            newY = hero.y - 1;
            break;
        case 'ArrowDown':
            newY = hero.y + 1;
            break;
    }

    eventEmitter.emit(Messages.HERO_MOVE, { x: newX, y: newY });
});

// Initial rendering
hero.render();
enemy.render();
tree.render();
