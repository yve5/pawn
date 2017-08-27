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

var gridPositionX = 0;
var gridPositionY = 0;
var playerPositionX = 0;
var playerPositionY = 0;


// var offset = 10;
var offset = 0;
var insight = 160;


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
    offset = 0;
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
    offset = 0;
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
    
    $("#player").css({"transform":"translate(" + playerPositionX + "px, " + playerPositionY + "px)"});
    $('#grid').css({"transform":"translate(" + gridPositionX + "px, " + gridPositionY + "px)"});
    
    $('#debugger').html("Player: " + playerPositionX + " " + playerPositionY
        + "<br>Grid: " + gridPositionX + " " + gridPositionY
        + "<br>Delta: " + (gridPositionX + playerPositionX) + " " + (gridPositionY + playerPositionY));
    
    requestAnimationFrame(gameLoop);
}

function whatKey() {
    if (lockedMove !== null) {
        // console.log('hello, value');
        
        if (offset <= 10) {
            // offset += Math.floor(0.5);
            offset += 1;
        }
    }
    
    // left
    if (keys[37] && (lockedMove === 37)) {
        if (playerPositionX > 0) {
            playerPositionX -= offset;
        }
        
        if ((gridPositionX + playerPositionX) < insight && gridPositionX < 0) {
            gridPositionX += offset;
        }
    }
    
    // top
    if (keys[38] && (lockedMove === 38)) {
        if (playerPositionY > 0) {
            playerPositionY -= offset;
        }
        
        if ((gridPositionY + playerPositionY) < insight && gridPositionY < 0) {
            gridPositionY += offset;
        }
    }
    
    // right
    if (keys[39] && (lockedMove === 39)) {
        if (playerPositionX < (1920 - 70)) {
            playerPositionX += offset;
        }
        
        if ((gridPositionX + playerPositionX) > (800 - 70 - insight) && (gridPositionX * -1) < (1920 - 800)) {
            gridPositionX -= offset;
        }
    }
    
    // bottom
    if (keys[40] && (lockedMove === 40)) {
        if (playerPositionY < (1920 - 70)) {
            playerPositionY += offset;
        }
        
        if ((gridPositionY + playerPositionY) > (500 - 70 - insight) && (gridPositionY * -1) < (1920 - 500)) {
            gridPositionY -= offset;
        }
    }
    
    // space
    if (keys[32]) {
        $("#player").css({"background": "pink"});
    }
}