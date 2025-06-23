
  

import Toastify from 'toastify-js';



//SIMULADOR CARRITO DE COMPRAS//
//Agregamos el evento click al boton agregar al carrito//
        //dentro del boton agregar al carrito, especificamente despues del click va la funcion fetch agregarProducto//
        const botonAgregar = div.querySelector(".btn-agregaralcarrito");

        botonAgregar.addEventListener("click", () => {
          agregarProducto(carritoVacio, producto);
          renderizarCarrito();
          Toastify({
            text: `Producto ${producto.nombre} agregado al carrito`,
            duration: 3000,
            gravity: "bottom",
            position: "right",
            style: {
              background: "linear-gradient(to right, #00b09b, #96c93d)",
            },
          }).showToast();
        }););

      //Agregamos un evento al boton Calcular total//
      const btnCalcularTotal = document.querySelector("btn-calcular-total");
      btnCalcularTotal.addEventListener("click", () => {
        //Simulamos una peticion para calcular el total de la compra//
        simularFetchCalcularTotal(carritoVacio).then(response => {
            if (response.ok) {
                response.json().then(data => {
                    total = data.total;
                    Toastify({
                        text: `El total de su compra es: $${total}`,
                        duration: 3000,
                        gravity: "bottom",
                        position: "right",
                        style: {
                            background: "linear-gradient(to right, #00b09b, #96c93d)",
                        },
                    }).showToast();
                });
            } else {
                Toastify({
                    text: "Error al calcular el total",
                    duration: 3000,
                    gravity: "bottom",
                    position: "right",
                    style: {
                        background: "linear-gradient(to right, #ff0000, #ff7f00)",
                    },
                }).showToast();
            }
        });
      });
      //agregamos un evento al boton Finalizar compra//
      const btnFinalizarCompra = document.querySelector("btn-finalizar-compra");
      btnFinalizarCompra.addEventListener("click", () => {
        //Simulamos una peticion para finalizar la compra//
        simularFetchFinalizarCompra().then(response => {
            if (response.ok) {
                response.json().then(data => {
                    Toastify({
                        text: data.mensaje,
                        duration: 3000,
                        gravity: "bottom",
                        position: "right",
                        style: {
                            background: "linear-gradient(to right, #00b09b, #96c93d)",
                        },
                    }).showToast();
                    //Vaciamos el carrito despues de finalizar la compra//
                    carritoVacio = [];
                    renderizarCarrito();
                });
            } else {
                Toastify({
                    text: "Error al finalizar la compra",
                    duration: 3000,
                    gravity: "bottom",
                    position: "right",
                    style: {
                        background: "linear-gradient(to right, #ff0000, #ff7f00)",
                    },
                }).showToast();
            }
        });
      });

          //Mostramos los productos en el html//
      const contenedorProductos = document.querySelector("contenedor-productos");
      const btnAgregarAlCarrito = document.querySelector(".btn-agregaralcarrito");
      
      //Recorremos un array productosArtesanales
      productosArtesanales.forEach((producto) => {
        const div = document.createElementById("div");
        div.classList.add("producto");
        div.innerHTML = `
          <img src="${producto.imagen}" alt="${producto.nombre}">
          <h3>${producto.nombre}</h3>
          <p>Precio: $${producto.precio}</p>
          <p>Stock: ${producto.stock}</p>
          <button class="btn-agregaralcarrito">Agregar al carrito</button>
        `;
        contenedorProductos.appendChild(div);
      });

      //Paso 0: Definimos una funcion para mostrar mensajes de toastify//
      function showToast(message) {
        Toastify({
          text: message,
          duration: 3000,
          gravity: "bottom",
          position: "right",
          style: {
            background: "linear-gradient(to right, #00b09b, #96c93d)",
          },
        }).showToast();
      }

  //Declaramos variables y constantes//
  //Variables globales//
  const maxProductos = 5;
  //Variables para el total y la cantidad de productos//
  let total = 0;
  let cantidadProductos = 0;

  // Paso 2:Creamos una lista de productos disponibles y lo pasamos a JSON//
  productosDisponibles =

 [
  {
    "id": 1,
    "nombre": "Cuenco de ceramica hojas",
    "precio": 15000,
    "stock": 1,
    "imagen": "../assets/imagenes/cuenco-ceramica-hojas.jpg"
  },
  {
    "id": 2,
    "nombre": "Bandeja de ceramica rectangular",
    "precio": 10000,
    "stock": 1,
    "imagen": "../assets/imagenes/bandeja-ceramica-rectangular.jpg"
  },
  {
    "id": 3,
    "nombre": "Taza de ceramica",
    "precio": 6000,
    "stock": 2,
    "imagen": "../assets/imagenes/taza-ceramica.jpg"
  },
  {
    "id": 4,
    "nombre": "Posa cuchara Frida Kahlo",
    "precio": 18000,
    "stock": 1,
    "imagen": "assets/imagenes/posa-cuchara-frida-kahlo.jpg"
  },
  {
    "id": 5,
    "nombre": "Posa cuchara flor azul",
    "precio": 15000,
    "stock": 1,
    "imagen": "../assets/imagenes/posa-cuchara-flor-azul.jpg"
  }
]


     //Paso 3: Declaramos una variable para almacenar el carrito de compras//
     let carritoVacio = [];

     //Paso 4: Renderizamos la lista Producto en el HTML//
     function renderizarProductos() {
        const contenedorProductos = document.getElementById("contenedor-productos");
        //Limpiamos el contenedor antes de renderizar los productos//
        contenedorProductos.innerHTML = "";
     }

