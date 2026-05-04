let esAdmin = false;
let semanas = [];
const SUPABASE_URL = "https://ffqfeazjozckcvphxycf.supabase.co";
const SUPABASE_KEY = "sb_publishable_jkBaGuhyDYAoz4uN-IA03Q_vo1MVR9U";
// LOGIN
function mostrarLogin() {
  document.getElementById("login").style.display = "flex";
}

function cerrarLogin() {
  document.getElementById("login").style.display = "none";
}

function login() {
  const user = document.getElementById("user").value;
  const pass = document.getElementById("pass").value;

  if (user === "admin" && pass === "1234") {
    esAdmin = true;
    cerrarLogin();

    document.getElementById("btnAgregar").style.display = "inline-block";
    document.getElementById("btnImagenGlobal").style.display = "inline-block";

    mostrarBotonSalir();
    render();
  } else {
    alert("Datos incorrectos");
  }
}

// SALIR
function mostrarBotonSalir() {
  let btn = document.getElementById("btnSalir");

  if (!btn) {
    btn = document.createElement("button");
    btn.id = "btnSalir";
    btn.textContent = "🚪 Salir";
    btn.onclick = cerrarSesion;

    document.querySelector(".usuario").appendChild(btn);
  }
}

function cerrarSesion() {
  esAdmin = false;
  document.getElementById("btnAgregar").style.display = "none";
  document.getElementById("btnImagenGlobal").style.display = "none";
  document.getElementById("btnSalir")?.remove();
  render();
}

// AGREGAR SEMANA
function agregarSemana() {
  const titulo = prompt("Nombre de la semana:");
  let link = prompt("Link del PDF:");

  if (!link) return;

  if (link.includes("drive.google.com")) {
    link = link.replace("/view", "/preview");
  }

  semanas.push({
    titulo,
    pdf_url: link,
    imagen: ""
  });

  guardar();
  render();
}

// AGREGAR IMAGEN
function agregarImagenSemana() {
  let index = prompt("Número de semana (ej: 1, 2, 3):");

  if (!index) return;

  index = parseInt(index.trim());

  if (isNaN(index) || index < 1 || index > semanas.length) {
    alert("Número inválido ❌");
    return;
  }

  let imgLink = prompt("Link de la imagen:");
  if (!imgLink) return;

  if (imgLink.includes("drive.google.com")) {
    const id = imgLink.split("/d/")[1]?.split("/")[0];
    if (id) {
      imgLink = `https://drive.google.com/uc?export=view&id=${id}`;
    }
  }

  semanas[index - 1].imagen = imgLink;

  guardar();
  render();
}

// CREAR UI
function crearSemana(s, index) {
  const contenedor = document.getElementById("contenedor-semanas");

  const div = document.createElement("div");
  div.classList.add("semana");

  div.innerHTML = `
    <h3>${s.titulo}</h3>

    <div class="contenido-semana">
      <iframe src="${s.pdf_url}"></iframe>

      ${s.imagen 
        ? `<img src="${s.imagen}" class="imagen-semana">`
        : `<div class="imagen-semana"></div>`
      }
    </div>

    <a href="${s.pdf_url}" target="_blank" class="descargar">⬇️ Descargar</a>

    ${esAdmin ? `<br><button class="eliminar">🗑️ Eliminar</button>` : ""}
  `;

  if (esAdmin) {
    div.querySelector(".eliminar").onclick = () => {
      semanas.splice(index, 1);
      guardar();
      render();
    };
  }

  contenedor.appendChild(div);
}

// GUARDAR
function guardar() {
  localStorage.setItem("semanas", JSON.stringify(semanas));
}

// CARGAR
function cargar() {
  const data = localStorage.getItem("semanas");
  if (data) semanas = JSON.parse(data);
}

// RENDER
function render() {
  const contenedor = document.getElementById("contenedor-semanas");
  contenedor.innerHTML = "";

  semanas.forEach((s, i) => crearSemana(s, i));
}

// INICIO
cargar();
render();