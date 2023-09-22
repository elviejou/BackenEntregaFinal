const renderDetalle = (producto)=>{
  //Referencia al nodo de detalle
  const detalle = document.getElementById("detalle");
  detalle.innerHTML = `
            <div class="col-lg-6">
              <!-- PRODUCT SLIDER-->
              <div class="row m-sm-0">
                <div class="col-sm-2 p-sm-0 order-2 order-sm-1 mt-2 mt-sm-0">
                  <div class="owl-thumbs d-flex flex-row flex-sm-column" data-slider-id="1">
                    <div class="owl-thumb-item flex-fill mb-2 me-2 me-sm-0"><img class="w-100" src="${producto.thumbnails}" alt="${producto.title}"></div>
                  </div>
                </div>
                <div class="col-sm-10 order-1 order-sm-2">
                  <div><a class="d-block" href="${producto.thumbnails}" data-lightbox="product-${producto._id}" title="${producto.title}"><img class="img-fluid" src="${producto.thumbnails}" alt="${producto.title}"></a></div>
                </div>
              </div>
            </div>
            <!-- DETALLE DE PRODUCTO -->
            <div class="col-lg-6">

              <h1>${producto.title}</h1>
              <p class="text-danger lead fs-3">$${producto.price}.-</p>
              <p class="text-small mb-4"><strong class="text-uppercase">CODIGO: </strong> ${producto.code}</p>
              <div class="row align-items-stretch mb-4">
                <div class="col-sm-5 pr-sm-0">
                  <div class="border d-flex align-items-center justify-content-between py-1 px-3 bg-white border-white"><span class="small text-uppercase text-gray me-4 no-select">CANTIDAD</span>
                    <div class="quantity">
                      <button class="dec-btn p-0"><i class="fas fa-caret-left"></i></button>
                      <input id="cantidad-detalle-${producto._id}" class="form-control border-0 shadow-0 p-0" type="text" value="1">
                      <button class="inc-btn p-0"><i class="fas fa-caret-right"></i></button>
                    </div>
                  </div>
                </div>
                <div class="col-sm-3 pl-sm-0"><a id="agregarProducto-${producto._id}-detalle" class="btn btn-dark btn-sm btn-block h-100 d-flex align-items-center justify-content-center px-0">Agregar al carrito</a></div>
              <ul class="list-unstyled small d-inline-block">
                <li class="px-3 py-2 mb-1 bg-white"><strong class="text-uppercase">id: </strong><span class="ms-2 text-muted">${producto._id}</span></li>
                <li class="px-3 py-2 mb-1 bg-white text-muted"><strong class="text-uppercase text-dark">Categoria: </strong><a class="reset-anchor ms-2" href="#">${producto.categorY}</a></li>
              </ul>
            </div>`;

        //Selector de cantidades.
        QuantityEvent(detalle);
    //Asociamos el evento a botón recién creado.
    document.querySelector(`#agregarProducto-${producto._id}-detalle`).addEventListener("click", async ()=>{
      const cantidad = parseInt(document.querySelector(`#cantidad-detalle-${producto._id}`).value);
      await addProductCartAPI(producto._id, cantidad);
      await renderSidebarCart();
  })
}

const getData = async ()=>{
  //Obtenemos por LocalStorage del ultimo producto clickeado...
  let idProd = localStorage.getItem("detalle-id");
  let producto = await getProductByIdFromAPI(idProd);
  renderDetalle(producto);
}

getUserDataFromAPI().then(res => {
  renderPerfilUsuario(currentUser);
  getData();
});