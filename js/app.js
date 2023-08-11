
//Inicio de la variable carrito con el contenido de localStorage. Si no hay nada, se inicia como un array vacío
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

/* -------------------------------- FUNCIONES ------------------------------- */
// FUNCIÓN PARA MOSTRAR LOS PRODUCTOS
const mostrarProductos = (productos) => {
	// Captura del contenedor donde se va a renderizar los productos
	const contenedorProductos = document.querySelector(".product-list");
	// Vacia el contenedor por si había algo anteriormente
	contenedorProductos.innerHTML = "";
	productos.forEach((producto) => {
		const li = document.createElement("li");
		li.innerHTML = `
    <img src="${producto.imagen}" alt="${producto.nombre}">
    <h3>${producto.nombre}</h3>
    <h5 class="product-description">${producto.descripcion}</h5>
    <p class="product-price">$${producto.precio}</p>
    <button id="agregar-${producto.id}" class="add-to-cart">Agregar al carrito</button>
    `;
		// Agrego la card al contenedor
		contenedorProductos.appendChild(li);
		//Capturo el boton para agregar evento
		const boton = document.getElementById(`agregar-${producto.id}`);
		boton.addEventListener("click", () => {
			agregarAlCarrito(productos, producto.id);
		});
	});
};

// FUNCIÓN PARA AGREGAR EL PRODUCTO AL CARRITO

const agregarAlCarrito = (productos, id) => {
	if (!carrito.some((producto) => producto.id === id)) {
		const producto = productos.find((producto) => producto.id === id);
			carrito.push({ ...producto, cantidad: 1 });
	} else {
		const producto = carrito.find((producto) => producto.id === id);
		producto.cantidad++;
	}
	// Se guarda el carrito en el localStorage para tenerlo actualizado si se recarga la página
	localStorage.setItem("carrito", JSON.stringify(carrito));
		mostrarCarrito();
};

const mostrarCarrito = () => {
	const contenedorCarrito = document.querySelector(".carrito");
	contenedorCarrito.innerHTML = "";
	if (carrito.length > 0) {

		const productsCart = document.createElement("ul");
		productsCart.classList.add("productsCart");
		contenedorCarrito.appendChild(productsCart);

		const contenedorTotal = document.createElement("p");
		actualizarTotal(contenedorTotal);
		contenedorCarrito.appendChild(contenedorTotal);
		
		carrito.forEach((producto) => {
			const li = document.createElement("li");
			li.innerHTML = `
			<img src="${producto.imagen}" alt="${producto.nombre}" />
			<div class="productContent">
				<h3>${producto.nombre}</h3>
				<p class="product-description">${producto.descripcion}</p>
				<p class="product-price">$${producto.precio}</p>
				<div class="counter">
				<button id="decrementar-${producto.id}" class="button">-</button>
				<span class="product-price">${producto.cantidad}</span>
				<button id="incrementar-${producto.id}" class="button">+</button>
				</div>
			</div>
			<button id="eliminar-${producto.id}" class="remove">Eliminar</button>
		`;
		
			productsCart.appendChild(li);
			const boton = document.getElementById(`eliminar-${producto.id}`);
			boton.addEventListener("click", () => {
				eliminarProducto(producto.id);
			});

			// Agrego evento al botón decrementar.
			const decrementar = document.getElementById(`decrementar-${producto.id}`);
			decrementar.addEventListener("click", () => {
				decrementarProducto(producto.id);
			});

			// Agrego evento al botón incrementar.
			const incrementar = document.getElementById(`incrementar-${producto.id}`);
			incrementar.addEventListener("click", () => {
				incrementarProducto(producto.id);
			});
		});
	} else {
		// Si el carrito está vacío, muestro un texto
		contenedorCarrito.innerHTML = '<p class="empty">No hay productos selcccionados</p>';
	}
};

const decrementarProducto = (id) => {
	const producto = carrito.find((prod) => prod.id === id);
	// Si es 1, hay que eliminarlo porque no podemos tener cantidad cero
	if (producto.cantidad === 1) {
		eliminarProducto(producto.id);
	} else {
		producto.cantidad--;
		localStorage.setItem("carrito", JSON.stringify(carrito));
		mostrarCarrito();
	}
};

const incrementarProducto = (id) => {
	const producto = carrito.find((prod) => prod.id === id);
	producto.cantidad++;
	localStorage.setItem("carrito", JSON.stringify(carrito));
	mostrarCarrito();
};

const eliminarProducto = (id) => {
	// Genero un nuevo carrito con todos los productos menos el que seleccionamos
	carrito = carrito.filter((producto) => producto.id !== id);
	localStorage.setItem("carrito", JSON.stringify(carrito));
	mostrarCarrito();
};

const actualizarTotal = (contenedor) => {
	const total = carrito.reduce((acumulador, producto) => acumulador + producto.precio * producto.cantidad, 0);
	contenedor.textContent = `Total: $${total}`;
};

document.getElementById("vaciarCarrito").addEventListener("click", function() {
    Swal.fire({
        title: "Confirmar vaciado de carrito",
        text: "¿Quieres vaciar el carrito?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, vaciar carrito",
        cancelButtonText: "Cancelar"
    }).then((result) => {
        if (result.isConfirmed) {
            carrito = [];
            mostrarCarrito();
            Swal.fire("Carrito vaciado", "El carrito ha sido vaciado exitosamente.", "success");
        }
    });
});

document.getElementById("realizarCompra").addEventListener("click", function() {
    Swal.fire({
        title: "Confirmar Compra",
        text: "¿Deseas confirmar la compra del carrito?",
        icon: "info",
        showCancelButton: true,
        confirmButtonText: "Sí, confirmo compra",
        cancelButtonText: "Cancelar"
    }).then((result) => {
        if (result.isConfirmed) {
            carrito = [];
            localStorage.setItem("carrito", JSON.stringify(carrito));
            mostrarCarrito();
            Swal.fire("Compra realizada", "La compra ha sido realizada exitosamente.", "success");
        }
    });
});

//Traemos los productos del JSON local
fetch("./js/productos.json")
	.then((response) => response.json())
	.then((productos) => {
		mostrarProductos(productos);
		mostrarCarrito();
	});
