const Data_Api = "https://cdn.shopify.com/s/files/1/0564/3685/0790/files/singleProduct.json"

let product_title = "";
let product_color = "";
let product_size = "";

const getProductsDetails = async () => {
    try {
        const response = await axios.get(Data_Api);
        const productData = response.data.product;

        const vendor = document.querySelector(".vendor")
        vendor.innerHTML = productData.vendor;

        const title = document.querySelector(".title")
        product_title = productData.title
        title.innerHTML = product_title;

        const current_price = document.querySelector(".price")
        const price = productData.price;

        const total_price = document.querySelector(".stick_price")
        const compare_at_price = productData.compare_at_price;      

        // Calculate the percentage discount
        const price_amt = parseFloat(price.replace("$", ""));
        const compare_price_amt = parseFloat(compare_at_price.replace("$", ""));

        current_price.innerHTML ="$"+parseFloat(price_amt).toFixed(2);
        total_price.innerHTML ="$"+parseFloat(compare_price_amt).toFixed(2);

        const percentageDiscount = ((compare_price_amt - price_amt) / compare_price_amt) * 100;
        const discount = document.querySelector(".off")
        const final_dis = percentageDiscount.toFixed(0) + "% Off"
        discount.innerHTML = final_dis;

        document.querySelector(".main-image").innerHTML += `<img src="${productData.images[0].src}" alt="Main_Image" id="imgs">`

        const thumbnailsContainer = document.querySelector(".thumbnail-images");
        productData.images.forEach((image, index) => {
            const borderStyle = index === 0 ? "2px solid rgb(73, 73, 177)" : "none";
            thumbnailsContainer.innerHTML += `<img src="${image.src}" alt="Image ${index + 1}" onclick="clk(this)" style="border: ${borderStyle};">`;
        });
        
        const description = document.querySelector(".description");
        description.innerHTML += `<h4 class="description_details">${productData.description}</h4>`
    } catch (error) {
        console.error("Error fetching data:", error);
    }
};
getProductsDetails();

function clk(newImage) {
    let getImg = document.getElementById("imgs")
    getImg.src = newImage.src;

    // Remove border from all thumbnails
    const thumbnails = document.querySelectorAll(".thumbnail-images img");
    thumbnails.forEach((thumbnail) => {
        thumbnail.style.border = "none";
    });
    newImage.style.border = "2px solid rgb(73, 73, 177)";
}

const colorSelector = document.getElementById('colorSelector');
const selectedColorContainer = document.getElementById('selectedColor');
let selectedColorIndex = null;
let getColor = ""

const getColors = async () => {
    try {
        const response = await axios.get(Data_Api);
        colors = response.data.product.options[0].values;

        colors.forEach((color, index) => {
            const colorLabel = document.createElement('div');
            colorLabel.classList.add('color-label');
            colorLabel.style.backgroundColor = Object.values(color)[0];
            colorLabel.addEventListener('click', () => handleColorClick(index));
            colorLabel.addEventListener('transitionend', handleTransitionEnd);

            const tick = document.createElement('div');
            tick.classList.add('selected-tick');
            tick.textContent = '✓';

            const border = document.createElement('div');
            border.classList.add('selected-border');

            colorLabel.appendChild(tick);
            colorLabel.appendChild(border);
            colorSelector.appendChild(colorLabel);
        });
    } catch (error) {
        console.error("Error fetching data:", error);
    }
};
getColors();

function handleColorClick(index) {
    selectedColorIndex = index;
    updateSelectedColor();
}
function handleTransitionEnd(event) {
    if (event.propertyName === 'transform') {
        const colorLabel = event.target;
        colorLabel.classList.remove('clicked');
    }
}
function updateSelectedColor() {
    const colorLabels = document.querySelectorAll('.color-label');
    colorLabels.forEach((label, index) => {
        if (index === selectedColorIndex) {
            label.classList.add('selected', 'clicked');
        }
        else {
            label.classList.remove('selected');
        }
    });

    if (selectedColorIndex !== null) {
        const selectedColorKey = Object.keys(colors[selectedColorIndex])[0];
        getColor = selectedColorKey
        product_color = getColor
        // console.log("Selected Color:", getColor);
    }
}

const sizeSelector = document.getElementById('sizeSelector');
let selectedCheckbox = null;
const getSizes = async () => {
    try {
        const response = await axios.get(Data_Api);
        const sizes = response.data.product.options[1].values;

        sizes.forEach((size) => {
            const sizeLabel = document.createElement('label');
            sizeLabel.classList.add('size-label');

            const sizeCheckbox = document.createElement('input');
            sizeCheckbox.type = 'radio';
            sizeCheckbox.classList.add('size-checkbox');
            sizeCheckbox.value = size;
            sizeCheckbox.addEventListener('change', () => handleSizeChange(sizeCheckbox));

            const sizeText = document.createTextNode(size);

            sizeLabel.appendChild(sizeCheckbox);
            sizeLabel.appendChild(sizeText);

            sizeSelector.appendChild(sizeLabel);
        });
    } catch (error) {
        console.error("Error fetching data:", error);
    }
};

getSizes();
function handleSizeChange(checkbox) {
    if (selectedCheckbox && selectedCheckbox !== checkbox) {
        selectedCheckbox.checked = false;
    }
    selectedCheckbox = checkbox;
    product_size = selectedCheckbox.value
    // console.log(selectedCheckbox.value)
}

const decreaseBtn = document.getElementById('decreaseBtn');
const increaseBtn = document.getElementById('increaseBtn');
const valueElement = document.getElementById('value');
let value = 0;

decreaseBtn.addEventListener('click', () => {
    value = Math.max(value - 1, 0);
    updateValue();
});
increaseBtn.addEventListener('click', () => {
    value++;
    updateValue();
});
function updateValue() {
    valueElement.textContent = value;
}

const Add_to_cart = document.querySelector(".addToCart");
Add_to_cart.addEventListener('click', () => {
    const prduct_saved = document.querySelector(".prduct_saved");
    prduct_saved.innerHTML = '';
    prduct_saved.innerHTML += `<span class="Info">${product_title} with Color ${product_color} and Size ${product_size} added to the cart</span>`
});