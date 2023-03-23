const zonaJuego = document.getElementById("zonaJuego");
let velocidad = 10;
let anchoPaletas = 20;
let altoPaletas = 200;
let anchoBola = 50;
const margenAyuda = 10;
const mensajeElement = document.getElementById("mensaje");
let estadoJuego = "PLAY";
limitePuntos = 6;
const audioPunto = new Audio("audio/punto.mp3");
const audioHit = new Audio("audio/hit.mp3");
const puntoJson = document.getElementById("mensajePuntoJson");
const instrucciones = document.getElementById("instrucciones");

class Jugador {
  x;
  tamaño = 100;
  y;
  element;
  cpu;
  movimiento;

  constructor(id, cpu = false) {
    this.element = document.createElement("div");
    this.element.classList = "jugador";
    this.element.id = id;
    this.element.style.height = altoPaletas + "px";
    this.element.style.width = anchoPaletas + "px";
    zonaJuego.appendChild(this.element);
    this.reset();
    this.cpu = cpu;
  }

  bajar() {
    if (!this.movimiento) {
      this.movimiento = setInterval(() => {
        this.y += velocidad;
        if (this.y > document.body.clientHeight - altoPaletas)
          this.y = document.body.clientHeight - altoPaletas;
        this.element.style.top = this.y + "px";
      }, 10);
    }
  }

  subir() {
    if (!this.movimiento) {
      this.movimiento = setInterval(() => {
        this.y += velocidad * -1;
        if (this.y < 0) this.y = 0;
        this.element.style.top = this.y + "px";
      }, 10);
    }
  }

  freeze() {
    if (this.movimiento) {
      clearInterval(this.movimiento);
      this.movimiento = false;
    }
  }

  toggleCPU(disable = false) {
    if (!this.cpu && disable === false) {
      this.freeze();
      this.cpu = setInterval(() => {
        if (bola) {
          const centroPaleta = this.y + altoPaletas / 2;
          console.log(
            Math.abs(bola.y + anchoBola / 2 - centroPaleta),
            centroPaleta
          );
          this.freeze();
          if (
            Math.abs(bola.y + anchoBola / 2 - centroPaleta) <
            anchoPaletas / 2
          ) {
            console.log("NADA");
          } else if (bola.y + anchoBola / 2 < centroPaleta) {
            this.subir();
            console.log("SUBO");
          } else {
            this.bajar();
            console.log("BAJO");
          }
        } else this.reset();
      }, 40);
    } else {
      clearInterval(this.movimiento);
      this.movimiento = false;
      clearInterval(this.cpu);
      this.cpu = false;
    }
  }

  reset() {
    this.freeze();
    this.y = document.body.clientHeight / 2 - this.tamaño;
    this.element.style.top = this.y + "px";
  }
}

class Bola {
  x;
  y;

  dx = -15;
  dy = 0;
  element;
  movimiento;
  efectoPuntas = 5;

  constructor() {
    this.element = document.createElement("div");
    this.element.classList = "bola";
    zonaJuego.appendChild(this.element);
    this.element.style.width = anchoBola + "px";
    this.resetPosición();
    this.mover();
  }

  mover() {
    if (!this.movimiento) {
      this.movimiento = setInterval(() => {
        this.x += this.dx;
        this.y += this.dy;
        //Paletas
        //Paleta izquierda
        if (
          this.x < 0 + anchoPaletas &&
          this.y + anchoBola / 2 + margenAyuda > j1.y &&
          this.y - anchoBola / 2 - margenAyuda < j1.y + altoPaletas
        ) {
          this.setBolaY(j1);
          this.dx = this.dx * -1;
          this.x += this.dx;
          audioHit.play();
        }
        //Paleta derecha
        else if (
          this.x > document.body.clientWidth - anchoPaletas - anchoBola &&
          this.y + anchoBola / 2 + margenAyuda > j2.y &&
          this.y - anchoBola / 2 - margenAyuda < j2.y + altoPaletas
        ) {
          this.setBolaY(j2);
          this.dx = this.dx * -1;
          this.x += this.dx;
          audioHit.play();
        }

        //Rebote horizontal (punto)
        else if (this.x < 0 || this.x > document.body.clientWidth - anchoBola) {
          if (this.x < 100) sumarPunto(2);
          else sumarPunto(1);
          this.resetPosición();
        }

        //Rebote vertical
        if (this.y < 0 || this.y > document.body.clientHeight - anchoBola) {
          this.dy = this.dy * -1;
          this.y += this.dy;
        }

        this.element.style.left = this.x + "px";
        this.element.style.top = this.y + "px";
      }, 20);
    }
  }

  eliminar() {
    clearInterval(this.movimiento);
    estadoJuego = "PAUSE";
    zonaJuego.removeChild(this.element);
  }

  resetPosición() {
    this.x = document.body.clientWidth / 2 - anchoBola / 2;
    this.y = document.body.clientHeight / 2 - anchoBola / 2;
    this.element.style.left += this.x + "px";
    this.element.style.top += this.y + "px";
  }

  setBolaY(player) {
    const parteGolpeada = (this.y + anchoBola / 2 - player.y) / altoPaletas;
    if (parteGolpeada < 0.4) {
      this.dy -= (parteGolpeada ^ 2) * this.efectoPuntas;
    } else if (parteGolpeada < 0.6) {
      this.dy = -1 * this.dy;
    } else {
      this.dy += ((parteGolpeada - 0.4) ^ 2) * this.efectoPuntas;
    }
  }
}

class Tablero {
  element;
  p1Score = 0;
  p1Score = 2;

  constructor() {
    this.element = document.createElement("p");
    this.element.id = "tablero";
    zonaJuego.appendChild(this.element);
    this.reset();
  }

  reset() {
    this.p1Score = 0;
    this.p2Score = 0;
    this.actualizarTexto();
  }

  actualizarTexto() {
    this.element.textContent = this.p1Score + " - " + this.p2Score;
  }

  sumar(p) {
    if (p === 1) this.p1Score++;
    else this.p2Score++;
    this.actualizarTexto();
    if (this.p1Score >= limitePuntos) ganar(1);
    if (this.p2Score >= limitePuntos) ganar(2);
  }
}

//Control de teclado
document.addEventListener("keydown", (e) => {
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
    case "1":
      j1.toggleCPU();
      break;
    case "2":
      j2.toggleCPU();
      break;
    case " ":
      if (!bola) comenzarJuego();
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

function comenzarJuego() {
  mensajeElement.textContent = "";
  if (estadoJuego === "END") tablero.reset();
  estadoJuego = "PLAY";
  bola = new Bola();
  tablero.element.classList.toggle("titilar", false);
  puntoJson.classList.toggle("escondido", true);
  instrucciones.classList.toggle("escondido", true);
}

function sumarPunto() {
  bola.eliminar();
  bola = undefined;
  mensajeElement.textContent = "Presione espacio para continuar";
  audioPunto.currentTime = 0;
  audioPunto.play();
  tablero.sumar(2);
}

function ganar(p) {
  tablero.element.classList.toggle("titilar", true);
  j1.toggleCPU(true);
  j2.toggleCPU(true);
  estadoJuego = "END";
  mensajeElement.textContent = "¡Jugador " + p + " gana!";
  puntoJson.classList.toggle("escondido", false);
}

//Ejecución
const tablero = new Tablero();
const j1 = new Jugador("jugador1");
const j2 = new Jugador("jugador2");
let bola;
