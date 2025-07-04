
  
// --- Funciones de Simulación (JSON Directo para simular API) ---
// Simula la adición de un producto al carrito
function simularFetchAgregarProducto(producto) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({
                ok: true,
                json: () => Promise.resolve({ mensaje: `Producto "${producto.nombre}" agregado al carrito` })
            });
        }, 300); // Retardo simulado
    });
}

// Simula el cálculo del total de la compra
function simularFetchCalcularTotal(carrito) {
    return new Promise(resolve => {
        setTimeout(() => {
            const total = carrito.reduce((acc, prod) => acc + prod.precio, 0);
            resolve({
                ok: true,
                json: () => Promise.resolve({ total: total })
            });
        }, 300); // Retardo simulado
    });
}

// Simula la finalización de la compra
function simularFetchFinalizarCompra() {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({
                ok: true,
                json: () => Promise.resolve({ mensaje: "¡Compra finalizada con éxito!" })
            });
        }, 500); // Retardo simulado
    });
}

// Simula el vaciado del carrito
function simularFetchVaciarCarrito() {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({
                ok: true,
                json: () => Promise.resolve({ mensaje: "Carrito vaciado correctamente." })
            });
        }, 300); // Retardo simulado
    });
}


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

// Lista de productos disponibles (el JSON proporcionado por el usuario)
const productosDisponibles = [
    {
        "id": 1,
        "nombre": "Cuenco de ceramica hojas",
        "precio": 15000,
        "stock": 1,
        "imagen": "../assets/imagenes/cuenco-de-ceramica-hojas.jpeg"
    },
    {
        "id": 2,
        "nombre": "Bandeja de ceramica rectangular",
        "precio": 10000,
        "stock": 1,
        "imagen": "../assets/imagenes/bandeja-de-ceramica-flor-azul.jpeg"
    },
    {
        "id": 3,
        "nombre": "Taza de ceramica",
        "precio": 6000,
        "stock": 2,
        "imagen": "../assets/imagenes/tazas-de-ceramica.jpeg"
    },
    {
        "id": 4,
        "nombre": "Posa cuchara Frida Kahlo",
        "precio": 18000,
        "stock": 1,
        "imagen": "../assets/imagenes/posa-cucharas-frida-kahlo.jpeg"
    },
    {
        "id": 5,
        "nombre": "Posa cuchara flor azul",
        "precio": 15000,
        "stock": 1,
        "imagen": "../assets/imagenes/posa-cucharas-flor-azul.jpeg"
    }
];

// --- Elementos del DOM ---
// Referencias a los elementos HTML
const contenedorProductos = document.getElementById("contenedor-productos");
const contenedorCarrito = document.getElementById("#carrito-contenido");
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
        // Mapear los objetos cargados a instancias de Producto para asegurar métodos/propiedades
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
        renderizarCarrito();
        updateTotalDisplay();
        showToast(`Producto (ID: ${idProducto}) eliminado del carrito.`, true);
    }
}

// --- Renderizado del DOM ---
/**
 * Renderiza la lista de productos disponibles en el HTML.
 */
function renderizarProductos() {
    if (!contenedorProductos) {
        console.error("El contenedor de productos (#contenedor-productos) no fue encontrado en el DOM.");
        return;
    }
    contenedorProductos.innerHTML = ""; // Limpia el contenedor antes de renderizar

    // Instanciar objetos Producto desde el JSON para asegurar consistencia
    const productosParaRenderizar = productosDisponibles.map(p =>
        new Producto(p.id, p.nombre, p.precio, p.stock, p.imagen)
    );

    productosParaRenderizar.forEach((producto) => {
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

        // Agregamos el evento click al botón "Agregar al carrito" de cada producto
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

            // Agregamos el evento click al botón eliminar producto
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
            console.error("Error al actualizar el display del total:", error);
            totalDisplay.textContent = "Error";
        }
    } else {
        console.warn("El elemento para mostrar el total no fue encontrado en el DOM.");
    }
}

// --- Event Listeners Globales ---
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
                carrito = [];
                renderizarCarrito();
                updateTotalDisplay();
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
                carrito = [];
                renderizarCarrito();
                updateTotalDisplay();
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
document.addEventListener("DOMContentLoaded", () => {
    renderizarProductos();
    renderizarCarrito();
});

