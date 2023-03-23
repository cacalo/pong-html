const zonaJuego = document.getElementById("zonaJuego");
let velocidad = 4;
let anchoPaletas = 20;
let altoPaletas = 100;
let anchoBola = 30;

//Mover paletas
document.addEventListener("keydown", (e) => {
  // console.log(e);
  switch (e.key) {
    case "ArrowDown":
      if (!j2.cpu) j2.bajar();
      break;
    case "ArrowUp":
      if (!j2.cpu) j2.subir();
      break;
    case "s":
      if (!j1.cpu) j1.bajar();
      break;
    case "w":
      if (!j1.cpu) j1.subir();
      break;
  }
});

//Dejar de mover paletas
document.addEventListener("keyup", (e) => {
  switch (e.key) {
    case "ArrowDown":
    case "ArrowUp":
      if (!j2.cpu) j2.freeze();
      break;
    case "w":
    case "s":
      if (!j1.cpu) j1.freeze();
      break;
  }
});

class Jugador {
  x;
  y = 20;
  tamaño = 100;
  element;
  cpu;
  movimiento;

  constructor(id, cpu = false) {
    this.element = document.createElement("div");
    this.element.classList = "jugador";
    this.element.id = id;
    this.element.style.height = altoPaletas+"px";
    this.element.style.width = anchoPaletas+"px";
    zonaJuego.appendChild(this.element);
    this.cpu = cpu;
  }

  bajar() {
    if (!this.movimiento) {
      this.moverse(true);
    }
  }

  freeze() {
    clearInterval(this.movimiento);
    this.movimiento = false;
  }

  subir() {
    if (!this.movimiento) {
      this.moverse(false);
    }
  }

  moverse(abajo) {
    this.movimiento = setInterval(() => {
      this.y += abajo ? velocidad : velocidad * -1;
      this.element.style.top = this.y + "px";
    }, 10);
  }

  activarCPU(){
    if(!this.cpu){
    this.cpu=setInterval( ()=>{
      const centroPaleta = this.y + anchoPaletas/2;
      if(Math.abs(bola.y - centroPaleta) < anchoPaletas/2) return this.freeze()
      if(bola.y < this.y + anchoPaletas/2) return this.subir()
      if(bola.y > this.y + anchoPaletas/2) return this.bajar()
    },20)
  }
  }

  desactivarCPU(){
    clearInterval(this.cpu);
    this.cpu = false;
  }
}

class Bola {
  x;
  y;

  dx = -10;
  dy = -10;
  element;
  movimiento;

  constructor() {
    this.element = document.createElement("div");
    this.element.classList = "bola";
    zonaJuego.appendChild(this.element);
    this.x = document.body.clientWidth /2 - anchoBola/2;
    this.y = document.body.clientHeight /2 - anchoBola/2;
    this.element.style.left += this.x+"px";
    this.element.style.top += this.y+"px";
    this.mover();
  }

  mover() {
    if (!this.movimiento) {
      this.movimiento = setInterval(() => {
        this.x += this.dx;
        this.y += this.dy;
        if(this.x < 0 || this.x > document.body.clientWidth - anchoBola){
          this.dx = this.dx*-1;
          this.x += this.dx;
        }
        if(this.y < 0 || this.y > document.body.clientHeight - anchoBola){
          this.dy = this.dy*-1;
          this.y += this.dy;
        }


        this.element.style.left = this.x+"px";
        this.element.style.top = this.y+"px";
      }, 20);
    }
  }

  eliminar(){
    clearInterval(this.movimiento);
  }
}

const j1 = new Jugador("jugador1");
const j2 = new Jugador("jugador2");
const bola = new Bola();


const obtenerCentro = ()=> [document.body.clientWidth, document.body.clientHeight];