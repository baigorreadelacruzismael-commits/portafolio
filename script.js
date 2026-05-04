let esAdmin = false;
let semanas = [];
const SUPABASE_URL = "https://ffqfeazjozckcvphxycf.supabase.co";
const SUPABASE_KEY = "sb_publishable_jkBaGuhyDYAoz4uN-IA03Q_vo1MVR9U";
// LOGIN
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

let esAdmin = false;

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
    mostrarBotonSalir();
    cargarSemanas();
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
  document.getElementById("btnSalir")?.remove();
  cargarSemanas();
}

// CARGAR DESDE SUPABASE
async function cargarSemanas() {
  const { data, error } = await supabase.from("semanas").select("*");

  if (error) {
    console.log(error);
    return;
  }

  const contenedor = document.getElementById("contenedor-semanas");
  contenedor.innerHTML = "";

  data.forEach((s, i) => crearSemana(s, i));
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

    ${esAdmin ? `<br><button class="eliminar">🗑️</button>` : ""}
  `;

  if (esAdmin) {
    div.querySelector(".eliminar").onclick = async () => {
      await supabase.from("semanas").delete().eq("id", s.id);
      cargarSemanas();
    };
  }

  contenedor.appendChild(div);
}

// AGREGAR SEMANA (PDF)
async function agregarSemana() {
  const titulo = prompt("Nombre de la semana:");

  const input = document.createElement("input");
  input.type = "file";
  input.accept = "application/pdf";
  input.click();

  input.onchange = async () => {
    const file = input.files[0];
    const nombre = Date.now() + "_" + file.name;

    const { error } = await supabase
      .storage
      .from("archivos")
      .upload(nombre, file);

    if (error) {
      alert("Error subiendo PDF");
      return;
    }

    const { data } = supabase.storage.from("archivos").getPublicUrl(nombre);

    await supabase.from("semanas").insert([
      {
        titulo: titulo,
        pdf_url: data.publicUrl,
        imagen: ""
      }
    ]);

    cargarSemanas();
  };
}

// INICIAR
cargarSemanas();
