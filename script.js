
// Este archivo contiene la lógica JavaScript para la aplicación del carrito de compras.
// Define una función mock para fetch que simula una respuesta de red.
// Esto permite "reemplazar" las Promises directas con una llamada a 'fetch' simulada.
async function mockFetch(url, options = {}) {
    return new Promise(resolve => {
        setTimeout(() => {
            let responseData = {};
            let okStatus = true;
            let message = "";

            // Lógica para simular diferentes respuestas basadas en la URL
            if (url.includes("agregarProducto")) {
                const producto = options.body ? JSON.parse(options.body) : {};
                message = `Producto "${producto.nombre}" agregado al carrito`;
                responseData = { mensaje: message };
            } else if (url.includes("calcularTotal")) {
                const carrito = options.body ? JSON.parse(options.body) : [];
                const total = carrito.reduce((acc, prod) => acc + prod.precio, 0);
                responseData = { total: total };
            } else if (url.includes("finalizarCompra")) {
                message = "¡Compra finalizada con éxito!";
                responseData = { mensaje: message };
            } else if (url.includes("vaciarCarrito")) {
                message = "Carrito vaciado correctamente.";
                responseData = { mensaje: message };
            } else {
                okStatus = false;
                message = "Endpoint simulado no reconocido.";
                responseData = { error: message };
            }

            // Resuelve la promesa con un objeto que imita la respuesta de un fetch real
            resolve({
                ok: okStatus,
                status: okStatus ? 200 : 400,
                json: async () => responseData, // Devuelve una Promise que resuelve con los datos
                text: async () => JSON.stringify(responseData) // Para simular .text()
            });
        }, 300); // Retraso simulado
    });
}

// Ahora, las funciones de simulación utilizarán el mockFetch
async function simularFetchAgregarProducto(producto) {
    return await mockFetch('/api/agregarProducto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(producto)
    });
}

async function simularFetchCalcularTotal(carrito) {
    return await mockFetch('/api/calcularTotal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(carrito)
    });
}

async function simularFetchFinalizarCompra() {
    return await mockFetch('/api/finalizarCompra', { method: 'POST' });
}

async function simularFetchVaciarCarrito() {
    return await mockFetch('/api/vaciarCarrito', { method: 'POST' });
}


/**
 * Obtiene la lista de productos disponibles desde el archivo 'productos.json'.
 * Esta función ahora utiliza una llamada fetch real.
 * @returns {Promise<Object>} Una promesa que se resuelve con la respuesta de fetch.
 */
async function obtenerProductosDisponiblesDesdeJson() {
    try {
        // Llamada fetch real al archivo productos.json
        const response = await fetch('../productos.json'); // Ajusta la ruta si productos.json está en una ubicación diferente
        if (!response.ok) {
            throw new Error(`Error HTTP! estado: ${response.status}`);
        }
        const data = await response.json();
        return {
            ok: true,
            json: () => Promise.resolve(data)
        };
    } catch (error) {
        console.error("Error al obtener productos.json:", error);
        return {
            ok: false,
            statusText: error.message,
            json: () => Promise.resolve({ message: `Error al cargar productos: ${error.message}` })
        };
    }
}


// --- Clase Producto (usando sintaxis de clase ES6) ---
/**
 * Representa un producto con sus propiedades.
 */
class Producto {
    constructor(id, nombre, precio, stock, imagen) {
        this.id = id;
        this.nombre = nombre;
        this.precio = precio;
        this.stock = stock;
        this.imagen = imagen;
    }
}

// --- Variables Globales y Constantes ---
const MAX_PRODUCTOS_CARRITO = 5; // Límite máximo de productos en el carrito
let carrito = []; // Array que almacena los productos en el carrito

// La lista de productos disponibles ahora se obtiene de forma asíncrona
// y no se declara globalmente aquí.

// --- Elementos del DOM ---
// Referencias a los elementos HTML
const contenedorProductos = document.getElementById("contenedor-productos");
const contenedorCarrito = document.getElementById("carrito-contenido");
const btnCalcularTotal = document.querySelector(".btn-calcular-total");
const btnFinalizarCompra = document.querySelector(".btn-finalizar-compra");
const btnVaciarCarrito = document.querySelector(".btn-vaciar-carrito");
const btnPagar = document.querySelector(".btn-pagar");
const totalDisplay = document.querySelector(".total-carrito p span");

// --- Funciones Auxiliares ---
/**
 * Muestra notificaciones Toastify.
 * @param {string} message - El mensaje a mostrar.
 * @param {boolean} [isError=false] - Si el mensaje es de error, el estilo cambiará.
 */
function showToast(message, isError = false) {
    const backgroundStyle = isError
        ? "linear-gradient(to right, #ff0000, #ff7f00)" // Rojo para errores/advertencias
        : "linear-gradient(to right, #00b09b, #96c93d)"; // Verde para éxito

    Toastify({
        text: message,
        duration: 3000,
        gravity: "bottom",
        position: "right",
        style: {
            background: backgroundStyle,
        },
    }).showToast();
}

