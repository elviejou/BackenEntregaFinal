class OrderDTO {
    constructor(id, email, productsArray){
        this._id = id;
        this.email = email;
        this.productos = [];
        productsArray.forEach(prod =>{
            this.productos.push({
                id: prod.id || prod._id,
                title: prod.title,
                descripcion: prod.descripcion,
                price: prod.price,
                quantity: prod.quantity,
                thumbnails: prod.thumbnails
            })
        })
    }
}

export default OrderDTO;