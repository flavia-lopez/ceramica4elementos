
// --- Funciones de Simulación (FETCH) ---
        // Simulamos peticiones a un API para las operaciones del carrito
        function simularFetchAgregarProducto(producto) {
            return new Promise(resolve => {
                setTimeout(() => {
                    resolve({
                        ok: true,
                        json: () => Promise.resolve({ mensaje: `Producto "${producto.nombre}" agregado al carrito` })
                    });
                }, 500); // Simula 0.5 segundos de retardo
            });
        }

        function simularFetchCalcularTotal(carrito) {
            return new Promise(resolve => {
                setTimeout(() => {
                    const total = carrito.reduce((acc, prod) => acc + prod.precio, 0);
                    resolve({
                        ok: true,
                        json: () => Promise.resolve({ total: total }) // Corregido: Promise.resolve() directamente
                    });
                }, 500);
            });
        }

        function simularFetchFinalizarCompra() {
            return new Promise(resolve => {
                setTimeout(() => {
                    resolve({
                        ok: true,
                        json: () => Promise.resolve({ mensaje: "¡Compra finalizada con éxito!" })
                    });
                }, 500);
            });
        }

        function simularFetchVaciarCarrito() {
            return new Promise(resolve => {
                setTimeout(() => {
                    resolve({
                        ok: true,
                        json: () => Promise.resolve({ mensaje: "Carrito vaciado correctamente." })
                    });
                }, 500);
            });
        }

        // --- Clase Producto ---
        // Definimos la estructura de un producto
        function Producto(id, nombre, precio, stock, imagen) {
            this.id = id;
            this.nombre = nombre;
            this.precio = precio;
            this.stock = stock;
            this.imagen = imagen;
        }

        // --- Variables Globales y Constantes ---
        const MAX_PRODUCTOS_CARRITO = 5; // Límite máximo de productos en el carrito
        let carrito = []; // Usamos 'carrito' para mayor claridad

        const productosDisponibles = [
            new Producto(1, "Cuenco de cerámica hojas", 15000, 1, "https://placehold.co/300x200/a3e635/000?text=Cuenco+Hojas"),
            new Producto(2, "Bandeja de cerámica rectangular", 10000, 1, "https://placehold.co/300x200/22d3ee/000?text=Bandeja+Rectangular"),
            new Producto(3, "Taza de cerámica", 6000, 2, "https://placehold.co/300x200/fde047/000?text=Taza+Ceramica"),
            new Producto(4, "Posa cuchara Frida Kahlo", 18000, 1, "https://placehold.co/300x200/f87171/000?text=Posa+Frida"),
            new Producto(5, "Posa cuchara flor azul", 15000, 1, "https://placehold.co/300x200/818cf8/000?text=Posa+Flor+Azul"),
        ];

        // --- Elementos del DOM ---
        // Obtenemos las referencias a los elementos HTML
        const contenedorProductos = document.getElementById("#contenedor-productos"); // Asumiendo que es un ID
        const contenedorCarrito = document.getElementById("#contenedor-carrito");     // Asumiendo que es un ID
        const btnCalcularTotal = document.querySelector(".btn-calcular-total");      // Asumiendo que es una clase
        const btnFinalizarCompra = document.querySelector(".btn-finalizar-compra");  // Asumiendo que es una clase
        const btnVaciarCarrito = document.querySelector(".btn-vaciar-carrito");      // Asumiendo que es una clase

        // --- Funciones Auxiliares ---
        // Función para mostrar mensajes Toastify
        function showToast(message, isError = false) {
            const backgroundStyle = isError
                ? "linear-gradient(to right, #ff0000, #ff7f00)" // Rojo para errores o acciones de eliminación
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

        // --- Lógica del Carrito ---
        function agregarProductoAlCarrito(producto) {
            // Verificamos si el producto ya está en el carrito
            const productoExistente = carrito.find(item => item.id === producto.id);
            if (productoExistente) {
                showToast(`"${producto.nombre}" ya está en el carrito.`, true);
                return;
            }

            // Verificamos si hay stock disponible (solo simulado, no se decrementa el stock real aquí)
            if (producto.stock <= 0) {
                showToast(`Lo siento, no hay stock disponible de "${producto.nombre}".`, true);
                return;
            }

            // Verificamos el límite de productos en el carrito
            if (carrito.length >= MAX_PRODUCTOS_CARRITO) {
                showToast(`Has alcanzado el límite de ${MAX_PRODUCTOS_CARRITO} productos en el carrito.`, true);
                return;
            }

            // Simulamos la adición al carrito mediante un "fetch"
            simularFetchAgregarProducto(producto)
                .then(response => {
                    if (response.ok) {
                        response.json().then(data => {
                            carrito.push(producto); // Agregamos el producto al carrito
                            renderizarCarrito();    // Actualizamos la vista del carrito
                            showToast(data.mensaje);
                        });
                    } else {
                        showToast("Error al agregar el producto al carrito.", true);
                    }
                })
                .catch(error => {
                    console.error("Error en la simulación de agregar producto:", error);
                    showToast("Hubo un problema de conexión al agregar el producto.", true);
                });
        }

        function eliminarProductoDelCarrito(id) {
            const index = carrito.findIndex(producto => producto.id === id);
            if (index !== -1) {
                carrito.splice(index, 1); // Eliminamos el producto del array
                renderizarCarrito();      // Actualizamos la vista del carrito
                showToast(`Producto (ID: ${id}) eliminado del carrito.`, true);
            }
        }

        // --- Renderizado del DOM ---
        // Muestra los productos disponibles en el HTML
        function renderizarProductos() {
            if (!contenedorProductos) {
                console.error("El contenedor de productos (#contenedor-productos) no fue encontrado en el DOM.");
                return;
            }
            contenedorProductos.innerHTML = ""; // Limpiamos el contenedor antes de renderizar

            productosDisponibles.forEach((producto) => {
                const divProducto = document.createElement("div");
                divProducto.classList.add("producto", "bg-white", "p-4", "rounded-xl", "shadow-md", "flex", "flex-col", "items-center", "text-center"); // Clases Tailwind
                divProducto.innerHTML = `
                    <img src="${producto.imagen}" alt="${producto.nombre}" class="w-full h-40 object-cover rounded-lg mb-4">
                    <h3 class="text-xl font-semibold text-gray-800 mb-2">${producto.nombre}</h3>
                    <p class="text-gray-600 mb-2">Precio: <span class="font-bold text-green-600">$${producto.precio}</span></p>
                    <p class="text-gray-500 mb-4">Stock: ${producto.stock}</p>
                    <button class="btn-primary py-2 px-4 font-medium mt-auto w-full" data-id="${producto.id}">Agregar al carrito</button>
                `;
                contenedorProductos.appendChild(divProducto);

                // Adjuntamos el evento click a cada botón "Agregar al carrito"
                const botonAgregar = divProducto.querySelector(".btn-primary");
                botonAgregar.addEventListener("click", () => agregarProductoAlCarrito(producto));
            });
        }

        // Muestra los productos en el carrito en el HTML
        function renderizarCarrito() {
            if (!contenedorCarrito) {
                console.error("El contenedor del carrito (#contenedor-carrito) no fue encontrado en el DOM.");
                return;
            }
            contenedorCarrito.innerHTML = ""; // Limpiamos el contenedor antes de renderizar

            if (carrito.length === 0) {
                contenedorCarrito.innerHTML = `<p class="text-center text-gray-500 col-span-full py-8">El carrito está vacío.</p>`;
                return;
            }

            carrito.forEach((producto) => {
                const divCarritoItem = document.createElement("div");
                divCarritoItem.classList.add("producto-carrito", "bg-white", "p-4", "rounded-xl", "shadow-md", "flex", "items-center", "gap-4"); // Clases Tailwind
                divCarritoItem.innerHTML = `
                    <img src="${producto.imagen}" alt="${producto.nombre}" class="w-20 h-20 object-cover rounded-lg flex-shrink-0">
                    <div class="flex-grow">
                        <h3 class="text-lg font-semibold text-gray-800">${producto.nombre}</h3>
                        <p class="text-gray-600">Precio: <span class="font-bold text-green-600">$${producto.precio}</span></p>
                    </div>
                    <button class="btn-danger py-2 px-4 font-medium flex-shrink-0" data-id="${producto.id}">Eliminar</button>
                `;
                contenedorCarrito.appendChild(divCarritoItem);

                // Adjuntamos el evento click a cada botón "Eliminar" dentro del carrito
                const btnEliminar = divCarritoItem.querySelector(".btn-danger");
                btnEliminar.addEventListener("click", (e) => {
                    const idProducto = Number(e.target.dataset.id); // Obtenemos el ID del producto a eliminar
                    eliminarProductoDelCarrito(idProducto);
                });
            });
        }

        // --- Event Listeners Globales ---
        // Escuchadores de eventos para los botones principales del carrito
        if (btnCalcularTotal) {
            btnCalcularTotal.addEventListener("click", () => {
                simularFetchCalcularTotal(carrito)
                    .then(response => {
                        if (response.ok) {
                            response.json().then(data => {
                                showToast(`El total de su compra es: $${data.total}`);
                            });
                        } else {
                            showToast("Error al calcular el total de la compra.", true);
                        }
                    })
                    .catch(error => {
                        console.error("Error en la simulación de calcular total:", error);
                        showToast("Hubo un problema de conexión al calcular el total.", true);
                    });
            });
        } else {
            console.warn("El botón 'Calcular Total' (.btn-calcular-total) no fue encontrado en el DOM.");
        }

        if (btnFinalizarCompra) {
            btnFinalizarCompra.addEventListener("click", () => {
                if (carrito.length === 0) {
                    showToast("El carrito está vacío, no se puede finalizar la compra.", true);
                    return;
                }

                simularFetchFinalizarCompra()
                    .then(response => {
                        if (response.ok) {
                            response.json().then(data => {
                                showToast(data.mensaje);
                                carrito = []; // Vaciar el carrito después de finalizar la compra
                                renderizarCarrito(); // Actualizar la vista del carrito
                            });
                        } else {
                            showToast("Error al finalizar la compra.", true);
                        }
                    })
                    .catch(error => {
                        console.error("Error en la simulación de finalizar compra:", error);
                        showToast("Hubo un problema de conexión al finalizar la compra.", true);
                    });
            });
        } else {
            console.warn("El botón 'Finalizar Compra' (.btn-finalizar-compra) no fue encontrado en el DOM.");
        }

        if (btnVaciarCarrito) {
            btnVaciarCarrito.addEventListener("click", () => {
                if (carrito.length === 0) {
                    showToast("El carrito ya está vacío.", true);
                    return;
                }

                simularFetchVaciarCarrito()
                    .then(response => {
                        if (response.ok) {
                            response.json().then(data => {
                                showToast(data.mensaje, true); // Usamos 'true' para un mensaje de vaciado (acción destructiva)
                                carrito = []; // Vaciar el carrito
                                renderizarCarrito(); // Actualizar la vista
                            });
                        } else {
                            showToast("Error al vaciar el carrito.", true);
                        }
                    })
                    .catch(error => {
                        console.error("Error en la simulación de vaciar carrito:", error);
                        showToast("Hubo un problema de conexión al vaciar el carrito.", true);
                    });
            });
        } else {
            console.warn("El botón 'Vaciar Carrito' (.btn-vaciar-carrito) no fue encontrado en el DOM.");
        }

        // --- Inicialización ---
        // Aseguramos que el DOM esté completamente cargado antes de ejecutar el script
        document.addEventListener("DOMContentLoaded", () => {
            renderizarProductos(); // Mostramos los productos al cargar la página
            renderizarCarrito();   // Inicializamos la vista del carrito (vacío o con datos si usaras localStorage)
        });
    

