const objetos = [
    { nombre: "monitor", precio: "30Us", marca: "gigabyte", imagen: "./fotos/monitor-gigabyte.webp" },
    { nombre: "monitor", precio: "15Us", marca: "razer", imagen: "./fotos/monitor-razer.jpg" },
    { nombre: "monitor", precio: "27Us", marca: "redragon", imagen: "./fotos/monitor-redragon.jpg" },
    { nombre: "teclado", precio: "20Us", marca: "redragon", imagen: "./fotos/teclado-redragon.jpg" },
    { nombre: "teclado", precio: "17Us", marca: "razer", imagen: "./fotos/teclado-razer.jpg" },
    { nombre: "teclado", precio: "57Us", marca: "noga", imagen: "./fotos/teclado-noga.png" },
    { nombre: "mouse", precio: "60Us", marca: "redragon", imagen: "./fotos/mouse-redragon.jpeg" },
    { nombre: "mouse", precio: "25Us", marca: "razer", imagen: "./fotos/mouse-razer.jpeg" },
    { nombre: "mouse", precio: "67Us", marca: "noga", imagen: "./fotos/mouse-noga.jpeg" },
];

let carrito = [];
let totalCarrito = 0;

function obtenerPerifericos() {
    fetch('./perifericos.json')
        .then(response => response.json())
        .then(data => mostrarPerifericos(data))
        .catch(error => console.log(error));
}


function mostrarPerifericos(data) {
    const resultadosDiv = document.getElementById('resultados');
    resultadosDiv.innerHTML = '';

    if (data.length === 0) {
        resultadosDiv.textContent = 'No se encontraron periféricos.';
    } else {
        data.forEach(periferico => {
            const perifericoDiv = document.createElement('div');
            perifericoDiv.className = 'periferico';

            const nombre = document.createElement('p');
            nombre.textContent = `Nombre: ${periferico.nombre}`;
            perifericoDiv.appendChild(nombre);

            const precio = document.createElement('p');
            precio.textContent = `Precio: ${periferico.precio}`;
            perifericoDiv.appendChild(precio);

            const marca = document.createElement('p');
            marca.textContent = `Marca: ${periferico.marca}`;
            perifericoDiv.appendChild(marca);

            resultadosDiv.appendChild(perifericoDiv);
        });
    }
}


function obtenerCarritoGuardado() {
    const carritoGuardado = localStorage.getItem('carrito');
    if (carritoGuardado) {
        carrito = JSON.parse(carritoGuardado);
    }
}

function guardarCarrito() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

obtenerCarritoGuardado();

function mostrarCarrito() {
    const carritoContent = document.getElementById('carritoContent');
    carritoContent.innerHTML = '';

    if (carrito.length === 0) {
        carritoContent.textContent = 'El carrito está vacío.';
    } else {
        carrito.forEach(periferico => {
            const perifericoDiv = document.createElement('div');
            perifericoDiv.textContent = `Nombre: ${periferico.nombre}, Precio: ${periferico.precio}, Marca: ${periferico.marca}`;

            const botonQuitar = document.createElement('button');
            botonQuitar.textContent = 'Quitar del carrito';
            botonQuitar.addEventListener('click', () => {
                quitarDelCarrito(periferico);
            });
            perifericoDiv.appendChild(botonQuitar);

            carritoContent.appendChild(perifericoDiv);
        });
    }

    const carritoCount = document.getElementById('carritoCount');
    carritoCount.textContent = carrito.length.toString();
}

function toggleCarrito() {
    const carritoDropdown = document.getElementById('carritoDropdown');
    const carritoItems = document.getElementById('carritoItems');

    if (carritoItems.classList.contains('show')) {
        carritoItems.classList.remove('show');
        carritoDropdown.setAttribute('aria-expanded', 'false');
    } else {
        carritoItems.classList.add('show');
        carritoDropdown.setAttribute('aria-expanded', 'true');
    }
}

function buscar() {
    const nombrePeriferico = document.getElementById('nombre').value;
    const perifericosEncontrados = buscarPerifericos(nombrePeriferico);
    mostrarResultados(perifericosEncontrados);
}

function calcularTotalCarrito() {
    totalCarrito = 0;
    carrito.forEach(periferico => {
        totalCarrito += parseFloat(periferico.precio);
    });
}

function mostrarResultados(resultados) {
    const resultadosDiv = document.getElementById('resultados');
    resultadosDiv.innerHTML = '';

    if (resultados.length === 0) {
        resultadosDiv.textContent = 'No se encontraron periféricos con ese nombre.';
    } else {
        resultados.forEach(periferico => {
            const perifericoDiv = document.createElement('div');
            perifericoDiv.className = 'periferico';

            const imagen = document.createElement('img');
            imagen.src = periferico.imagen;
            perifericoDiv.appendChild(imagen);

            const detallesDiv = document.createElement('div');
            detallesDiv.className = 'detalles';

            const nombre = document.createElement('p');
            nombre.textContent = `Nombre: ${periferico.nombre}`;
            detallesDiv.appendChild(nombre);

            const precio = document.createElement('p');
            precio.textContent = `Precio: ${periferico.precio}`;
            detallesDiv.appendChild(precio);

            const marca = document.createElement('p');
            marca.textContent = `Marca: ${periferico.marca}`;
            detallesDiv.appendChild(marca);

            const botonAgregar = document.createElement('button');
            botonAgregar.textContent = 'Agregar al carrito';
            botonAgregar.addEventListener('click', () => {
                agregarAlCarrito(periferico);
            });
            detallesDiv.appendChild(botonAgregar);

            perifericoDiv.appendChild(detallesDiv);
            resultadosDiv.appendChild(perifericoDiv);
        });
    }
}

function buscarPerifericos(nombre) {
    const perifericosEncontrados = objetos.filter(objeto => objeto.nombre === nombre);
    return perifericosEncontrados;
}


function ordenarPorPrecio(orden) {
    const resultados = document.getElementById('resultados');
    const perifericos = Array.from(resultados.getElementsByClassName('periferico'));

    perifericos.sort((a, b) => {
        const precioA = parseFloat(a.querySelector('.detalles > p:nth-child(2)').textContent.split(' ')[1]);
        const precioB = parseFloat(b.querySelector('.detalles > p:nth-child(2)').textContent.split(' ')[1]);

        if (orden === 'ascendente') {
            return precioA - precioB;
        } else {
            return precioB - precioA;
        }
    });

    perifericos.forEach(periferico => resultados.appendChild(periferico));
}

function agregarAlCarrito(periferico) {
    carrito.push(periferico);
    calcularTotalCarrito();
    mostrarCarrito();
    guardarCarrito();
}

function quitarDelCarrito(periferico) {
    const index = carrito.indexOf(periferico);
    if (index !== -1) {
        carrito.splice(index, 1);
    }
    calcularTotalCarrito();
    mostrarCarrito();
    guardarCarrito();
}

function realizarCompra() {
    calcularTotalCarrito();
    Swal.fire({
        title: 'Total de la compra',
        text: `El total de la compra es ${totalCarrito} USD`,
        icon: 'success',
        confirmButtonText: 'Aceptar'
    }).then(() => {
        vaciarCarrito();
    });

    function vaciarCarrito() {
        carrito = [];
        totalCarrito = 0;
        mostrarCarrito();
        guardarCarrito();
    }

}




const btnRealizarCompra = document.getElementById('btnRealizarCompra');
btnRealizarCompra.addEventListener('click', realizarCompra);

mostrarCarrito();




