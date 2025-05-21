//SIMULADOR CARRITO DE COMPRAS//
  //Declaramos variables y constantes//
  //Variables globales//
  const maxProductos = 5;
  let carritoVacio = [];
  //Variables para el total y la cantidad de productos//
  let total = 0;
  let cantidadProductos = 0;

  let productos = [
    { id:1, nombre: "Cuenco de ceramica hojas", precio: 15000, stock: 1},
    { id:2, nombre: "Bandeja de ceramica rectangular", precio: 10000, stock: 1},
    { id:3, nombre: "Taza de ceramica", precio: 6000, stock: 2},
    { id:4, nombre: "posa cuchara Frida Kahlo", precio: 18000, stock: 1},
    { id:5,nombre: "posa cuchara flor azul", precio: 15000, stock: 1},
  ]

console.log(productos);

  //Declaramos funciones//

  function agregarProducto(carritoVacio) {
    //Crea una variable tablero que sera un string vacio para mostrar lista de productos//
  let tablero = " ";
//Recorre cada producto en el array productos usando un bucle for in//
    for (let i in productos) {
      //obtiene el nombre y el id del producto actual//
      const nombreProducto = productos[i].nombre;
      const idProducto = productos[i].id;
     //Agrega al tablero el id y el nombre del producto agregando un salto de linea//
      tablero += idProducto + " - " + nombreProducto + "\n";

  
    }
    //Muestra en un alert el listado completo de produtos//
    alert(tablero);

    //Declara la variable pregunta para almacenar la seleccion del usuario//
    let pregunta 
    //Inicia un bucle do while que se ejecutara al menos una vez y se repetira mientras la condicion sea verdadera//
    do{
      //Pide al usuario que ingrese el id del producto que quiere agregar//
      pregunta = Number(prompt("Ingrese el id del producto que desea agregar al carrito"))
      console.log(pregunta);//muestra en consola lo que ingreso el usuario//
      //Si el usuario ingresa 0, sale del bucle y termina la funcion//

      //Busca el producto seleccionado en el array productos
      for (let i = 0; i < productos.length; i ++){
        //Si encuentra el producto con el id que ingreso el usuario
        if (productos[i].id === pregunta){
          // Agrega el producto al carrito//
          carritoVacio.push(productos[i])
          //Incrementa el contador de productos en el carrito//
          cantidadProductos++;

          //Informa al usuario que el producto fue agregado al carrito//
          alert("Producto agregado al carrito")

         }if(productos[i].id !== pregunta) {
        //Si no encuentra el producto, informa al usuario y sale del ciclo for (el bucle do while continua)//
        alert("Producto no encontrado");
        break;
      }
     
    }
    //Verifica si se alcanzo el limite maximo de productos//
    if (cantidadProductos >= maxProductos){
      alert("Limite de productos alcanzado");
      return carritoVacio; //termina la funcion y devuelve el carrito//
    }
  } while (pregunta !== 0); //el bucle continuara mientras el usuario no ingrese 0, cancelar o deja vacio el prompt// {
      //Muestra en consola el contenido actual del carrito en formato tabla//
      //console.table(carritoVacio);//


  //  console.log(carritoVacio); //

}
  //invocamos la funcion agregarProducto
  let resultado = agregarProducto(carritoVacio);
  console.log(resultado);
  
   //Funciones para mostrar el carrito y los productos//
    function mostrarCarrito(carritoVacio) {
      if (carritoVacio.length === 0) {
        alert("El carrito esta vacio");
        return;
      }
      let lista = "productos en el carrito: \n";
      for (let i = 0; i < carritoVacio.length; i++) {
        lista += carritoVacio[i].nombre + " - " + carritoVacio[i].precio + "\n";
      }
      alert(lista);
    }
