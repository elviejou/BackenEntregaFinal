const renderCart = async () => {
    const productosHTML = document.getElementById("productos");
    const btnDeleteCart = document.querySelector("[data-delete]");
    productosHTML.innerHTML = "";
    await getProductsCartFromAPI();
    let total = 0;

    if (!cart?.length) {
        $("#productos").append(`<p>EL CARRITO ESTÁ VACÍO</p>`);
        $("#finalizarCompra").css({
            display: "none",
        });
        btnDeleteCart.classList.add("d-none");
    } else {
        cart.forEach((producto) => {
            total += producto.price * producto.quantity;

            // Calcula el total y redondea a dos decimales
            total = parseFloat(total.toFixed(2));

            $("#productos").append(`<tr>
                                <th class="pl-0 border-0" scope="row">
                                <div class="media align-items-center"><a id="detalle-${producto._id}" class="reset-anchor d-block" href="/details.html"><img src="${producto.thumbnails}" alt="${producto.title}" width="70"/></a>
                                    <div class="media-body ms-3"><strong class="h6"><a id="detalle2-${producto._id}" class="reset-anchor" href="/details.html">${producto.title}</a></strong></div>
                                </div>
                                </th>
                                <td class="align-middle border-0">
                                    <p class="mb-0 small">$${producto.price}</p>
                                </td>
                                <td class="align-middle border-0">
                                <div class="border d-flex align-items-center justify-content-between px-3"><span class="small text-uppercase text-gray headings-font-family">Cantidad</span>
                                    <div class="quantity">
                                        <input id="cantidad-carrito-${producto._id}" class="form-control form-control-sm border-0 shadow-0 p-0" type="number" value="${producto.quantity}" min="1" max="${producto.stock}"/>
                                        <button id="cantidad-carrito-${producto._id}-modificar" class="ps-2">Modificar</button>
                                    </div>
                                </div>
                                </td>
                                <td class="align-middle border-0">
                                    <p id="total-${producto._id}" class="mb-0 small">$${(producto.price * producto.quantity).toFixed(2)}</p>
                                </td>
                                <td id="carrito-borrarItem-${producto._id}" class="align-middle border-0"><a class="reset-anchor" href="#"><i class="fas fa-trash-alt small text-muted"></i></a></td>
                            </tr> `);

            document.querySelector(`#carrito-borrarItem-${producto._id}`).addEventListener("click", async () => {
                await deleteProductCartAPI(producto._id);
                await renderSidebarCart();
                await renderCart();
            });

            // CANTIDADES
            $(`#cantidad-carrito-${producto._id}-modificar`).click(async function () {
                let cantidad = document.querySelector(`#cantidad-carrito-${producto._id}`).value;
                cantidad = parseInt(cantidad);
                if (producto.stock < cantidad) return alertaInfo(`Solo quedan ${producto.stock} unidades`);
                await deleteProductCartAPI(producto._id);
                await addProductCartAPI(producto._id, cantidad);
                await renderCart();
                return alertaInfo(`Modificación del carrito exitosa`);
            });

            // TOTAL CARRITO
            $(`#total-${producto._id}`).text(`$${(producto.price * producto.quantity).toFixed(2)}`);
            $("#subtotalOrden").text(`$${total.toFixed(2)}.-`);
            $("#totalOrden").text(`$${total.toFixed(2)}.-`);
            $("#descOrden").addClass("d-none");

            $(`#detalle-${producto._id}`).click(() => {
                localStorage.setItem("detalle-id", producto._id);
            });
            $(`#detalle2-${producto._id}`).click(() => {
                localStorage.setItem("detalle-id", producto._id);
            });
        });
        btnDeleteCart.classList.add("d-block");
        btnDeleteCart.addEventListener("click", async function () {
            await deleteCartAPI();
            location.reload();
        });
    }

    // CUPONES
    localStorage.setItem("desc", 0);
    $("#formCupon").submit((e) => {
        e.preventDefault();
        let cupon = $("#formInput")[0].value;
        if (cupon === "coderhouse") {
            const porcentaje = 10;
            const descuento = total * (porcentaje / 100);
            const nuevoTotal = total - descuento;
            $("#descOrden").removeClass("d-none");
            $($("#descOrden").children()[0]).text(`Descuento ${porcentaje}%`);
            $($("#descOrden").children()[1]).text(`$${descuento.toFixed(2)}.-`);
            $("#totalOrden").text(`$${nuevoTotal.toFixed(2)}.-`);
            localStorage.setItem("desc", porcentaje);
        } else {
            alertaInfo("El cupón ingresado no es válido");
        }
    });
};

getUserDataFromAPI().then((res) => {
    renderPerfilUsuario(currentUser);
    renderCart();
});
