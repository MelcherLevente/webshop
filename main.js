fetch("http://localhost:3000/users")
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP hiba! Státusz: ${response.status}`);
        }
        return response.json();
    })
    .then(users => {
        const tableBody = document.getElementById("table-body");
        tableBody.replaceChildren();

        users.forEach(user => {
            const row = document.createElement("tr");
            
            [user.name, user.email, user.city, user.phone, user.role].forEach((value, index) => {
                const cell = document.createElement("td");
                if (index === 0) cell.className = "ps-3 fw-medium";
                
                // Szerepkör kiemelése badge-dzsel
                if (index === 4) {
                    const badge = document.createElement("span");
                    badge.className = "badge bg-secondary-subtle text-secondary-emphasis rounded-pill";
                    badge.textContent = value ?? "";
                    cell.appendChild(badge);
                } else {
                    cell.textContent = value ?? "";
                }
                row.appendChild(cell);
            });

            const actionsCell = document.createElement("td");
            actionsCell.className = "text-end pe-3 text-nowrap";

            const modifyButton = document.createElement("button");
            modifyButton.type = "button";
            modifyButton.className = "btn btn-sm btn-outline-primary me-2";
            modifyButton.textContent = "Módosítás";

            modifyButton.addEventListener("click", () => {
                document.getElementById("modify-id").value = user.id;
                document.getElementById("modify-name").value = user.name;
                document.getElementById("modify-email").value = user.email;
                document.getElementById("modify-city").value = user.city;
                document.getElementById("modify-phone").value = user.phone;

                document.getElementById("modify-section").scrollIntoView({ behavior: "smooth" });
            });

            const deleteButton = document.createElement("button");
            deleteButton.type = "button";
            deleteButton.className = "btn btn-sm btn-outline-danger";
            deleteButton.textContent = "Törlés";
            deleteButton.addEventListener("click", () => deleteUser(user.id));

            actionsCell.append(modifyButton, deleteButton);
            row.appendChild(actionsCell);
            tableBody.appendChild(row);
        });
    })
    .catch(error => {
        console.error("Hiba történt:", error);
    });

function submitUserForm(event) {
    fetch("http://localhost:3000/users", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name: document.getElementById("name").value,
            email: document.getElementById("email").value,
            city: document.getElementById("city").value,
            phone: document.getElementById("phone").value,
            role: "customer"
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Nem sikerült elküldeni a felhasználót: ${response.status}`);
        }
    })
    .then(() => window.location.reload())
    .catch(error => console.error(error));
}

function deleteUser(userId) {
    fetch("http://localhost:3000/users/" + userId, {
        method: "DELETE"
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Nem sikerült törölni a felhasználót: ${response.status}`);
        }
    })
    .then(() => window.location.reload())
    .catch(error => console.error(error));
}

function modifyUser() {
    const userId = document.getElementById("modify-id").value;
    fetch("http://localhost:3000/users/" + userId, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name: document.getElementById("modify-name").value,
            email: document.getElementById("modify-email").value,
            city: document.getElementById("modify-city").value,
            phone: document.getElementById("modify-phone").value,
            role: "customer"
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Nem sikerült módosítani a felhasználót: ${response.status}`);
        }
    })
    .then(() => window.location.reload())
    .catch(error => console.error(error));
}
