const checkoutForm = document.getElementById("form-checkout");
const checkuotAdress = document.getElementById("alternateAddressCheckbox");
const checkuotAdress2 = document.getElementById("alternateAddress");
const itemTitle = document.getElementById("title");
const checkLastName = document.getElementById("apellido");
const checkEmail = document.getElementById("email");
const checkPhone = document.getElementById("tel");
const checkId = document.getElementById("dni");
const checkAdress = document.getElementById("domicilio");
const checkCity = document.getElementById("ciudad");
const checkState = document.getElementById("provincia");
const itemTitleSend = document.getElementById("titleEnvio");
const checkLastNameSend = document.getElementById("apellidoEnvio");
const checkEmailSend = document.getElementById("emailEnvio");
const checkPhoneSend = document.getElementById("telEnvio");
const checkIdSend = document.getElementById("dniEnvio");
const checkAdressSend = document.getElementById("domicilioEnvio");
const checkCitySend = document.getElementById("ciudadEnvio");
const checkStateSend = document.getElementById("provinciaEnvio");
const orden = document.getElementById("productos");
const infoPost = [];

//FLAG
let bandera = false;

//OREDER
const renderOrden = async ()=>{
    //AGREGAMOS PRODUCTOS A LA ORDEN
    await getProductsCartFromAPI();
    let total = 0;
    cart.forEach(producto =>{
        total += (producto.price * producto.quantity);
        let liProducto = document.createElement("li");
        liProducto.className = "d-flex align-items-center justify-content-between";
        let liSeparador = document.createElement("li");
        liSeparador.className = "border-bottom my-2";
        liProducto.innerHTML = `<strong class="small font-weight-bold">(${producto.quantity})-${producto.title}</strong><span class="text-muted small">$${producto.price*producto.quantity}</span>`;
        orden.appendChild(liProducto);
        orden.appendChild(liSeparador);
    });

    //TOTAL
    let totalLi = document.createElement("li");
    totalLi.className = "d-flex align-items-center justify-content-between mt-2 p-2 bg-dark text-white";
    totalLi.innerHTML = `<strong class="text-uppercase small font-weight-bold">Total</strong><span>$${total-desc}</span>`;
    orden.appendChild(totalLi);
}

(checkuotAdress.checked) ? checkuotAdress2.classList.remove("d-none") : checkuotAdress2.classList.add("d-none");
checkuotAdress.addEventListener("change",()=>{
    checkuotAdress2.classList.toggle("d-none");
});

checkoutForm.addEventListener("submit", async function (e){
    e.preventDefault();
    validarForm();
    if (bandera) {
        await pushData();
        postOrden();
        //FINALIZAR ORDEN();
    };
});
//VALIDAMOS FORMULARIO
function validarForm () {
    let inputs = document.getElementsByClassName("form-input");
    for (let input = 0; input < 8; input++){
        if (inputs[input].value == ""){
            bandera = false;
            inputs[input].classList.add("border-danger");
            Swal.fire({
                title: '<strong>HAY CAMPOS <u>SIN COMPLETAR!!</u></strong>',
                icon: 'info',
                html:
                  `HAY CAMPOS SIN COMPLETAR!!` ,
                showCloseButton: true,
                showCancelButton: false,
                focusConfirm: false,
              });
        } else{
            bandera = true;
        };
        inputs[input].addEventListener("change",()=>{
            if (inputs[input].value != ""){
                inputs[input].classList.remove("border-danger");
            }else{
                inputs[input].classList.add("border-danger");
            }
        })
    }
    //VALIDAMOS DATOS SI LA DIRECCIONDE ENVIO DIFIERE
    if (checkuotAdress.checked){
        for (let input = 8; input < 16; input++){
            if (inputs[input].value == ""){
                bandera = false;
                inputs[input].classList.add("border-danger");
                Swal.fire({
                    title: '<strong>HAY CAMPOS <u>SIN COMPLETAR!!</u></strong>',
                    icon: 'info',
                    html:
                      `HAY CAMPOS SIN COMPLETAR!!` ,
                    showCloseButton: true,
                    showCancelButton: false,
                    focusConfirm: false,
                  });
            }else{
                bandera = true;
            };
            //Borramos la clase border-danger cuando el input tenga algun value.
            inputs[input].addEventListener("change",()=>{
                if (inputs[input].value != ""){
                    inputs[input].classList.remove("border-danger");
                }else{
                    inputs[input].classList.add("border-danger");
                }
            })
        }
    }
    
}

async function pushData(){
    infoPost.push({
        invoice_title: itemTitle.value,
        invoice_lastname: checkLastName.value,
        invoice_email: checkEmail.value,
        invoice_phone: checkPhone.value,
        invoice_id: checkId.value,
        invoice_adress: checkAdress.value,
        invoice_city: checkCity.value,
        invoice_state: checkState.value,
        send_title: itemTitleSend.value,
        send_lastname: checkLastNameSend.value,
        send_email: checkEmailSend.value,
        send_phone: checkPhoneSend.value,
        send_id: checkIdSend.value,
        send_adress: checkAdressSend.value,
        send_city: checkCitySend.value,
        send_state: checkStateSend.value
    })
}

async function postOrden () {
    try {
        alertaInfo("ENVIANDO ORDEN...!!!");

        let res = await fetch("/api/order", {
            method: "POST",
            body: JSON.stringify(infoPost[0]),
            headers: {"Content-Type": "application/json"}
        })
    
        res = await res.json();
    
        if (res.error) return Swal.fire({
            title: `<strong>ERROR AL GENERAR LA ORDEN :(</strong>`,
            icon: 'error',
            html: res.message,
            showCloseButton: true,
            showCancelButton: false,
            showConfirmButton: false,
            focusConfirm: false,
            timer: 3000
        })
    
        Swal.fire({
            title: `<strong>ORDEN #${res.data._id} ENVIADA</strong>`,
            icon: 'success',
            html: res.message,
            showCloseButton: true,
            showCancelButton: false,
            showConfirmButton: false,
            focusConfirm: false,
            timer: 10000
          }).then(()=>{
              location.href = "/store.html";
          });

    } catch (error) {
        Swal.fire({
            title: `<strong>ERROR AL GENERAR LA ORDEN :(</strong>`,
            icon: 'error',
            html: error.message,
            showCloseButton: true,
            showCancelButton: false,
            showConfirmButton: false,
            focusConfirm: false,
            timer: 3000
        })
    }
} 

getUserDataFromAPI().then(res =>{
    renderPerfilUsuario(currentUser);
    renderOrden();
    });