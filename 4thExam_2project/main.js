const $result = document.querySelector("#result");
const $pagination = document.querySelector("#pagination")
let products = []
let current_page = 1
let product_per_page = 4

document.addEventListener("DOMContentLoaded", function () {
    getProducts()
})

async function getProducts() {
    const response = await fetch("https://fakestoreapi.com/products");
    products = await response.json()
    displayProducts()
    displayPagination(products)
}


const displayProducts = () => {
    $result.innerHTML = ""
    let start_index = (current_page - 1) * product_per_page
    let end_index = start_index + product_per_page

    let pagination_products = products.slice(start_index, end_index)
    pagination_products.forEach(product => {
        const card = document.createElement("div")
        card.className = "card"
        card.innerHTML = `
       <div class="card-image-container">
           
            <a href="../pages/product.html?product-id=${product.id}">
            <img class="picture" src="${product.image}"/>
            </a>
       </div>
       <div class="card-content">
            <h3>${product.title}</h3>
       </div>
        `
        $result.appendChild(card)
    });
}
function displayPagination() {
    $pagination.innerHTML = " "
    let page_count = Math.ceil(products.length / product_per_page)
    for (let i = 1; i <= page_count; i++) {
        let btn = document.createElement("button")
        btn.innerText = i
        btn.className = current_page === i ? "btn btn-succes mx-1" : "btn btn-outline-succes mx-1"
        btn.addEventListener('click', function () {
            current_page = i
            displayProducts()
        })
        $pagination.appendChild(btn)
    }
}
