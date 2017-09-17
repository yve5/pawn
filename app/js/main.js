function PawnViewModel() {
    var self = this;

    self.touchSupport    = 'ontouchstart' in window || navigator.msMaxTouchPoints;
    self.lockedMove      = ko.observable(false);
    self.insight         = ko.observable(160);
    
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
    self.taped           = null;


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
        self.handleAnimation();

        requestAnimationFrame(self.loopGame);
    }

    self.resizeContainer = function() {
        // console.log('resizeContainer');
    }

    self.handleKeydown = function(eve) {
        if (self.lockedMove() === false) {
            if (eve.keyCode === 32) {
                self.spaceKey(!self.spaceKey());
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
        // self.spaceKey(false);
    }

    self.handleStart = function(eve) {
        self.lastY(event.touches[0].clientY);
        self.lastX(event.touches[0].clientX);

        if (!self.tapped) {
            self.tapped = setTimeout(function() {
                // single tapped
                self.tapped = null;
                console.log('single', 'tapped');
            }, 400);
        }
        else {
            // double tapped
            clearTimeout(self.tapped);
            self.tapped = null;

            self.spaceKey(!self.spaceKey());
            console.log('double', 'tapped');
        }
    }

    self.handleEnd = function(eve) {
        self.handleKeyup();
    }

    self.handleCancel = function(eve) {
        console.log('handleCancel', eve);
    }

    self.handleMove = function(eve) {
        self.currentY(event.touches[0].clientY);
        self.currentX(event.touches[0].clientX);
       
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

    self.handleAnimation = function() {
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