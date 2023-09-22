import { faker } from "@faker-js/faker";
faker.locale = "es";

const get = () => ({
    name: faker.commerce.productName(),
    description: "FAKER DESDE MOCHA",
    code: `xxx${faker.random.numeric(3)}`,
    price: faker.commerce.price(1000),
    stock: faker.random.numeric(2),
    thumbnails: faker.image.food(400,400, true)
})

export default {get};