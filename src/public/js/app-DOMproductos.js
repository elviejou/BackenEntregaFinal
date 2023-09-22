//Creamos funcion para no repetir code que cree por DOM las cards de los productos en cada pagina.
//Ademas contiene las instrucciones de ejecutar la funcion de compra cada vez que clickeamos en el boton de agregar al carrito.
function escribirProductosHTML (arrayProductos, columnas=3) {
    const productosHTML = document.getElementById("productos");
    productosHTML.innerHTML = "";
    if (!arrayProductos.length){
        productosHTML.innerText = "NO HAY PRODUCTOS PARA MOSTRAR"
        return
    }
    arrayProductos.forEach((producto) => {
        let contenedor = document.createElement("div");
        contenedor.className = `col-xl-${columnas} col-lg-${columnas} col-sm-6`
        //Definimos el innerHTML del elemento con una plantilla de texto
        contenedor.innerHTML = `<!-- PRODUCT ${producto._id}-->
                        <div class="product text-center">
                        <div class="mb-3 position-relative">
                            <div class="badge text-black badge-primary bg-danger text-white fs-6">${(producto.stock > 0) ? "DISPONIBLE" : "AGOTADO"}</div><a id="detalle-${producto._id}" class="d-block" href="/details.html"><img class="img-fluid w-200" src="${producto.thumbnails}" alt="${producto.title}"></a>
                            <div class="product-overlay">
                            <ul class="mb-0 list-inline">
                                <li class="list-inline-item m-0 p-0"><a id="agregarProducto-${producto._id}" class="btn btn-sm btn-dark" href="#">Agregar al carrito</a></li>
                                <li class="list-inline-item me-0"><a class="btn btn-sm btn-outline-dark" href="#productView-${producto._id}" data-bs-toggle="modal"><i class="fas fa-expand"></i></a></li>
                            </ul>
                            </div>
                        </div>
                        <h6 class="reset-anchor fs-4"> <a  href="#productView-${producto._id}" data-bs-toggle="modal">${producto.title}</a></h6>
                        <p class="fs-4 text-muted">$${producto.price}.-</p>
                                </div>`;
        productosHTML.appendChild(contenedor);
        //Almacenamos en constante el nodo de cada boton "agregar al carrito"
        const agregarProducto = document.getElementById(`agregarProducto-${producto._id}`);
        //Añadimos manejador de evento click a dicho nodo.
        agregarProducto.addEventListener("click", async () => {
            await addProductCartAPI(producto._id, 1);
        });
        //Almacenamos en constante el nodo de cada imagen de producto...
        const detalle = document.getElementById(`detalle-${producto._id}`);
        //Añadimos manejador de evento click para almacenar variable en LocalStorage y transmitirla al js de detalle al hacer click en la imagen.
        detalle.addEventListener("click", () => {
            localStorage.setItem("detalle-id", producto._id);
        })
    })
}
//Creamos funcion para no repetir code que cree por DOM los modales de los productos en cada pagina.
//Ademas contiene las instrucciones de ejecutar la funcion de compra cada vez que clickeamos en el boton de agregar al carrito dentro del modal.
function escribirModalesHTML (arrayProductos){
    const modales = document.getElementById("modales");
    modales.innerHTML = "";
    if (!arrayProductos.length) return;
    arrayProductos.forEach((producto) => {
        let contenedor = document.createElement("div");
        contenedor.className = "modal fade"
        contenedor.id = `productView-${producto._id}`
        contenedor.tabIndex = "-1"
        contenedor.role = "dialog"
        contenedor.ariaHidden = "true"
        //Definimos el innerHTML del elemento con una plantilla de texto
        contenedor.innerHTML = `<!-- modal producto-${producto._id}-->
                                <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
                                    <div class="modal-content">
                                        <div class="modal-body p-0">
                                            <div class="row align-items-stretch">
                                                <div class="col-lg-6 p-lg-0">
                                                    <a class="product-view d-block h-100 bg-cover bg-center" style="background: url(${producto.thumbnails})" href="${producto.thumbnails}" data-lightbox="productview-${producto._id}" title="${producto.title}"></a>
                                                </div>
                                                <div class="col-lg-6">
                                                    <button class="btn-close p-4" type="button" data-bs-dismiss="modal" aria-label="Close"><span aria-hidden="true"></span></button>
                                                        <div class="p-5 my-md-4">
                                                            <ul class="list-inline mb-2">
                                                                <li class="list-inline-item m-0"><i class="fas fa-star small text-warning"></i></li>
                                                                <li class="list-inline-item m-0"><i class="fas fa-star small text-warning"></i></li>
                                                                <li class="list-inline-item m-0"><i class="fas fa-star small text-warning"></i></li>
                                                                <li class="list-inline-item m-0"><i class="fas fa-star small text-warning"></i></li>
                                                                <li class="list-inline-item m-0"><i class="fas fa-star small text-warning"></i></li>
                                                            </ul>
                                                            <h2 class="h4">${producto.title}</h2>
                                                            <p class="fs-4 text-danger font-weight-bold ">$${producto.price}.-</p>
                                                            <p class="text-small mb-4">Codigo: ${producto.code}</p>
                                                                <div class="row align-items-stretch mb-4">
                                                                    <div class="col-sm-7 pr-sm-0">
                                                                        <div class="d-flex align-items-center justify-content-between p-1 border"><span class="small text-uppercase text-black me-4 no-select">Cantidad</span>
                                                                            <div class="quantity">
                                                                            <button class="dec-btn p-0"><i class="fas fa-caret-left"></i></button>
                                                                            <input id="cantidad-modal-${producto._id}" class="form-control text-black border-0 shadow-0 p-0" type="text" value="1">
                                                                            <button class="inc-btn p-0"><i class="fas fa-caret-right"></i></button>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div class="col-sm-5 pl-sm-0"><a id="agregarProducto-${producto._id}-modal" class="btn btn-dark btn-sm btn-block h-100 d-flex align-items-center justify-content-center px-0">Agregar al carrito</a></div>
                                                                </div>
                                                        </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>`;
        modales.appendChild(contenedor);
        
        //Selector de cantidades.
        QuantityEvent(contenedor);

        //Asociamos el evento a botón recién creado.
        document.querySelector(`#agregarProducto-${producto._id}-modal`).addEventListener("click", async ()=>{
            const cantidad = parseInt(document.querySelector(`#cantidad-modal-${producto._id}`).value);
            await addProductCartAPI(producto._id, cantidad);
        })

       // Función para obtener categorías únicas
// Función para obtener categorías únicas, incluyendo "TODOS LOS PRODUCTOS"
function obtenerCategoriasUnicas(productos) {
    const categoriasUnicas = ["TODOS LOS PRODUCTOS"]; // Agregamos la categoría especial
    productos.forEach((producto) => {
        if (!categoriasUnicas.includes(producto.category)) {
            categoriasUnicas.push(producto.category);
        }
    });
    return categoriasUnicas;
}

// CATEGORIAS DE PRODUCTOS "TODOS LOS PRODUCTOS"
function renderizarCategorias(productos) {
    const categoriasUnicas = obtenerCategoriasUnicas(productos);
    const categoriasSidebar = document.getElementById("categorias-sidebar");

    categoriasSidebar.innerHTML = ""; // LIMPIAMOS LA LISTA ANTES DE RENDERIZARLA
    categoriasUnicas.forEach((categoria) => {
        const listItem = document.createElement("li");
        listItem.innerHTML = `<a class="reset-anchor category" href="#" data-categoria="${categoria}">${categoria}</a>`;
        categoriasSidebar.appendChild(listItem);

        // MANEJADOR DE CLICK
        listItem.addEventListener("click", (event) => {
            event.preventDefault();
            const categoriaSeleccionada = event.target.getAttribute("data-categoria");
            filtrarProductosPorCategoria(productos, categoriaSeleccionada);
        });
    });
}

// FILTAR PRODUCTOS
function filtrarProductosPorCategoria(productos, categoriaSeleccionada) {
    let productosFiltrados;
    
    if (categoriaSeleccionada === "TODOS LOS PRODUCTOS") {
        // MOSTRAR "TODOS LOS PRODUCTOS"
        productosFiltrados = productos;
    } else {
        productosFiltrados = productos.filter((producto) => producto.category === categoriaSeleccionada);
    }

    escribirProductosHTML(productosFiltrados);
}

// RENDERIZAMOS CATEGORIAS
renderizarCategorias(productos); 
})

// FUNCION BUSCAR PRODUCTOS
function buscarProductos(productos, consulta) {
    consulta = consulta.toLowerCase(); 
    const productosFiltrados = productos.filter((producto) => {
        // ACA PODEMOS AGREGAR MAS CONDICIONES DE BUSQUEDA
        const tituloProducto = producto.title.toLowerCase();
        return tituloProducto.includes(consulta);
    });
    return productosFiltrados;
}

// BUSQUEDA EN TIEMPO REAL
function actualizarResultadosDeBusqueda() {
    const consulta = document.getElementById("busqueda-productos").value;
    const productosFiltrados = buscarProductos(productos, consulta);
    escribirProductosHTML(productosFiltrados);
}

// BUSQUEDA AL TOCAR EL BOTON
document.getElementById("boton-buscar").addEventListener("click", () => {
    const consulta = document.getElementById("busqueda-productos").value;
    const productosFiltrados = buscarProductos(productos, consulta);
    escribirProductosHTML(productosFiltrados);
});

// BUSQUEDA CON ENTER KEY
document.getElementById("busqueda-productos").addEventListener("keyup", (event) => {
    if (event.key === "Enter") {
        const consulta = document.getElementById("busqueda-productos").value;
        const productosFiltrados = buscarProductos(productos, consulta);
        escribirProductosHTML(productosFiltrados);
    }
});

// RENDERIZANDO LA BUSQUEDA A MEDIDA QUE ESCRIBIMOS EN EL BUSCADOR
document.getElementById("busqueda-productos").addEventListener("input", actualizarResultadosDeBusqueda);

}