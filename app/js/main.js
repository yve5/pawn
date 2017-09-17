function PawnViewModel() {
    var self = this;

    self.touchSupport    = 'ontouchstart' in window || navigator.msMaxTouchPoints;
    self.playerPositionX = ko.observable(0);
    self.playerPositionY = ko.observable(0);
    self.gridPositionX   = ko.observable(0);
    self.gridPositionY   = ko.observable(0);
    self.lockedMove      = ko.observable(false);
    self.moveTop         = ko.observable(false);
    self.moveRight       = ko.observable(false);
    self.moveBottom      = ko.observable(false);
    self.moveLeft        = ko.observable(false);
    self.stopMove        = ko.observable(false);
    self.offset          = ko.observable(1);
    self.insight         = ko.observable(160);
    self.spaceKey        = ko.observable(false);
    

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
        self.handleAnimation();

        // self.playerPositionX(self.playerPositionX() + 1);
        // self.playerPositionY(self.playerPositionY() + 1);
       
        // self.gridPositionX(self.gridPositionX() + 1);
        // self.gridPositionY(self.gridPositionY() + 1);
 
        requestAnimationFrame(self.loopGame);
    }

    self.resizeContainer = function() {
        // console.log('resizeContainer');
    }

    self.handleKeydown = function(eve) {
        // console.log('handleKeydown', eve);

        if (self.lockedMove() === false) {
            if (eve.keyCode === 32) {
                self.spaceKey(true);
            }

            if (eve.keyCode === 37) {
               self.lockedMove('left');
               self.moveLeft(true);
            }
            
            if (eve.keyCode === 38) {
               self.lockedMove('top');
               self.moveTop(true);
            }

            if (eve.keyCode === 39) {
               self.lockedMove('right');
               self.moveRight(true);
            }

            if (eve.keyCode === 40) {
               self.lockedMove('bottom');
               self.moveBottom(true);
            }
        }
    }

    self.handleKeyup = function(eve) {
        self.moveTop(false);
        self.moveRight(false);
        self.moveBottom(false);
        self.moveLeft(false);
        self.spaceKey(false);
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

    self.handleAnimation = function() {

        if (!self.moveLeft() && !self.moveTop() && !self.moveRight() && !self.moveBottom()) {
            if (self.offset() > 0) {
                self.offset(self.offset() - 0.5);
            }
            else {
                self.lockedMove(false);
                self.stopMove(false);
                self.offset(0);
            }
        }
        else {
            if (self.lockedMove() !== false) {
                if (self.offset() < 10) {
                    self.offset(self.offset() + 0.3);
                }
                else if (self.offset() > 10) {
                    self.offset(10);
                }
            }
        }

       
        if (self.lockedMove() === 'left') {
            if (self.playerPositionX() > 0) {
                self.playerPositionX(self.playerPositionX() - Math.ceil(self.offset()));
     
                if (self.playerPositionX() < 0) {
                    self.playerPositionX(0);
                }
            }
            
            if ((self.gridPositionX() + self.playerPositionX()) < self.insight() && self.gridPositionX() < 0) {
                self.gridPositionX(self.gridPositionX() + Math.ceil(self.offset()));
     
                if (self.gridPositionX() > 0) {
                    self.gridPositionX(0);
                }
            }
        }
        
       
        if (self.lockedMove() === 'top') {
            if (self.playerPositionY() > 0) {
                self.playerPositionY(self.playerPositionY() - Math.ceil(self.offset()));
     
                if (self.playerPositionY() < 0) {
                    self.playerPositionY(0);
                }
            }
     
            if ((self.gridPositionY() + self.playerPositionY()) < self.insight() && self.gridPositionY() < 0) {
                self.gridPositionY(self.gridPositionY() + Math.ceil(self.offset()));
     
                if (self.gridPositionY() > 0) {
                    self.gridPositionY(0);
                }
            }
        }
       

        if (self.lockedMove() === 'right') {
            if (self.playerPositionX() < (1920 - 70)) {
                self.playerPositionX(self.playerPositionX() + Math.ceil(self.offset()));
                // self.playerPositionX(self.playerPositionX() + 10);
     
                if (self.playerPositionX() > (1920 - 70)) {
                    self.playerPositionX(1920 - 70);
                }
            }
           
            if ((self.gridPositionX() + self.playerPositionX()) > (800 - 70 - self.insight()) && (self.gridPositionX() * -1) < (1920 - 800)) {
                self.gridPositionX(self.gridPositionX() - Math.ceil(self.offset()));
     
                if (self.gridPositionX() < (-1920 + 800)) {
                    self.gridPositionX(-1920 + 800);
                }
            }
        }
       

        if (self.lockedMove() === 'bottom') {
            if (self.playerPositionY() < (1920 - 70)) {
                self.playerPositionY(self.playerPositionY() + Math.ceil(self.offset()));
     
                if (self.playerPositionY() > (1920 - 70)) {
                    self.playerPositionY(1920 - 70);
                }
            }
           
            if ((self.gridPositionY() + self.playerPositionY()) > (500 - 70 - self.insight()) && (self.gridPositionY() * -1) < (1920 - 500)) {
                self.gridPositionY(self.gridPositionY() - Math.ceil(self.offset()));
     
                if (self.gridPositionY() < (-1920 + 500)) {
                    self.gridPositionY(-1920 + 500);
                }
            }
        }
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
       
        // console.log("supportsTouch");
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