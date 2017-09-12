function PawnViewModel() {
    var self = this;

    self.touchSupport = 'ontouchstart' in window || navigator.msMaxTouchPoints;
 
    self.playerPositionX = ko.observable(0);
    self.playerPositionY = ko.observable(0);
 
    self.gridPositionX = ko.observable(0);
    self.gridPositionY = ko.observable(0);
    

    self.init = function() {
        // touch management
        if (self.touchSupport) {
            document.addEventListener("touchstart", self.handleStart, false);
            document.addEventListener("touchend", self.handleEnd, false);
            document.addEventListener("touchcancel", self.handleCancel, false);
            document.addEventListener("touchmove", self.handleMove, false);
        }

        // resizing management
        self.resizeContainer();
        window.addEventListener('resize', self.resizeContainer);

        // keys management
        window.addEventListener("keydown", self.handleKeydown);
        window.addEventListener("keyup", self.handleKeyup);

        // game start
        self.loopGame();
    }

    self.loopGame = function() {
        // self.playerPositionX(self.playerPositionX() + 1);
        // self.playerPositionY(self.playerPositionY() + 1);
       
        // self.gridPositionX(self.gridPositionX() + 1);
        // self.gridPositionY(self.gridPositionY() + 1);
 
        requestAnimationFrame(self.loopGame);
    }

    self.resizeContainer = function() {
        console.log('resizeContainer');
    }

    self.handleKeydown = function(eve) {
        console.log('handleKeydown', eve);
    }

    self.handleKeyup = function(eve) {
        console.log('handleKeyup', eve);
    }

    self.handleStart = function(eve) {
        console.log('handleStart', eve);
    }

    self.handleEnd = function(eve) {
        console.log('handleEnd', eve);
    }

    self.handleCancel = function(eve) {
        console.log('handleCancel', eve);
    }

    self.handleMove = function(eve) {
        console.log('handleMove', eve);
    }

    self.whatKey = function() {
        console.log('whatKey');
    }

}

var pvm = new PawnViewModel();
ko.applyBindings(pvm);
pvm.init();




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


var offset = 0;
var insight = 160;


var maxSpeed = 300;

var lockedMove = null;
var endMove = false;

var keys = []
keys[37] = false;
keys[38] = false;
keys[39] = false;
keys[40] = false;


window.onload = function init() {
    if (supportsTouch) {
        document.addEventListener("touchstart", handleStart, false);
        document.addEventListener("touchend", handleEnd, false);
        document.addEventListener("touchcancel", handleCancel, false);
        document.addEventListener("touchmove", handleMove, false);
       
        console.log("supportsTouch");
    }

    resizeContainer();
    window.addEventListener('resize', resizeContainer);

    gameLoop();
}


function resizeContainer() {
    if (screen.width <= 800) {
        $('.container').width(screen.width).height(screen.height);
    }
    else {
        $('.container').width('800px').height('500px');
    }
}


window.addEventListener("keydown", function (eve) {
    if (lockedMove === null) {
        keys[eve.keyCode] = true;
        lockedMove = eve.keyCode;
    }
});

window.addEventListener("keyup", function (eve) {
    keys[eve.keyCode] = false;
    // lockedMove = null;
    // offset = 0;
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
    }
    else {
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
   
    // lockedMove = null;
    // offset = 0;
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
    if (keys[37] === false && keys[38] === false && keys[39] === false && keys[40] === false) {
        if (offset > 0) {
            offset -= 0.5;
            endMove = true;
        }
 
        if (offset <= 0) {
            lockedMove = null;
            endMove = false;
            offset = 0;
        }
    }
    else {
        if (lockedMove !== null) {
            if (offset < 10) {
                offset += 0.3;
            }
        }
    }
   
    // left
    if ((keys[37] || endMove) && (lockedMove === 37)) {
        if (playerPositionX > 0) {
            playerPositionX -= Math.ceil(offset);
 
            if (playerPositionX < 0) {
                playerPositionX = 0;
            }
        }
        
        if ((gridPositionX + playerPositionX) < insight && gridPositionX < 0) {
            gridPositionX += Math.ceil(offset);
 
            if (gridPositionX > 0) {
                gridPositionX = 0;
            }
        }
    }
   
    // top
    if ((keys[38] || endMove) && (lockedMove === 38)) {
        if (playerPositionY > 0) {
            playerPositionY -= Math.ceil(offset);
 
            if (playerPositionY < 0) {
                playerPositionY = 0;
            }
        }
 
        if ((gridPositionY + playerPositionY) < insight && gridPositionY < 0) {
            gridPositionY += Math.ceil(offset);
 
            if (gridPositionY > 0) {
                gridPositionY = 0;
            }
        }
    }
   
    // right
    if ((keys[39] || endMove) && (lockedMove === 39)) {
        if (playerPositionX < (1920 - 70)) {
            playerPositionX += Math.ceil(offset);
 
            if (playerPositionX > (1920 - 70)) {
                playerPositionX = 1920 - 70;
            }
        }
       
        if ((gridPositionX + playerPositionX) > (800 - 70 - insight) && (gridPositionX * -1) < (1920 - 800)) {
            gridPositionX -= Math.ceil(offset);
 
            if (gridPositionX < (-1920 + 800)) {
                gridPositionX = (-1920 + 800);
            }
        }
    }
   
    // bottom
    if ((keys[40] || endMove) && (lockedMove === 40)) {
        if (playerPositionY < (1920 - 70)) {
            playerPositionY += Math.ceil(offset);
 
            if (playerPositionY > (1920 - 70)) {
                playerPositionY = 1920 - 70;
            }
        }
       
        if ((gridPositionY + playerPositionY) > (500 - 70 - insight) && (gridPositionY * -1) < (1920 - 500)) {
            gridPositionY -= Math.ceil(offset);
 
            if (gridPositionY < (-1920 + 500)) {
                gridPositionY = (-1920 + 500);
            }
        }
    }
   
    // space
    if (keys[32]) {
        $("#player").css({"background": "pink"});
    }
}