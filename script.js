//SIMULADOR CARRITO DE COMPRAS//
  //Declaramos variables y constantes//
  //Variables globales//
  const maxProductos = 10;
  let carritoVacio = [];
  //Variables para el total y la cantidad de productos//
  let total = 0;
  let cantidadProductos = 0;

  let productos = [
    { id:1, nombre: "Ensaladera de ceramica", precio: 15000},
    { id:2, nombre: "Bandeja de ceramica", precio: 10000},
    { id:3, nombre: "Taza de ceramica", precio: 6000},
    { id:4, nombre: "Juego de 6 platos playos", precio: 20000},
    { id:5, nombre: "Juego de 6 platos hondos", precio: 25000},
    { id:6, nombre: "Maceta de ceramica", precio:12000},
    { id:7, nombre: "portasahumerio-hoja", precio: 5000},
    { id:8, nombre: "portautensilios de cocina", precio: 8000},
    { id:9, nombre: "posa vasos", precio: 3000},
    { id:10,nombre: "juego de 6 platos de postre", precio: 15000},
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


      }
     
    }
    cantidadProductos++;
    } while (!isNaN (pregunta)){
      if (cantidadProductos >= maxProductos) {
        alert("Limite de productos alcanzado")
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

    //Funciones para eliminar producto, calcular total, finalizar compra//

    function eliminarProducto(carritoVacio, id) {
      const index = carritoVacio.findIndex(producto => producto.id === id);
      if (index !== -1) {
        carritoVacio.splice(index, 1);
      }
      return carritoVacio;
    }

    function calcularTotal(carritoVacio) {
      const total = carritoVacio.reduce((acum, producto) => acum + producto.precio, 0);
      alert("El total de su compra es: ", total);
      return total;
    }

    function finalizarCompra() {}