// paso 5: Declaramos funciones//

  function agregarProducto(carritoVacio) {
    //Paso 5: Función para agregar productos al carrito//
    //Pregunta al usuario que producto desea agregar al carrito//
    let pregunta = showToast("Ingrese el ID del producto que desea agregar al carrito (o 0 para cancelar):");

    //Si el usuario ingresa 0, cancela la operacion y sale de la funcion//
    if (pregunta === "0" || pregunta === null || pregunta.trim() === "") {
      showToast("Operacion cancelada");
      return carritoVacio; //termina la funcion y devuelve el carrito//
    }

    //Convierte la respuesta del usuario a un numero//
    pregunta = Number(pregunta);

    //Verifica si el id ingresado es un numero valido//
    if (isNaN(pregunta) || pregunta <= 0) {
      showToast("Por favor, ingrese un ID valido");
      return carritoVacio; //termina la funcion y devuelve el carrito//
    }

//Recorre cada producto en el array productos usando un bucle for in//
    for (let i = 0; i < productosDisponibles.length; i++) {
      //Verifica si el id ingresado coincide con el id de un producto//
      if (productosDisponibles[i].id === pregunta) {
        //Verifica si el producto ya esta en el carrito//
        const productoExistente = carritoVacio.find(producto => producto.id === productosDisponibles[i].id);
        if (productoExistente) {
          showToast("El producto ya esta en el carrito");
          return carritoVacio; //termina la funcion y devuelve el carrito//
        }
        //Verifica si hay stock disponible del producto//
        if (productosDisponibles[i].stock <= 0) {
          showToast("No hay stock disponible del producto");
          return carritoVacio; //termina la funcion y devuelve el carrito//
        }
        //Agrega el producto al carrito//
        carritoVacio.push(productosDisponibles[i]);
        cantidadProductos++;
        showToast("Producto agregado al carrito: " + productosDisponibles[i].nombre);
        renderizarProductos();
        break; //sale del bucle for in una vez que se agrega el producto al carrito//
      }
     
    }
    //Verifica si se alcanzo el limite maximo de productos//
    if (cantidadProductos >= maxProductos){
      showToast("Limite de productos alcanzado");
      return carritoVacio; //termina la funcion y devuelve el carrito//
    }
  } while (pregunta !== 0);

    //Funciones para eliminar producto, calcular total, finalizar compra//

    function eliminarProducto(carritoVacio, id) {
      const index = carritoVacio.findIndex(producto => producto.id === id);
      if (index !== -1) {
        carritoVacio.splice(index, 1);
      }
      return carritoVacio;
    }
    //Funcion para calcular el total de la compra//

    function calcularTotal(carritoVacio) {
      const total = carritoVacio.reduce((acum, producto) => acum + producto.precio, 0);
      showToast("El total de su compra es: ", total);
      return total;
    }

    //Funciones para finalizar compra//

    function finalizarCompra(carritoVacio) {
      if (carritoVacio.length === 0) {
        showToast("El carrito esta vacio, no se puede finalizar la compra");
        return;
      }
      //Simulamos una peticion para finalizar la compra//
      simularFetchFinalizarCompra().then(response => {
        if (response.ok) {
          response.json().then(data => {
            alert(data.mensaje);
            //Vaciamos el carrito despues de finalizar la compra//
            carritoVacio = [];
            renderizarCarrito();
          });
        } else {
          showToast("Error al finalizar la compra");
        }
      }
      );
    }