//Invocamos la funcion mostrarCarrito//
      mostrarCarrito(carritoVacio)

    //Funciones para eliminar producto, calcular total, finalizar compra//

    function eliminarProducto(carritoVacio, id) {
      const index = carritoVacio.findIndex(producto => producto.id === id);
      if (index !== -1) {
        carritoVacio.splice(index, 1);
      }
      return carritoVacio;
    }
    //invocamos la funcion eliminarProducto//
    eliminarProducto(carritoVacio, 1);
    console.log(carritoVacio);

    function calcularTotal(carritoVacio) {
      const total = carritoVacio.reduce((acum, producto) => acum + producto.precio, 0);
      alert("El total de su compra es: ", total);
      return total;
    }
    //invocamos la funcion calcularTotal//
    calcularTotal(carritoVacio);

    //Funciones para finalizar compra//

    function finalizarCompra(carritoVacio) {
      if (carritoVacio.length === 0) {
        alert("El carrito esta vacio");
        return;
      }
      let total = calcularTotal(carritoVacio);
      alert("Gracias por su compra, el total es: " + total);
      carritoVacio.length = 0; // vaciar el carrito
      }
      //invocamos la funcion finalizarCompra//
      finalizarCompra(carritoVacio);

      function menuPrincipal() {
        let opcion = prompt("Seleccione una opcion:\n1. Agregar producto\n2. Mostrar carrito\n3. Eliminar producto\n4. Calcular total\n5. Finalizar compra\n6. Salir");
        switch (opcion) {
          case "1":
            agregarProducto(carritoVacio);
            break;
          case "2":
            mostrarCarrito(carritoVacio);
            break;
          case "3":
            let id = Number(prompt("Ingrese el id del producto que desea eliminar"));
            eliminarProducto(carritoVacio, id);
            break;
          case "4": 
            calcularTotal(carritoVacio);
            break;
          case "5":
            finalizarCompra(carritoVacio);
            break;
            case "6":
              alert("Gracias por su compra");
              break;
              default:
                alert("Opcion no valida");
                break;
                
        }
      }

      //Funciones constructoras//

      function Producto(id, nombre, precio, stock, imagen) {
        this.id = id;
        this.nombre = nombre;
        this.precio = precio;
        this.stock = stock;
        this.imagen = imagen;

        //Para mostrar el producto en el html//
        this.mostrarinfo = function () {
          return `Producto: ${this.nombre} | Precio: ${this.precio} | Stock: ${this.stock} | Imagen: ${this.imagen}`;
        }

      }

      //Creamos los objetos producto usando la funcion constructora//

      const producto1 = new Producto(1, "Cuenco de ceramica hojas", 15000, 1, "img/cuenco-de-ceramica-hojas.jpeg");
      const producto2 = new Producto(2, "Bandeja de ceramica rectangular", 10000, 1, "img/bandeja-de-ceramica-flor-azul.jpeg");
      const producto3 = new Producto(3, "Taza de ceramica", 6000, 2, "img/taza-de-ceramica.jpeg");
      const producto4 = new Producto(4, "posa cuchara Frida Kahlo", 18000, 1, "img/posa-cuchara-frida-kahlo.jpeg");
      const producto5 = new Producto(5, "posa cuchara flor azul", 15000, 1, "img/posa-cucharas-flor-azul.jpeg");

      //Creamos un array de Productos//

      const productosArtesanales = [producto1, producto2, producto3, producto4, producto5]

      //Mostramos los productos en el html//
      const contenedorProductos = document.getElementById("contenedor-productos");
      const guardarBtn = document.getElementsByClassName("btn-agregaralcarrito");
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

        //Agregamos el evento click al boton agregar al carrito//
        const botonAgregar = div.querySelector(".btn-agregaralcarrito");
        botonAgregar.addEventListener("click", () => {
          agregarProducto(carritoVacio);
        });
      });

        //Guardamos los productos en el local storage//

        function guardarProductosEnLocalStorage(productosArtesanales) {
        const productosJSON = JSON.stringify(productosArtesanales);
        localStorage.setItem("productos", productosJSON);
        //Muestro un mensaje de confirmacion//
        alert("Productos guardados en el local storage");
       }
       //invocamos la funcion guardarProductosEnLOcalStorage//
       guardarProductosEnLocalStorage(productosArtesanales);

       //Funcion para recuperar los productos del local storage//

        function recuperarProductosDeLocalStorage() {
          const productosJSON = localStorage.getItem("productos");
          if (productosJSON) {
            const productosrecuperados = JSON.parse(productosJSON);
            //muestro un mensaje de confirmacion//
            alert("Productos recuperados del local storage");
            return productosrecuperados;
          }
        }