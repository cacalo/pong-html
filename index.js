const zonaJuego = document.getElementById("zonaJuego");
let bola;
const mensajeElement = document.getElementById("mensaje");
const instruccionesElement = document.getElementById("instrucciones");
estadoJuego = "PAUSE";


class Paleta {
  element;
  y = 0;
  velocidad = 15;
  movimiento;
  alto = 200;
  ancho= 20;
  cpu;

  constructor() {
    this.element = document.createElement("div");
    this.element.classList = "paleta";
    zonaJuego.children[0].appendChild(this.element);
    this.resetPosicion()
  }

  subir() {
    if (!this.movimiento) {
      this.movimiento = setInterval(() => {
        this.y -= this.velocidad;
        if (this.y < 0) {
          this.y = 0;
          this.freeze();
        }
        this.element.style.top = this.y + "px";
      }, 20);
    }
  }

  bajar() {
    if (!this.movimiento) {
      this.movimiento = setInterval(() => {
        this.y += this.velocidad;
        const limite = document.body.clientHeight - this.alto;
        if (this.y > limite) {
          this.y = limite;
          this.freeze();
        }
        this.element.style.top = this.y + "px";
      }, 20);
    }
  }

  freeze() {
    clearInterval(this.movimiento);
    this.movimiento = undefined;
  }

  resetPosicion(){
    this.freeze();
    this.y = document.body.clientHeight/2 - this.alto/2;
    this.element.style.top = this.y + "px";
  }

  toggleCPU(){
    if(this.cpu){
      clearInterval(this.cpu)
      clearInterval(this.movimiento)
      this.movimiento=undefined;
      this.cpu = undefined
    } else {
      this.cpu = setInterval(()=>{
        if(!bola) return;
        if(bola.getCentro() > this.y + this.alto/3 &&
          bola.getCentro() < this.y + this.alto/3*2
        ){
          this.freeze();
        }
        else if(bola.getCentro() < this.getCentro()){
          this.subir();
        }
        else if(bola.getCentro() > this.getCentro()){
          this.bajar();
        }
      },20 )
    }
  }

  getCentro(){
    return this.y + this.alto/2;
  }
}

class Bola {
  x;
  y;
  dx = -20;
  dy = 0;
  ancho= 30;
  movimiento;

  constructor() {
    this.element = document.createElement("div");
    this.element.classList = "bola";
    zonaJuego.appendChild(this.element);
    this.resetPosicion();
    this.mover()
    mensajeElement.classList = "escondido";
    instruccionesElement.classList.toggle("escondido",true);
  }


  resetPosicion(){
    this.x = document.body.clientWidth/2 - this.ancho/2;
    this.element.style.left = this.x+"px";
    this.y = document.body.clientHeight/2 - this.ancho/2;
    this.element.style.top = this.y+"px";
  }

  mover(){
    if(!this.movimiento ){
    this.movimiento = setInterval(()=>{
      //Movimiento horizontal
      this.x += this.dx;

      //Choque con paletas
      //Paleta J1
      if(this.x < 0+j1.ancho &&
        this.y + this.ancho/2 > j1.y &&
        this.y + this.ancho/2 < j1.y + j1.alto
        ){
          this.dy += this.obtenerVariacionY(j1)
        this.dx = this.dx*-1; 
      }
      //Paleta j2
      if(this.x + this.ancho > document.body.clientWidth-j2.ancho &&
        this.y + this.ancho/2 > j2.y &&
        this.y + this.ancho/2 < j2.y + j2.alto
        ){
        this.dy += this.obtenerVariacionY(j2)
        this.dx = this.dx*-1; 
      }

      //Meter punto
      if(this.x < 0 || this.x > document.body.clientWidth - this.ancho){
        tablero.sumar(this.x < 100 ? 2 : 1);
      }
      this.element.style.left = this.x+"px";


      //Movimiento vertical
      this.y += this.dy;
      if(this.y < 0 || this.y > document.body.clientHeight - this.ancho){
        this.dy = this.dy*-1; 
      }
      this.element.style.top = this.y+"px";
    } ,20)
  }
  }

  eliminar(){
    clearInterval(this.movimiento);
    zonaJuego.removeChild(this.element)
    bola = undefined;
  }

  obtenerVariacionY(j){
    const diferencia = this.getCentro() - j.getCentro();
    return diferencia / 10;
  }

  getCentro(){
    return this.y + this.ancho/2;
  }

}

class Tablero{
  j1Score = 0;
  j2Score = 0;
  puntajeMaximo = 6;

  constructor() {
    this.element = document.createElement("p");
    this.element.id = "tablero";
    zonaJuego.appendChild(this.element);
    this.actualizarTexto();
  }

  actualizarTexto(){
    this.element.textContent = this.j1Score+" - "+this.j2Score;
  }

  sumar(p){
    if(p === 1) this.j1Score++
    else this.j2Score++
    this.actualizarTexto()
    bola.eliminar();
    j1.resetPosicion();
    j2.resetPosicion();
    mensajeElement.textContent = 'Presiona "espacio" para continuar';
    mensajeElement.classList.toggle("escondido",false);
    this.estadoJuego = "PAUSE";
    if(this.j1Score >= this.puntajeMaximo){
      this.ganar(1)
    }
    else if(this.j2Score >= this.puntajeMaximo){
      this.ganar(2)
    }
  }

  ganar(p){
    mensajeElement.textContent = 'Ganó jugador Nº'+p;
    mensajeElement.classList.toggle("titilar",true);
    estadoJuego = "END";
  }

  reset(){
    this.j1Score = 0;
    this.j2Score = 0;
    this.actualizarTexto();
    mensajeElement.classList.toggle("titilar",false);
  }

}

document.addEventListener("keydown", (e) => {
  // console.log(e);
  switch (e.key) {
    case "w":
      j1.subir();
      break;
    case "s":
      j1.bajar();
      break;
    case "ArrowUp":
      j2.subir();
      break;
    case "ArrowDown":
      j2.bajar();
      break;
    case "1":
      j1.toggleCPU();
      break;
    case "2":
      j2.toggleCPU();
      break;
    case " ":
      if(estadoJuego === "END") tablero.reset();
      if(!bola) bola = new Bola();
      estadoJuego = "PLAY";
      break;
    }
  }
);

document.addEventListener("keyup", (e) => {
  switch (e.key) {
    case "w":
    case "s":
      j1.freeze();
      break;

    case "ArrowUp":
    case "ArrowDown":
      j2.freeze();
      break;
  }
});

const j1 = new Paleta();
const j2 = new Paleta();

const tablero = new Tablero();