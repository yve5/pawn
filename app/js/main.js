function PawnViewModel() {
    var self = this;
 
    //
    // attributes
   
    self.touchSupport    = 'ontouchstart' in window || navigator.msMaxTouchPoints;
    self.lockedMove      = ko.observable(false);
    self.insightX        = ko.observable(120);
    self.insightY        = ko.observable(100);

    // sizes
    self.playerWidth     = ko.observable(70);
    self.refWidth        = 800;
    self.refHeight       = 500;
    self.containerWidth  = ko.observable(self.refWidth);
    self.containerHeight = ko.observable(self.refHeight);
    
    // position
    self.playerPositionX = ko.observable(0);
    self.playerPositionY = ko.observable(0);
    self.gridPositionX   = ko.observable(0);
    self.gridPositionY   = ko.observable(0);
    
    // key
    self.moveTop         = ko.observable(false);
    self.moveRight       = ko.observable(false);
    self.moveBottom      = ko.observable(false);
    self.moveLeft        = ko.observable(false);
    self.spaceKey        = ko.observable(false);
   
    // offset
    self.offset          = ko.observable(1);
    self.offsetMax       = ko.observable(10);
   
    // touch
    self.currentY        = ko.observable(0);
    self.currentX        = ko.observable(0);
    self.lastY           = ko.observable(0);
    self.lastX           = ko.observable(0);
    self.approx          = ko.observable(5);
    self.taped           = ko.observable(0);
 
    //
    // not tested
 
    self.init = function() {
        // touch
        if (self.touchSupport) {
            document.addEventListener("touchstart", self.handleStart, false);
            document.addEventListener("touchend", self.handleEnd, false);
            document.addEventListener("touchcancel", self.handleCancel, false);
            document.addEventListener("touchmove", self.handleMove, false);
        }
 
        // resizing
        self.resizeContainer();
        window.addEventListener('resize', self.resizeContainer);
 
        // keys
        window.addEventListener("keydown", self.handleKeydown);
        window.addEventListener("keyup", self.handleKeyup);
 
        // game start
        self.loopGame();
    }
 
    self.loopGame = function() {
        self.handlePlayer();
        self.isTaped();
 
        requestAnimationFrame(self.loopGame);
    }
 
    self.resizeContainer = function() {
        var docHeight = document.documentElement.clientHeight;
        var docWidth  = document.documentElement.clientWidth;

        self.resizeContainerByTesting(docHeight, docWidth);
    }
 
    self.handleKeydown = function(eve) {
        self.handleKeydownForTesting(eve.keyCode);
    }
 
    self.handleStart = function(eve) {
        var insClientY = event.touches[0].clientY;
        var insClientX = event.touches[0].clientX;

        self.handleStartForTesting(insClientY, insClientX);
    }
 
    self.handleEnd = function(eve) {
        self.handleKeyup();
        self.taped(0);
    }
 
    self.handleCancel = function(eve) {
        console.log('handleCancel', eve);
    }
 
    self.handleMove = function(eve) {
        self.currentY(event.touches[0].clientY);
        self.currentX(event.touches[0].clientX);
        self.taped(0);
 
        if (self.lockedMove() === false) {
            if (self.currentY() > (self.lastY() + self.approx())) {
                self.lockedMove('bottom');
                self.moveBottom(true);
            }
            else if (self.currentY() < (self.lastY() - self.approx())) {
                self.lockedMove('top');
                self.moveBottom(true);
            }
          
            if (self.currentX() > (self.lastX() + self.approx())) {
                self.lockedMove('right');
                self.moveBottom(true);
            }
            else if (self.currentX() < (self.lastX() - self.approx())) {
                self.lockedMove('left');
                self.moveBottom(true);
            }
        }
      
        self.lastY(self.currentY());
        self.lastX(self.currentX());
    }
 
    //
    // tested

    self.resizeContainerByTesting = function(prmHeight, prmWidth) {
        if (prmHeight <= self.refHeight) {
            self.containerHeight(prmHeight);
        } else {
            self.containerHeight(self.refHeight);
        }

        if (prmWidth <= self.refWidth) {
            self.containerWidth(prmWidth);
        } else {
            self.containerWidth(self.refWidth);
        }
    }

    self.handleKeydownForTesting = function(keyCode) {
        if (self.lockedMove() === false) {
            if (keyCode === 32) {
                self.spaceKey(!self.spaceKey());
            }
 
            if (keyCode === 37) {
               self.lockedMove('left');
               self.moveLeft(true);
            }
           
            if (keyCode === 38) {
               self.lockedMove('top');
               self.moveTop(true);
            }
 
            if (keyCode === 39) {
               self.lockedMove('right');
               self.moveRight(true);
            }
 
            if (keyCode === 40) {
               self.lockedMove('bottom');
               self.moveBottom(true);
            }
        }
    }

    self.handleStartForTesting = function(prmClientY, prmClientX) {
        self.lastY(prmClientY);
        self.lastX(prmClientX);
        self.taped(1);
    }
 
    self.handleKeyup = function(eve) {
        self.moveTop(false);
        self.moveRight(false);
        self.moveBottom(false);
        self.moveLeft(false);
    }
 
    self.isTaped = function(eve) {
        if (self.taped() !== 0) {
            self.taped(self.taped() + 1);
        }
 
        // 31th frame => 400ms
        if (self.taped() === 31) {
            self.spaceKey(!self.spaceKey());
            self.taped(0);
        }
    }
 
    self.handlePlayer = function() {
        if (!self.moveLeft() && !self.moveTop() && !self.moveRight() && !self.moveBottom()) {
            if (self.offset() > 0) {
                self.offset(Math.round((self.offset() - 0.5) * 10) / 10);
            }
            else {
                self.lockedMove(false);
                self.offset(0);
            }
        }
        else {
            if (self.lockedMove() !== false) {
                if (self.offset() < self.offsetMax()) {
                    self.offset(Math.round((self.offset() + 0.3) * 10) / 10);
                }
                else if (self.offset() > self.offsetMax()) {
                    self.offset(self.offsetMax());
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
           
            if ((self.gridPositionX() + self.playerPositionX()) < self.insightX() && self.gridPositionX() < 0) {
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
    
            if ((self.gridPositionY() + self.playerPositionY()) < self.insightY() && self.gridPositionY() < 0) {
                self.gridPositionY(self.gridPositionY() + Math.ceil(self.offset()));
    
                if (self.gridPositionY() > 0) {
                    self.gridPositionY(0);
                }
            }
        }
      
 
        if (self.lockedMove() === 'right') {
            if (self.playerPositionX() < (1920 - self.playerWidth())) {
                self.playerPositionX(self.playerPositionX() + Math.ceil(self.offset()));
    
                if (self.playerPositionX() > (1920 - self.playerWidth())) {
                    self.playerPositionX(1920 - self.playerWidth());
                }
            }
          
            if ((self.gridPositionX() + self.playerPositionX()) > (self.containerWidth() - self.playerWidth() - self.insightX()) && (self.gridPositionX() * -1) < (1920 - self.containerWidth())) {
                self.gridPositionX(self.gridPositionX() - Math.ceil(self.offset()));
    
                if (self.gridPositionX() < (-1920 + self.containerWidth())) {
                    self.gridPositionX(-1920 + self.containerWidth());
                }
            }
        }
      
 
        if (self.lockedMove() === 'bottom') {
            if (self.playerPositionY() < (1920 - self.playerWidth())) {
                self.playerPositionY(self.playerPositionY() + Math.ceil(self.offset()));
    
                if (self.playerPositionY() > (1920 - self.playerWidth())) {
                    self.playerPositionY(1920 - self.playerWidth());
                }
            }
          
            if ((self.gridPositionY() + self.playerPositionY()) > (self.containerHeight() - self.playerWidth() - self.insightY()) && (self.gridPositionY() * -1) < (1920 - self.containerHeight())) {
                self.gridPositionY(self.gridPositionY() - Math.ceil(self.offset()));
    
                if (self.gridPositionY() < (-1920 + self.containerHeight())) {
                    self.gridPositionY(-1920 + self.containerHeight());
                }
            }
        }
    }
 
}

var pvm = new PawnViewModel();
ko.applyBindings(pvm);
pvm.init();