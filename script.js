//SIMULADOR CARRITO DE COMPRAS//
  //Declaramos variables y constantes//
  //Variables globales//
  const maxProductos = 5;
  let carritoVacio = [];
  //Variables para el total y la cantidad de productos//
  let total = 0;
  let cantidadProductos = 0;

  let productos = [
    { id:1, nombre: "Cuenco de ceramica hojas", precio: 15000},
    { id:2, nombre: "Bandeja de ceramica rectangular", precio: 10000},
    { id:3, nombre: "Taza de ceramica", precio: 6000, stock: 2},
    { id:4, nombre: "posa cuchara Frida Kahlo", precio: 18000},
    { id:5,nombre: "posa cuchara flor azul", precio: 15000},
  ]

console.log(productos);

  //Declaramos funciones//

  function agregarProducto(carritoVacio) {
  let tablero = " ";

    for (let i in productos) {
      const nombreProducto = productos[i].nombre;
      const idProducto = productos[i].id;

      tablero += idProducto + " - " + nombreProducto + "\n";

  
    }
    alert(tablero);

    let pregunta 
    do{
      pregunta = Number(prompt("Ingrese el id del producto que desea agregar al carrito"))
      for (let i = 0; i < productos.length; i ++){
        if (productos[i].id === pregunta){
          carritoVacio.push(productos[i])
          cantidadProductos++;
          alert("Producto agregado al carrito")




      }
     
    }
    
    } while (!isNaN (pregunta)); {
      if (cantidadProductos >= maxProductos) {
                alert("Limite de productos alcanzado");
        return carritoVacio;

      }
    }


    console.log(carritoVacio); 
   

    }
  
    //invocamos la funcion agregarProducto
   agregarProducto(carritoVacio);

   console.log(agregarProducto(carritoVacio));

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

    function finalizarCompra() {}