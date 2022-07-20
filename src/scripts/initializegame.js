export class initializeGame {

    constructor(canvas) {
        this.canvas = canvas;
        this.success = true;

        this.canvas.width = document.body.clientWidth;
        this.canvas.height = document.body.clientHeight;
        this.virtualWidth = this.canvas.width;
        this.virtualHeight = this.canvas.height;

        this.ctx = canvas.getContext("2d");
        this.sensitivity = 1;

        this.elements = [];
        this.crosshairPlacement = [this.canvas.width / 2, this.canvas.height / 2];
    }

    init = (onShoot) => {
        this.onShoot = onShoot;

        document.addEventListener("mousemove", this.mouseMoveHandler, false);
        document.addEventListener("mouseup", this.mouseUpHandler, false);
        this.canvas.requestPointerLock();
    }

    createCircle = (xOffset, yOffset, size) => {
        this.ctx.beginPath();
        this.ctx.arc(xOffset, yOffset, size, 0, 2 * Math.PI);
        this.ctx.fill();
    }

    createCircles = () => {
        for (var i = 0; i < this.elements.length; i++) {
            const element = this.elements[i];
            this.createCircle(element[0], element[1], element[2]);
        }
    }

    clear = () => {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    setSensitivity = (sensitivity) => {
        this.sensitivity = sensitivity;
    }

    mouseMoveHandler = (e) => {
        this.virtualWidth -= e.movementX * this.sensitivity;
        this.virtualHeight -= e.movementY * this.sensitivity;

        this.clear();
        for (var i = 0; i < this.elements.length; i++) {
            this.elements[i][0] -= e.movementX * this.sensitivity;
            this.elements[i][1] -= e.movementY * this.sensitivity;

            const element = this.elements[i];
            this.createCircle(element[0], element[1], element[2]);
        }
    }

    mouseUpHandler = (e) => {
        // console.log(this.crosshairPlacement);
        this.canvas.requestPointerLock();
        this.onShoot(this.crosshairPlacement, this.elements);
    }

    setElements = (elements) => {
        this.elements = elements;
    }

    stop = () => {
        document.removeEventListener("mousemove", this.mouseMoveHandler, false);
        document.removeEventListener("mouseup", this.mouseUpHandler, false);
        document.exitPointerLock();
    }
}