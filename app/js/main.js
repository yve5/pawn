function PawnViewModel() {
    var self = this;

    //
    // attributes

    self.touchSupport    = 'ontouchstart' in window || navigator.msMaxTouchPoints;
    self.lockedMove      = ko.observable(false);
    self.insightX        = ko.observable(200);
    self.insightY        = ko.observable(200);

    // sizes
    self.playerWidth     = ko.observable(70);
    self.initialWidth    = 800;
    self.initialHeight   = 500;
    self.containerWidth  = ko.observable(self.initialWidth);
    self.containerHeight = ko.observable(self.initialHeight);
    self.gridWidth       = ko.observable(self.playerWidth() * 30);
    self.gridHeight      = ko.observable(self.playerWidth() * 30);

    //
    self.playerX         = ko.observable(0);
    self.playerY         = ko.observable(0);
    self.gridX           = ko.observable(0);
    self.gridY           = ko.observable(0);

    // camera
    self.delay           = 10;
    self.cameraX         = ko.observableArray();
    self.cameraY         = ko.observableArray();

    // key
    self.moveTop         = ko.observable(false);
    self.moveRight       = ko.observable(false);
    self.moveBottom      = ko.observable(false);
    self.moveLeft        = ko.observable(false);
    self.spaceKey        = ko.observable(false);

    // offset
    self.offset          = ko.observable(1);
    self.offsetMax       = ko.observable(7);
    self.offsetIncrement = ko.observable(0);

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

        // start
        self.loopGame();
    }

    self.loopGame = function() {
        self.movePlayer();
        self.moveCamera();
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
        if (prmWidth <= self.initialWidth) {
            self.containerHeight(prmHeight);
            self.containerWidth(prmWidth);
        } else {
            self.containerHeight(self.initialHeight);
            self.containerWidth(self.initialWidth);
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

    self.roundSpeed = function(valueToRound) {
        return (Math.round((valueToRound) * 10) / 10);
    }

    self.movePlayer = function() {
        if (!self.moveLeft() && !self.moveTop() && !self.moveRight() && !self.moveBottom()) {
            if (self.offset() > 0) {
                // self.offset(self.roundSpeed(self.offset() - 0.5));
                self.offset(self.roundSpeed(self.offset() - self.offsetIncrement()));
                self.offsetIncrement(self.offsetIncrement() + 0.0001);
            }
            else {
                self.lockedMove(false);
                self.offset(0);
                self.offsetIncrement(0);
            }
        }
        else {
            if (self.lockedMove() !== false) {
                if (self.offset() < self.offsetMax()) {
                    // self.offset(self.roundSpeed(self.offset() + 0.3));
                    self.offset(self.roundSpeed(self.offset() + self.offsetIncrement()));
                    self.offsetIncrement(self.offsetIncrement() + 0.01);
                }
                else if (self.offset() > self.offsetMax()) {
                    self.offset(self.offsetMax());
                }
            }
        }


        if (self.lockedMove() === 'left') {
            if (self.playerX() > 0) {
                self.playerX(self.playerX() - Math.ceil(self.offset()));

                if ((self.gridX() + self.playerX()) < self.insightX()) {
                    self.cameraX.push(Math.ceil(self.offset()));
                }

                if (self.playerX() < 0) {
                    self.playerX(0);
                }
            }
        }


        if (self.lockedMove() === 'top') {
            if (self.playerY() > 0) {
                self.playerY(self.playerY() - Math.ceil(self.offset()));

                if ((self.gridY() + self.playerY()) < self.insightY()) {
                    self.cameraY.push(Math.ceil(self.offset()));
                }

                if (self.playerY() < 0) {
                    self.playerY(0);
                }
            }
        }


        if (self.lockedMove() === 'right') {
            if (self.playerX() < (self.gridWidth() - self.playerWidth())) {
                self.playerX(self.playerX() + Math.ceil(self.offset()));

                if ((self.gridX() + self.playerX()) > (self.containerWidth() - self.playerWidth() - self.insightX())) {
                    self.cameraX.push(-Math.ceil(self.offset()));
                }

                if (self.playerX() > (self.gridWidth() - self.playerWidth())) {
                    self.playerX(self.gridWidth() - self.playerWidth());
                }
            }
        }


        if (self.lockedMove() === 'bottom') {
            if (self.playerY() < (self.gridHeight() - self.playerWidth())) {
                self.playerY(self.playerY() + Math.ceil(self.offset()));

                if ((self.gridY() + self.playerY()) > (self.containerHeight() - self.playerWidth() - self.insightY())) {
                    self.cameraY.push(-Math.ceil(self.offset()));
                }

                if (self.playerY() > (self.gridHeight() - self.playerWidth())) {
                    self.playerY(self.gridHeight() - self.playerWidth());
                }
            }
        }
    }

    self.moveCamera = function () {
        if (!self.isOnlyZero('y')) {
            // top
            if ((self.gridY() + self.playerY()) < self.insightY()) {
                self.gridY(self.gridY() + Math.ceil(self.cameraY()[0]));
                self.cameraY.shift();

                if (self.gridY() > 0) {
                    self.gridY(0);
                }
            }

            // bottom
            if ((self.gridY() + self.playerY()) > (self.containerHeight() - self.playerWidth() - self.insightY())) {
                self.gridY(self.gridY() + Math.ceil(self.cameraY()[0]));
                self.cameraY.shift();

                if (0 >= (self.gridHeight() - self.containerHeight() + self.gridY())) {
                    self.gridY(-self.gridHeight() + self.containerHeight());
                }
            }
        }

        if (self.cameraY().length < self.delay) {
            self.cameraY.push(0);
        }


        if (!self.isOnlyZero('x')) {
            // left
            if ((self.gridX() + self.playerX()) < self.insightX()) {
                self.gridX(self.gridX() + Math.ceil(self.cameraX()[0]));
                self.cameraX.shift();

                if (self.gridX() > 0) {
                    self.gridX(0);
                }
            }

            // right
            if ((self.gridX() + self.playerX()) > (self.containerWidth() - self.playerWidth() - self.insightX())) {
                self.gridX(self.gridX() + Math.ceil(self.cameraX()[0]));
                self.cameraX.shift();

                if (self.gridX() < (-self.gridWidth() + self.containerWidth())) {
                    self.gridX(-self.gridWidth() + self.containerWidth());
                }
            }
        }

        if (self.cameraX().length < self.delay) {
            self.cameraX.push(0);
        }
    }

    self.isOnlyZero = function (direction) {
        var containsOnlyZero = true;
        if (direction === 'x') {
            for (var i = self.cameraX().length - 1; i >= 0; i--) {
                if (self.cameraX()[i] != 0) {
                    containsOnlyZero = false;
                }
            }
        }
        else if (direction === 'y') {
            for (var i = self.cameraY().length - 1; i >= 0; i--) {
                if (self.cameraY()[i] != 0) {
                    containsOnlyZero = false;
                }
            }
        }
        return containsOnlyZero;
    };
}

var pvm = new PawnViewModel();
ko.applyBindings(pvm);
pvm.init();