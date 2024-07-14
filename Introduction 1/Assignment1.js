// Inheritance pattern to define game objects

class GameObject {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type;
    }

    render() {
        console.log(`${this.type} is at (${this.x}, ${this.y})`);
    }
}

class Movable extends GameObject {
    constructor(x, y, type) {
        super(x, y, type);
    }

    moveTo(x, y) {
        this.x = x;
        this.y = y;
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

// Pub/Sub pattern for handling events

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
    hero.moveTo(x, y);
    hero.render();
    if (hero.x === enemy.x && hero.y === enemy.y) {
        eventEmitter.emit(Messages.COLLISION, { with: 'Enemy' });
    }
    if (hero.x === tree.x && hero.y === tree.y) {
        eventEmitter.emit(Messages.COLLISION, { with: 'Tree' });
    }
});

eventEmitter.on(Messages.COLLISION, (message, payload) => {
    console.log(`Collision with ${payload.with}`);
});

window.addEventListener('keyup', (evt) => {
    switch (evt.key) {
        case 'ArrowLeft':
            eventEmitter.emit(Messages.HERO_MOVE, { x: hero.x - 1, y: hero.y });
            break;
        case 'ArrowRight':
            eventEmitter.emit(Messages.HERO_MOVE, { x: hero.x + 1, y: hero.y });
            break;
        case 'ArrowUp':
            eventEmitter.emit(Messages.HERO_MOVE, { x: hero.x, y: hero.y - 1 });
            break;
        case 'ArrowDown':
            eventEmitter.emit(Messages.HERO_MOVE, { x: hero.x, y: hero.y + 1 });
            break;
    }
});

// Initial rendering
hero.render();
enemy.render();
tree.render();
