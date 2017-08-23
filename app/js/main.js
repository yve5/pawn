function TaskListViewModel() {
    var self = this;

    self.tasks = ko.observableArray([]);
    self.newTaskText = ko.observable();
}

// ko.applyBindings(new TaskListViewModel());




window.onload = function init() {
    console.log('is_touch_device', is_touch_device());

    console.log('supportsTouch', supportsTouch);

    if (is_touch_device()) {
        // var el = document.getElementsByTagName("canvas")[0];
        document.addEventListener("touchstart", handleStart, false);
        document.addEventListener("touchend", handleEnd, false);
        document.addEventListener("touchcancel", handleCancel, false);
        document.addEventListener("touchmove", handleMove, false);

        console.log("initialized.");
    }

    gameLoop();
}

window.addEventListener("keydown", function (e) {
    keys[e.keyCode] = true;
});

window.addEventListener("keyup", function (e) {
    keys[e.keyCode] = false;
});

var supportsTouch = 'ontouchstart' in window || navigator.msMaxTouchPoints;
function is_touch_device() {
    try {
        document.createEvent("TouchEvent");
        return true;
    } catch (e) {
        return false;
    }
}

function handleStart (event) {
    event.preventDefault();
    // console.log('handleStart', event);
    keys['handleStart'] = true;
}

function handleEnd (event) {
    event.preventDefault();
    // console.log('handleEnd', event);
    keys['handleStart'] = false;
}

function handleCancel (event) {
    event.preventDefault();
    console.log('handleCancel', event);
}

function handleMove (event) {
    event.preventDefault();
    // console.log('handleMove', event);
}


var velX = 0,
velY = 0,
offset = 10,
keys = [],
maxSpeed = 300;

function gameLoop() {
    whatKey();

    $("#player").css({left: velX + 'px'});
    $("#player").css({top: velY + 'px'});

    requestAnimationFrame(gameLoop);
}

function whatKey() {
    if (keys[37]) {
        if (velX > 0) {
            velX -= offset;
        }
    }

    if (keys[39] || keys['handleStart']) {
        if (velX < 500) {
            velX += offset;
        }
    }

    if (keys[40]) {
        if (velY < 450) {
            velY += offset;
        }
    }

    if (keys[38]) {
        if (velY > -0) {
            velY -= offset;
        }
    }
}
