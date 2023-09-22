const productosHTML = document.getElementById("productos");
const perfilUsuario = document.getElementById("perfilUsuario");
const category = document.getElementById("categories");
const sortBy = document.getElementById("ordenarPor");

let currentCategory = "default";
let currentSort = "default";

const renderCategories = (categoriesArray)=>{
    category.innerHTML = "";
    categoriesArray.forEach(category => {
        let contenedor = document.createElement("div");
        contenedor.id = category;
        contenedor.className = "py-2 px-4 bg-dark text-white mb-1 category";
        contenedor.innerHTML = `<strong class="small text-uppercase font-weight-bold">${category}</strong>`;

        contenedor.addEventListener("click", async (e)=>{
            try {
                const category = e.target.textContent;
                const products = await getProductsByCategory(category, currentSort);
                escribirProductosHTML(products);
                escribirModalesHTML(products);
                currentCategory = category;
            } catch (error) {
                alertaInfo(error.message)
            }
        });

        category.appendChild(contenedor);
    });

    let contenedor = document.createElement("a");
    contenedor.innerText = "→ Ver todos los productos ←";
    contenedor.className = "reset-anchor text-uppercase category";
    contenedor.addEventListener("click", async ()=>{
        await getProductsFromAPI(currentSort);
        escribirProductosHTML(productos);
        escribirModalesHTML(productos);
        currentCategory = "todos";
    });

    category.appendChild(contenedor);
}

const getCategories = async()=>{
    const categoriesArray = [];
    let res = await fetch("/api/categories");
    res = await res.json();
    res.data.forEach(data =>{
        categoriesArray.push(data._id);
    });
    return categoriesArray;
}

const getProductsByCategory = async (category, sortOp)=>{
    const sort = (sortOp != "default") ? `?sort=${sortOp}` : "";
    let res = await fetch("/api/productos/categoria/" + category + sort);
    res = await res.json();
    return res.data;
}

sortBy.addEventListener("change", async function () {
    let productosOrdenado;
    switch (this.value) {
        case "default":
            currentSort = "default";
            if (currentCategory == "todos"){
                productosOrdenado = await getProductsFromAPI(currentSort);
            }else{
                productosOrdenado = await getProductsByCategory(currentCategory, currentSort);
            }
            break;
        case "1":
            currentSort = 1;
            if (currentCategory == "todos"){
                productosOrdenado = await getProductsFromAPI(currentSort);
            }else{
                productosOrdenado = await getProductsByCategory(currentCategory, currentSort);
            }
            break;
        case "-1":
            currentSort = -1;
            if (currentCategory == "todos"){
                productosOrdenado = await getProductsFromAPI(currentSort);
            }else{
                productosOrdenado = await getProductsByCategory(currentCategory, currentSort);
            }
            break;
    }
    escribirProductosHTML(productosOrdenado);
    escribirModalesHTML(productosOrdenado);
});

const initial = async ()=>{
    await getUserDataFromAPI();
    renderPerfilUsuario(currentUser);
    await getProductsCartFromAPI();
    await getProductsFromAPI();
    escribirProductosHTML(productos);
    escribirModalesHTML(productos);
    const categoriesArray = await getCategories();
    renderCategories(categoriesArray);
}
initial();