// --- Funciones de Local Storage ---
/**
 * Guarda el carrito actual en el Local Storage.
 */
function guardarCarritoEnLocalStorage() {
    localStorage.setItem('carritoCompras', JSON.stringify(carrito));
}

/**
 * Carga el carrito desde el Local Storage.
 * @returns {Array<Producto>} El carrito cargado o un array vacío si no hay datos.
 */
function cargarCarritoDeLocalStorage() {
    const carritoGuardado = localStorage.getItem('carritoCompras');
    if (carritoGuardado) {
        // Mapea los objetos cargados a instancias de Producto para asegurar métodos/propiedades
        return JSON.parse(carritoGuardado).map(p => new Producto(p.id, p.nombre, p.precio, p.stock, p.imagen));
    }
    return [];
}

// --- Lógica del Carrito ---
/**
 * Agrega un producto al carrito.
 * @param {Producto} producto - El objeto Producto a agregar.
 */
async function agregarProducto(producto) {
    const productoExistente = carrito.find(item => item.id === producto.id);

    if (productoExistente) {
        showToast(`"${producto.nombre}" ya está en el carrito.`, true);
        return;
    }

    if (producto.stock <= 0) {
        showToast(`Lo siento, no hay stock disponible de "${producto.nombre}".`, true);
        return;
    }

    if (carrito.length >= MAX_PRODUCTOS_CARRITO) {
        showToast(`Has alcanzado el límite de ${MAX_PRODUCTOS_CARRITO} productos en el carrito.`, true);
        return;
    }

    try {
        const response = await simularFetchAgregarProducto(producto);
        if (response.ok) {
            const data = await response.json();
            carrito.push(producto); // Agrega el producto al array del carrito
            guardarCarritoEnLocalStorage(); // Guarda el carrito
            renderizarCarrito();    // Actualiza la vista del carrito
            updateTotalDisplay();   // Actualiza el total
            showToast(data.mensaje);
        } else {
            showToast("Error al agregar el producto al carrito.", true);
        }
    } catch (error) {
        console.error("Error en la operación de agregar producto:", error);
        showToast("Hubo un problema de conexión al agregar el producto.", true);
    }
}

/**
 * Elimina un producto del carrito por su ID.
 * @param {number} idProducto - El ID del producto a eliminar.
 */
function eliminarProducto(idProducto) {
    const initialCartLength = carrito.length;
    carrito = carrito.filter(producto => producto.id !== idProducto);

    if (carrito.length < initialCartLength) {
        guardarCarritoEnLocalStorage(); // Guarda el carrito
        renderizarCarrito();
        updateTotalDisplay();
        showToast(`Producto (ID: ${idProducto}) eliminado del carrito.`, true);
    }
}

// --- Renderizado del DOM ---
/**
 * Renderiza la lista de productos disponibles en el HTML.
 * @param {Array<Object>} productosParaRenderizar - Array de objetos de producto a renderizar.
 */
function renderizarProductos(productosParaRenderizar) {
    if (!contenedorProductos) {
        console.error("El contenedor de productos (#contenedor-productos) no fue encontrado en el DOM.");
        return;
    }
    contenedorProductos.innerHTML = ""; // Limpia el contenedor antes de renderizar

    // Instancia objetos Producto desde el JSON para asegurar consistencia
    const productosInstanciados = productosParaRenderizar.map(p =>
        new Producto(p.id, p.nombre, p.precio, p.stock, p.imagen)
    );

    productosInstanciados.forEach((producto) => {
        const divProducto = document.createElement("div");
        divProducto.classList.add("producto");
        divProducto.innerHTML = `
            <img src="${producto.imagen}" alt="${producto.nombre}" onerror="this.onerror=null;this.src='https://placehold.co/300x200/cccccc/333333?text=Imagen+no+disponible';">
            <h3>${producto.nombre}</h3>
            <p>Precio: $${producto.precio}</p>
            <p>Stock: ${producto.stock}</p>
            <button class="btn-agregaralcarrito" data-id="${producto.id}">Agregar al carrito</button>
        `;
        contenedorProductos.appendChild(divProducto);

        // Agrega el evento click al botón "Agregar al carrito" de cada producto
        const botonAgregarProducto = divProducto.querySelector(".btn-agregaralcarrito");
        botonAgregarProducto.addEventListener("click", () => agregarProducto(producto));
    });
}

/**
 * Renderiza el carrito de compras en el HTML.
 */
