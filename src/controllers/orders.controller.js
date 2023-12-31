import __dirname from "../dirname.js";
import ordersService from "../services/orders.service.js";
import cartsService from "../services/carts.service.js";
import productsService from "../services/products.service.js";
import WSresponse from "../libs/WSresponse.js";
import mailer from "../utils/mailer.js";
import twilioClient from "../utils/twilioClient.js";
import config from "../config/config.js";
import logger from "../utils/logger.js";

const newOrder = async (req, res) => {
  try{
    //OBTENEMOS PRODUCTOS DEL CARRITO.
    const idCart = req.user.currentCart;
    const orderProducts = await cartsService.getProducts(idCart);

    if (!orderProducts.length) return res.status(400).json(new WSresponse(null, 'No se pueden enviar ordenes vacías! Agregue productos al carrito.', true));

    //CREAR ORDEN
    const order = await ordersService.createOrder(orderProducts, req.user.email);

    //BORRAMOS CARRITO DESPUES DE CREAR
    await cartsService.deleteById(idCart, req.user.id, req.user.email);

    //ACTUALIZAR STOCK DE PRODUCTOS
    orderProducts.forEach(async (prod) => {
      await productsService.updateStockById(prod._id, prod.quantity);
    })

    //ENVIO DEL MAIL DEL NUEVO PEDIDO
    const mailOptions = {
      from: 'FRANPAPEL SRL',
      to: config.TEST_MAIL,
      subject: `NUEVO PEDIDO DE ${req.user.firstName} (${req.user.email})`,
      html: `<h1 style="color: yellow;"> ¡NUEVO PEDIDO RECIBIDO! </h1>
      <h3 style="color: blue"> DATOS DE USUARIO </h3>
      <p>Email: ${order.email}</p>
      <p>title: ${req.user.firstName} ${req.user.lastName}</p>
      <p>Tel: ${req.user.tel}</p>
      <br>
      <h3 style="color: blue"> FACTURACION Y ENVIO </h3>
      <p>Orden #${order._id}</p>
      <p>${JSON.stringify(req.body, null, 2)}</p>
      <br>
      <h2 style="color: blue"> PRODUCTOS </h2>
      <ul>
        ${order.productos.map(prod =>{
          return `<li>title: ${prod.title} | price unitario: ${prod.price} | Cantidad: ${prod.quantity} | Total: ${prod.price * prod.quantity}</li>
          `
        }).join("")}
      </ul>
      <p>TOTAL DE LA ORDEN: ${order.productos.reduce((acc, act) => acc + act.price * act.quantity, 0)}</p>
      `
    }


    //Envio de SMS al cliente (Con twilio en version de prueba solo se puede enviara numeros verificados... Por eso no se pasa el del cliente como deberia ser).
    const smsOptions = {
      body: `HOLA, ${req.user.firstName}. TU ORDEN #${order._id} HA SIDO RECIBIDA.`,
      from: config.twilioSMSFrom,
      to: config.twilioSMSTo 
    }

    try {
        await mailer.sendMail(mailOptions);
        await twilioClient.messages.create(smsOptions);
    } catch (error) {
        logger.warn(error);
    }
    
    //Devolvemos al cliente los datos de la orden.
    res.status(201).json(new WSresponse(order, `ORDEN #${order._id} ENVIADA, TE CONTACTAREMOS PRONTO!!`));

  } catch (error) {
    return res.status(error.status || 500).json(new WSresponse(null, error.message, true));
  }
};

const getOrdersByEmail = async (req, res) =>{
  try {
    const email = req.params.email;
    const data = await ordersService.getOrdersByEmail(email);
    res.status(200).json(new WSresponse(data, "success"));
  } catch (error) {
      return res.status(error.status || 500).json(new WSresponse(null, error.message, true));
  } 
}

export default {
  newOrder,
  getOrdersByEmail
};
