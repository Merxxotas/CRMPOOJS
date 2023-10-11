(function () {
  let DB;
  let idCliente;
  const nombreInput = document.querySelector("#nombre");
  const emailInput = document.querySelector("#email");
  const empresaInput = document.querySelector("#empresa");
  const telefonoInput = document.querySelector("#telefono");
  const formulario = document.querySelector("#formulario");
  document.addEventListener("DOMContentLoaded", () => {
    conectarDB();
    //actualizar el registro
    formulario.addEventListener("submit", actualizarCliente);
    //verificando el ID de la URL para cada cliente
    const parametrosURL = new URLSearchParams(window.location.search);
    idCliente = parametrosURL.get("id");
    // console.log(idCliente);
    if (idCliente) {
      setTimeout(() => {
        obtenerCliente(idCliente);
      }, 1000);
    }
  });

  function conectarDB() {
    // ABRIR CONEXIÓN EN LA BD:

    let abrirConexion = window.indexedDB.open("crm", 1);

    // si hay un error, lanzarlo
    abrirConexion.onerror = function () {
      console.log("Hubo un error");
    };

    // si todo esta bien, asignar a database el resultado
    abrirConexion.onsuccess = function () {
      // guardamos el resultado
      DB = abrirConexion.result;
    };
  }

  function obtenerCliente(id) {
    // console.log(id);
    const transaction = DB.transaction(["crm"], "readwrite");
    const objectStore = transaction.objectStore("crm");
    const cliente = objectStore.openCursor();
    cliente.onsuccess = function (e) {
      const cursor = e.target.result;
      if (cursor) {
        if (cursor.value.id === Number(id)) {
          //   console.log(cursor.value);
          llenarFormulario(cursor.value);
        }
        cursor.continue();
      }
    };
  }

  function llenarFormulario(datosCliente) {
    const { nombre, email, empresa, telefono } = datosCliente;
    nombreInput.value = nombre;
    emailInput.value = email;
    empresaInput.value = empresa;
    telefonoInput.value = telefono;
  }

  function actualizarCliente(e) {
    e.preventDefault();
    if (
      nombreInput.value === "" ||
      emailInput.value === "" ||
      telefonoInput.value === "" ||
      empresaInput.value === ""
    ) {
      imprimirAlerta("Todos los campos son obligatorios", "error");
      return;
    }

    //actualizar cliente
    const clienteActualizado = {
      nombre: nombreInput.value,
      email: emailInput.value,
      telefono: telefonoInput.value,
      empresa: empresaInput.value,
      //   id: idCliente,
      id: Number(idCliente),
    };
    // console.log(clienteActualizado);
    const transaction = DB.transaction(["crm"], "readwrite");
    const objectStore = transaction.objectStore("crm");
    objectStore.put(clienteActualizado);
    transaction.oncomplete = function () {
      imprimirAlerta("El cliente se ha editado de manera correcta");
      setTimeout(() => {
        window.location.href = "index.html";
      }, 3000);
    };
    transaction.onerror = function () {
      imprimirAlerta("Hubo un error al editar el cliente", "error");
    };
  }
})();