//paso 6: renderizamos el carrito de compras en el HTML//
    function renderizarCarrito() {
      const contenedorCarrito = document.querySelector("#contenedor-carrito");
      contenedorCarrito.innerHTML = ""; // Limpiamos el contenedor antes de renderizar el carrito
      if (carritoVacio.length === 0) {
        contenedorCarrito.innerHTML = "<p>El carrito esta vacio</p>";
        return;
      }
      // Recorremos el carrito y mostramos los productos
      carritoVacio.forEach((producto) => {
        const div = document.createElement("div");
        div.classList.add("producto-carrito");
        div.innerHTML = `
          <img src="${producto.imagen}" alt="${producto.nombre}">
          <h3>${producto.nombre}</h3>
          <p>Precio: $${producto.precio}</p>
          <p>Stock: ${producto.stock}</p>
          <button class="btn-eliminar-producto" data-id="${producto.id}">Eliminar</button>
        `;
        contenedorCarrito.appendChild(div);
      });
      // Agregamos el evento click al boton eliminar producto
      const btnEliminarProducto = document.getElementsByClassName(".btn-eliminar-producto");
      btnEliminarProducto.forEach((btn) => {
        btn.addEventListener("click", (e) => {
          const idProducto = Number(e.target.getAttribute("data-id"));
          eliminarProducto(carritoVacio, idProducto);
          renderizarCarrito();
          Toastify({
            text: `Producto con ID ${idProducto} eliminado del carrito`,
            duration: 3000,
            gravity: "bottom",
            position: "right",
            style: {
              background: "linear-gradient(to right, #ff0000, #ff7f00)",
            },
          }).showToast();
        });
      });
    }
    //agregamos un evento al boton vaciar carrito//
    const btnVaciarCarrito = document.getElementsByClassName("btn-vaciar-carrito");
    btnVaciarCarrito.addEventListener("click", () => {
      //Simulamos una peticion para vaciar el carrito//
      simularFetchVaciarCarrito().then(response => {
        if (response.ok) {
          response.json().then(data => {
            Toastify({
              text: data.mensaje,
              duration: 3000,
              gravity: "bottom",
              position: "right",
              style: {
                background: "linear-gradient(to right, #ff0000, #ff7f00)",
              },
            }).showToast();
            //Vaciamos el carrito despues de finalizar la compra//
            carritoVacio = [];
            renderizarCarrito();
          });
        } else {
          Toastify({
            text: "Error al vaciar el carrito",
            duration: 3000,
            gravity: "bottom",
            position: "right",
            style: {
              background: "linear-gradient(to right, #ff0000, #ff7f00)",
            },
          }).showToast();
        }
      });
    });
    //paso 7: Simulamos una peticion para mostrar el carrito de compras//

Clase Producto para estructurar los datos.
 */
function Producto(id, nombre, precio, stock, imagen) {
    this.id = id;
    this.nombre = nombre;
    this.precio = precio;
    this.stock = stock;
    this.imagen = imagen;
}

/**
 * Simula una llamada asíncrona a una API para obtener productos.
 * Retorna una Promesa que resuelve con el array de productos.
 * @returns {Promise<Array<Producto>>} Una promesa que se resuelve con la lista de productos.
 */
async function obtenerProductosAsync() {
    // Datos de productos que serían obtenidos de una API
    const productosJson = [
        {
            "id": 1,
            "nombre": "Cuenco de ceramica hojas",
            "precio": 15000,
            "stock": 1,
            "imagen": "https://placehold.co/300x200/a3e635/000?text=Cuenco+Hojas"
        },
        {
            "id": 2,
            "nombre": "Bandeja de ceramica rectangular",
            "precio": 10000,
            "stock": 1,
            "imagen": "https://placehold.co/300x200/22d3ee/000?text=Bandeja+Rectangular"
        },
        {
            "id": 3,
            "nombre": "Taza de ceramica",
            "precio": 6000,
            "stock": 2,
            "imagen": "https://placehold.co/300x200/fde047/000?text=Taza+Ceramica"
        },
        {
            "id": 4,
            "nombre": "Posa cuchara Frida Kahlo",
            "precio": 18000,
            "stock": 1,
            "imagen": "https://placehold.co/300x200/f87171/000?text=Posa+Frida"
        },
        {
            "id": 5,
            "nombre": "Posa cuchara flor azul",
            "precio": 15000,
            "stock": 1,
            "imagen": "https://placehold.co/300x200/818cf8/000?text=Posa+Flor+Azul"
        }
    ];

    return new Promise(resolve => {
        // Simula un retardo de red de 1 segundo
        setTimeout(() => {
            const productosInstanciados = productosJson.map(p =>
                new Producto(p.id, p.nombre, p.precio, p.stock, p.imagen)
            );
            resolve(productosInstanciados);
        }, 1000);
    });
}

// --- Ejemplo de uso de la función asíncrona ---
async function inicializarTienda() {
    console.log("Iniciando carga de productos...");
    try {
        const productos = await obtenerProductosAsync();
        console.log("Productos cargados exitosamente:", productos);

        // Aquí podrías llamar a una función para renderizar los productos en tu UI
        // Por ejemplo: renderizarProductos(productos);
    } catch (error) {
        console.error("Error al cargar los productos:", error);
    }
    console.log("Carga de productos finalizada.");
}

// Llama a la función para inicializar la tienda al cargar la página
inicializarTienda();
