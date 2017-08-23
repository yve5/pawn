// function TaskListViewModel() {
//     var self = this;

//     self.tasks = ko.observableArray([]);
//     self.newTaskText = ko.observable();
// }

// ko.applyBindings(new TaskListViewModel());




var supportsTouch = 'ontouchstart' in window || navigator.msMaxTouchPoints;
var tapped = false;

var currentY;
var currentX;
var lastY;
var lastX;
var approx = 5;

var velX = 0;
var velY = 0;
var offset = 7;
var keys = [];
var maxSpeed = 300;

var lockedMove = null;


window.onload = function init() {
    // console.log('is_touch_device', is_touch_device());
    
    if (supportsTouch) {
        // var el = document.getElementsByTagName("canvas")[0];
        document.addEventListener("touchstart", handleStart, false);
        document.addEventListener("touchend", handleEnd, false);
        document.addEventListener("touchcancel", handleCancel, false);
        document.addEventListener("touchmove", handleMove, false);
        
        console.log("supportsTouch");
    }
    
    gameLoop();
}

window.addEventListener("keydown", function (eve) {
    if (lockedMove === null) {
        keys[eve.keyCode] = true;
        lockedMove = eve.keyCode;
    }
});

window.addEventListener("keyup", function (eve) {
    keys[eve.keyCode] = false;
    lockedMove = null;
});



function handleStart (event) {
    lastY = event.touches[0].clientY;
    lastX = event.touches[0].clientX;
    
    if (!tapped) {
      tapped = setTimeout(function() {
          // single tapped
          tapped = null;
          
          // console.log('single', 'tapped');
      }, 400);
  } else {
        // double tapped
        clearTimeout(tapped);
        tapped = null;
        
        $("#player").css({"background": "red"});
        // console.log('double', 'tapped');
    }
}

function handleEnd (event) {
    // console.log('handleEnd');
    
    keys[37] = false;
    keys[38] = false;
    keys[39] = false;
    keys[40] = false;
    
    lockedMove = null;
}

function handleCancel (event) {
    console.log('handleCancel', event);
}

function handleMove (event) {
    // console.log('handleMove', keys);
    
    currentY = event.touches[0].clientY;
    currentX = event.touches[0].clientX;
    
    if (lockedMove === null) {
        // console.log('currentY', currentY, 'lastY', lastY, 'currentX', currentX, 'lastX', lastX);
        
        if (currentY > (lastY + approx)) {
            // bottom
            keys[40] = true;
            lockedMove = 40;
        }
        else if (currentY < (lastY - approx)) {
            // top
            keys[38] = true;
            lockedMove = 38;
        }
        
        if (currentX > (lastX + approx)) {
            // right
            keys[39] = true;
            lockedMove = 39;
        }
        else if (currentX < (lastX - approx)) {
            // left
            keys[37] = true;
            lockedMove = 37;
        }
    }
    
    lastY = currentY;
    lastX = currentX;
}

function gameLoop() {
    whatKey();
    
    $("#player").css({"transform":"translate(" + velX + "px, " + velY + "px)"});
    
    // if (lockedMove !== null) {
    //     console.log('lockedMove', lockedMove);
    // }
    
    requestAnimationFrame(gameLoop);
}

function whatKey() {
    // left
    if (keys[37] && (lockedMove === 37)) {
        if (velX > 0) {
            velX -= offset;
        }
    }
    
    // top
    if (keys[38] && (lockedMove === 38)) {
        if (velY > -0) {
            velY -= offset;
        }
    }
    
    // right
    if (keys[39] && (lockedMove === 39)) {
        if (velX < 500) {
            velX += offset;
        }
    }
    
    // bottom
    if (keys[40] && (lockedMove === 40)) {
        if (velY < 430) {
            velY += offset;
        }
    }
    
    // space
    if (keys[32]) {
        $("#player").css({"background": "pink"});
    }
}