function renderizarCarrito() {
    if (!contenedorCarrito) {
        console.error("El contenedor del carrito (#carrito-contenido) no fue encontrado en el DOM.");
        return;
    }
    contenedorCarrito.innerHTML = ""; // Limpiamos el contenedor antes de renderizar

    if (carrito.length === 0) {
        contenedorCarrito.innerHTML = `<p class="text-center text-gray-500 py-8">El carrito está vacío.</p>`;
    } else {
        carrito.forEach((producto) => {
            const divCarritoItem = document.createElement("div");
            divCarritoItem.classList.add("producto-carrito");
            divCarritoItem.innerHTML = `
                <img src="${producto.imagen}" alt="${producto.nombre}" class="w-20 h-20 object-cover rounded-lg flex-shrink-0" onerror="this.onerror=null;this.src='https://placehold.co/80x80/cccccc/333333?text=Img';">
                <div class="flex-grow">
                    <h3>${producto.nombre}</h3>
                    <p>Precio: $${producto.precio}</p>
                </div>
                <button class="btn-danger" data-id="${producto.id}">Eliminar</button>
            `;
            contenedorCarrito.appendChild(divCarritoItem);

            // Agrega el evento click al botón eliminar producto
            const btnEliminarProducto = divCarritoItem.querySelector(".btn-danger");
            btnEliminarProducto.addEventListener("click", (e) => {
                const idProducto = Number(e.target.dataset.id);
                eliminarProducto(idProducto);
            });
        });
    }
    updateTotalDisplay();
}

/**
 * Actualiza la visualización del total de la compra.
 */
async function updateTotalDisplay() {
    if (totalDisplay) {
        try {
            const response = await simularFetchCalcularTotal(carrito);
            const data = await response.json();
            totalDisplay.textContent = data.total.toString();
        } catch (error) {
            console.error("Error al actualizar la visualización del total:", error);
            totalDisplay.textContent = "Error";
        }
    } else {
        console.warn("El elemento para mostrar el total no fue encontrado en el DOM.");
    }
}

// --- Listeners de Eventos Globales ---
if (btnCalcularTotal) {
    btnCalcularTotal.addEventListener("click", async () => {
        if (carrito.length === 0) {
            showToast("El carrito está vacío, no hay total que calcular.", true);
            return;
        }
        await updateTotalDisplay();
        showToast(`El total de su compra es: $${totalDisplay.textContent}`);
    });
} else {
    console.warn("El botón 'Calcular Total' no fue encontrado en el DOM.");
}

if (btnFinalizarCompra) {
    btnFinalizarCompra.addEventListener("click", async () => {
        if (carrito.length === 0) {
            showToast("El carrito está vacío, no se puede finalizar la compra.", true);
            return;
        }

        try {
            const response = await simularFetchFinalizarCompra();
            if (response.ok) {
                const data = await response.json();
                showToast(data.mensaje);
                carrito = []; // Vacía el carrito
                guardarCarritoEnLocalStorage(); // Guarda el carrito vacío
                renderizarCarrito(); // Actualiza la vista del carrito
                updateTotalDisplay(); // Actualiza el total a 0
            } else {
                showToast("Error al finalizar la compra.", true);
            }
        } catch (error) {
            console.error("Error en la simulación de finalizar compra:", error);
            showToast("Hubo un problema de conexión al finalizar la compra.", true);
        }
    });
} else {
    console.warn("El botón 'Finalizar Compra' no fue encontrado en el DOM.");
}

if (btnVaciarCarrito) {
    btnVaciarCarrito.addEventListener("click", async () => {
        if (carrito.length === 0) {
            showToast("El carrito ya está vacío.", true);
            return;
        }

        try {
            const response = await simularFetchVaciarCarrito();
            if (response.ok) {
                const data = await response.json();
                showToast(data.mensaje, true);
                carrito = []; // Vacía el carrito
                guardarCarritoEnLocalStorage(); // Guarda el carrito vacío
                renderizarCarrito(); // Actualiza la vista del carrito
                updateTotalDisplay(); // Actualiza el total a 0
            } else {
                showToast("Error al vaciar el carrito.", true);
            }
        } catch (error) {
            console.error("Error en la simulación de vaciar carrito:", error);
            showToast("Hubo un problema de conexión al vaciar el carrito.", true);
        }
    });
} else {
    console.warn("El botón 'Vaciar Carrito' no fue encontrado en el DOM.");
}

if (btnPagar) {
    btnPagar.addEventListener("click", () => {
        if (carrito.length === 0) {
            showToast("El carrito está vacío. No hay nada que pagar.", true);
            return;
        }
        const currentTotalValue = carrito.reduce((acc, prod) => acc + prod.precio, 0);
        showToast(`Procediendo al pago de $${currentTotalValue}. ¡Gracias por tu compra!`);
    });
} else {
    console.warn("El botón 'Pagar' no fue encontrado en el DOM.");
}

// --- Inicialización ---
document.addEventListener("DOMContentLoaded", async () => { // Hace la función asíncrona
    carrito = cargarCarritoDeLocalStorage(); // Carga el carrito al inicio

    try {
        const response = await obtenerProductosDisponiblesDesdeJson(); // Usa la función fetch real
        if (response.ok) {
            const fetchedProductsData = await response.json();
            // Pasa los productos obtenidos a renderizarProductos
            renderizarProductos(fetchedProductsData);
        } else {
            console.error("Error al cargar productos disponibles:", response.statusText);
            showToast("Error al cargar los productos disponibles.", true);
        }
    } catch (error) {
        console.error("Error de red al cargar productos disponibles:", error);
        showToast("Error de conexión al cargar los productos.", true);
    }

    renderizarCarrito(); // Renderiza el carrito después de intentar cargar productos
});

