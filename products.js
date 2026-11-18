fetch("http://localhost:3000/products")
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP hiba! Státusz: ${response.status}`);
        }
        return response.json();
    })
    .then(products => {
        const container = document.getElementById("products-container");
        container.replaceChildren();

        products.forEach(product => {
            const col = document.createElement("div");
            col.className = "col";

            const card = document.createElement("div");
            card.className = "card h-100 shadow-sm border-0";

            const img = document.createElement("img");
            img.src = product.image ? product.image : "https://placehold.co";
            img.alt = product.name;
            img.className = "card-img-top object-fit-cover";
            img.style.height = "200px";

            const cardBody = document.createElement("div");
            cardBody.className = "card-body d-flex flex-column";

            const headerDiv = document.createElement("div");
            headerDiv.className = "d-flex justify-content-between align-items-start mb-2";

            const title = document.createElement("h5");
            title.className = "card-title mb-0 fw-bold";
            title.textContent = product.name;

            const ratingBadge = document.createElement("span");
            ratingBadge.className = "badge bg-warning text-dark";
            ratingBadge.textContent = `★ ${product.rating ?? 0}`;

            headerDiv.append(title, ratingBadge);

            const manufacturerText = document.createElement("p");
            manufacturerText.className = "text-muted small mb-2";
            const mName = product.manufacturer?.name;
            const mCountry = product.manufacturer?.country;
            if (mName || mCountry) {
                manufacturerText.textContent = `Gyártó: ${mName ?? ""} ${mCountry ? `(${mCountry})` : ""}`;
            } else {
                manufacturerText.textContent = "Gyártó: Nincs megadva";
            }

            const priceText = document.createElement("h4");
            priceText.className = "text-primary fw-bold mb-1";
            priceText.textContent = `${Number(product.price).toLocaleString("hu-HU")} Ft`;

            const stockText = document.createElement("p");
            stockText.className = `small mb-3 ${product.stock > 0 ? "text-success" : "text-danger"}`;
            stockText.textContent = product.stock > 0 ? `Raktáron: ${product.stock} db` : "Elfogyott";

            const featuresDiv = document.createElement("div");
            featuresDiv.className = "mb-3 d-flex flex-wrap gap-1";
            if (Array.isArray(product.features) && product.features.length > 0) {
                product.features.forEach(feature => {
                    const badge = document.createElement("span");
                    badge.className = "badge bg-secondary-subtle text-secondary-emphasis";
                    badge.textContent = feature;
                    featuresDiv.appendChild(badge);
                });
            }

            const footerDiv = document.createElement("div");
            footerDiv.className = "mt-auto pt-2 border-top d-flex justify-content-end";

            const deleteBtn = document.createElement("button");
            deleteBtn.type = "button";
            deleteBtn.className = "btn btn-sm btn-outline-danger";
            deleteBtn.textContent = "Törlés";
            deleteBtn.addEventListener("click", () => deleteProduct(product.id));

            footerDiv.appendChild(deleteBtn);

            cardBody.append(headerDiv, manufacturerText, priceText, stockText, featuresDiv, footerDiv);
            card.append(img, cardBody);
            col.appendChild(card);
            container.appendChild(col);
        });
    })
    .catch(error => {
        console.error("Hiba történt a termékek betöltésekor:", error);
    });

function deleteProduct(productId){
    fetch("http://localhost:3000/products/" + productId, {
        method: "DELETE"
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Nem sikerült törölni a terméket: ${response.status}`);
        }
    })
    .then(() => window.location.reload())
    .catch(error => console.error(error));
}

function submitProductForm(event) {
    const featuresInput = document.getElementById("product-features").value;
    const featuresArray = featuresInput
        .split(",")
        .map(item => item.trim())
        .filter(item => item !== "");

    const mName = document.getElementById("manufacturer-name").value.trim();
    const mCountry = document.getElementById("manufacturer-country").value.trim();

    const manufacturerObj = {};
    if (mName) manufacturerObj.name = mName;
    if (mCountry) manufacturerObj.country = mCountry;

    const newProduct = {
        name: document.getElementById("product-name").value,
        price: Number(document.getElementById("product-price").value),
        stock: Number(document.getElementById("product-stock").value),
        rating: Number(document.getElementById("product-rating").value) || 0,
        manufacturer: manufacturerObj,
        image: document.getElementById("product-image").value.trim(),
        features: featuresArray
    };

    fetch("http://localhost:3000/products/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(newProduct)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Nem sikerült menteni a terméket: ${response.status}`);
        }
    })
    .then(() => window.location.reload())
    .catch(error => console.error(error));
}