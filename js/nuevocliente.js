(function () {
  let DB;

  const formulario = document.querySelector("#formulario");

  document.addEventListener("DOMContentLoaded", () => {
    formulario.addEventListener("submit", validarCliente);

    conectarDB();
  });

  function conectarDB() {
    // ABRIR CONEXIÓN EN LA BD:

    let abrirConexion = window.indexedDB.open("crm", 1);

    // si hay un error, lanzarlo
    abrirConexion.onerror = function () {
      console.error("Hubo un error");
    };

    // si todo esta bien, asignar a database el resultado
    abrirConexion.onsuccess = function () {
      // guardamos el resultado
      DB = abrirConexion.result;
    };
  }

  function validarCliente(e) {
    e.preventDefault();
    // console.log("validando...");
    //Leyendo todos los inputs del formulario
    const nombre = document.querySelector("#nombre").value;
    const email = document.querySelector("#email").value;
    const telefono = document.querySelector("#telefono").value;
    const empresa = document.querySelector("#empresa").value;

    if (nombre === "" || email === "" || telefono === "" || empresa === "") {
      imprimirAlerta("Todos los campos son obligatorios", "error");
      return;
    }

    //crear un objeto con la informacion
    const cliente = {
      nombre,
      email,
      telefono,
      empresa,
    };
    cliente.id = Date.now();
    crearNuevoCliente(cliente);
  }

  function crearNuevoCliente(cliente) {
    const transaction = DB.transaction(["crm"], "readwrite");
    const objectStore = transaction.objectStore("crm");
    objectStore.add(cliente);

    transaction.onerror = function () {
      imprimirAlerta("Hubo un error agregando el cliente", "error");
      //   console.log("Hubo un error agregando el cliente");
    };

    transaction.oncomplete = function () {
      imprimirAlerta("El cliente se agregó correctamente");
      setTimeout(() => {
        window.location.href = "index.html";
      }, 3000);
      //   console.log("Cliente agregado correctamente");
    };
  }
})();
