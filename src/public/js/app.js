//ARRAY PRODUCTOS.
let productos = [];

//CRRAY CARRITO.
let cart = [];

let currentUser;

//OBTENEMOS DATOS DE USUARIO
const getUserDataFromAPI = async () => {
  let res = await fetch('/api/user/current');
  res = await res.json();
  if (res.error) return alertaInfo(res.message);
  currentUser = res.data;
};

///OBTENEMOS TODOS LOS PRODUCTOS 
const getProductsFromAPI = async (sortOp = "default") => {
  const sort = (sortOp != "default") ? `?sort=${sortOp}` : "";
  let res = await fetch("/api/productos" + sort);
  res = await res.json();
  productos = res.data;
  return productos;
};
//OBTENER PRODUCTO POR ID
const getProductByIdFromAPI = async (id) => {
  let res = await fetch(`/api/productos/${id}`);
  res = await res.json();
  if (res.error) return alertaInfo(res.message);
  return res.data;
};
//ACTUALIZAMOS UN PRODUCTO SEGUN SU ID
const updateProductAPI = async (id, obj) => {
  const productUpdateData = JSON.stringify(obj);
  let res = await fetch(`/api/productos/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: productUpdateData,
  });
  res = await res.json();
  if (res.error) return alertaInfo(res.message);
  alertaInfo("PRODUCTO ACTUALIZADO");
};
//CREAMOS UN PRODUCTO
const addProductAPI = async (obj) => {
  const productAddData = JSON.stringify(obj);
  let res = await fetch(`/api/productos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: productAddData,
  });
  res = await res.json();
  if (res.error) return alertaInfo(res.message);
  alertaInfo("PRODUCTO CREADO");
};
//ELIMINAMOS PRODUCTO POR ID
const deleteProductAPI = async (id) => {
  let res = await fetch(`/api/productos/${id}`, {
    method: "DELETE",
  });
  res = await res.json();
  if (res.error) return alertaInfo(res.message);
  alertaInfo("PRODUCTO ELIMINADO");
};


//PUSHEAMOS PRODUCTOS AL CARRITO
const getProductsCartFromAPI = async () => {
  const id = currentUser.currentCart;
  let res = await fetch(`/api/carrito/${id}/productos`);
  res = await res.json();
  if (res.error) {
    alertaInfo(res.message);
    return false;
  }
  cart = res.data;
  return true;
};
//BORRAMOS CARRITO
const deleteCartAPI = async () => {
  const id = currentUser.currentCart;
  let res = await fetch(`/api/carrito/${id}`, {
    method: "DELETE",
  });
  res = await res.json();
  if (res.error) return alertaInfo(res.message);
  alertaInfo("CARRITO ELIMINADO");
};
//AGREGAMOS PRODUCTOS AL CARRO DEL USUARIO
const addProductCartAPI = async (idProd, quantity = 1) => {
  try {
    const idC = currentUser.currentCart;
    const obj = {
      idProd: idProd,
      quantity: quantity,
    };
    let res = await fetch(`/api/carrito/${idC}/productos`, {
      method: "POST",
      body: JSON.stringify(obj),
      headers: {
        "Content-Type": "application/json",
      },
    });
    res = await res.json();
    if (res.error) return alertaInfo(res.message);
    alertaInfo("PRODUCTO AGREGADO");
  } catch (error) {
    alertaInfo(error.message);
  }
};
//Eliminar un producto de un carrito en la API.
const deleteProductCartAPI = async (idP) => {
  const idC = currentUser.currentCart;
  let res = await fetch(`/api/carrito/${idC}/productos/${idP}`, {
    method: "DELETE",
  });
  res = await res.json();
  if (res.error) return alertaInfo(res.message);
  alertaInfo("PRODUCTO ELIMINADO");
};

const renderPerfilUsuario = (user)=>{
  const html = `
  <div class="ms-4 d-flex flex-column" style="width: 150px;">
  <img src="${user.avatar}"
    alt="${user.firstName}" class="img-fluid img-thumbnail mt-4 mb-2"
    style="width: 150px; z-index: 1">
</div>
<div class="ms-4">
  <h5>NOMBRE: ${user.firstName} ${user.lastName}</h5>
  <p>CORREO: ${user.email} </p>
  <p>ROL: ${user.role} </p>
  ${(user.role == "admin") ? '<a class="nav-link active" href="/admin">PANEL ADMIN</a>' : ''}
</div>
<div class="d-block m-auto me-0"></div>
<a class="btn btn-success btn-danger text-white me-3" href="/chat.html" role="button">CHAT</a>
  ${(user.role == "invitado") ? `<a class="btn btn-primary btn-danger text-white" href="/index.html" role="button">INGRESAR</a>` 
  : `<a class="btn btn-primary btn-danger text-white me-3" href="/orders.html" role="button">PEDIDOS</a>
  <a class="btn btn-warning btn-danger text-white" href="/logout.html" role="button">SALIR</a>`
  }
</div>`

perfilUsuario.innerHTML = html;
}

const dialogoInfo = document.getElementById("dialogoInfo");
function verAlerta() {
  dialogoInfo.classList.toggle("dialogoInfo-active");
}
let identificadorDeTemporizador;
function temporizadorAlerta() {
  identificadorDeTemporizador = setTimeout(verAlerta, 2000);
}
function alertaInfo(contenidoHTML) {
  dialogoInfo.innerHTML = contenidoHTML;
  verAlerta();
  temporizadorAlerta();
}
