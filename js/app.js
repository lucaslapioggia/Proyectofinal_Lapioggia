document.addEventListener("DOMContentLoaded", () => {
    const app = document.getElementById("app");

    app.innerHTML = `
        <h1>Simulador de Balance Mensual</h1>
        <form id="form">
            <input type="number" id="ingresos" placeholder="Ingresos" required>
            <input type="number" id="alquiler" placeholder="Alquiler">
            <input type="number" id="comida" placeholder="Comida">
            <input type="number" id="transporte" placeholder="Transporte">
            <input type="number" id="servicios" placeholder="Servicios">
            <input type="number" id="otros" placeholder="Otros">
            <button type="submit">Calcular Balance</button>
        </form>
        <div id="resultado"></div>
        <h2>Historial</h2>
        <table>
            <thead>
                <tr><th>Ingresos</th><th>Gastos</th><th>Balance</th><th>Acción</th></tr>
            </thead>
            <tbody id="historialBody"></tbody>
        </table>
    `;

    const form = document.getElementById("form");
    const historialBody = document.getElementById("historialBody");
    const resultado = document.getElementById("resultado");

    let historial = JSON.parse(localStorage.getItem("historial")) || [];

    function guardar() {
        localStorage.setItem("historial", JSON.stringify(historial));
    }

    function renderHistorial() {
        historialBody.innerHTML = "";
        historial.forEach((item, index) => {
            let row = document.createElement("tr");
            row.innerHTML = `
                <td>$${item.ingresos}</td>
                <td>$${item.gastos}</td>
                <td>$${item.balance}</td>
                <td><button onclick="eliminar(${index})">Eliminar</button></td>
            `;
            historialBody.appendChild(row);
        });
    }

    form.addEventListener("submit", e => {
        e.preventDefault();
        const ingresos = parseFloat(document.getElementById("ingresos").value);
        const gastos = ["alquiler", "comida", "transporte", "servicios", "otros"].reduce((total, id) => {
            return total + (parseFloat(document.getElementById(id).value) || 0);
        }, 0);
        const balance = ingresos - gastos;

        resultado.innerHTML = `
            <p><strong>Ingresos:</strong> $${ingresos}</p>
            <p><strong>Gastos:</strong> $${gastos}</p>
            <p><strong>Balance:</strong> $${balance}</p>
        `;

        historial.push({ ingresos, gastos, balance });
        guardar();
        renderHistorial();

        Swal.fire('Balance Calculado', 'Tu balance se ha guardado en el historial.', 'success');
        form.reset();
    });

    window.eliminar = function(index) {
        historial.splice(index, 1);
        guardar();
        renderHistorial();
        Swal.fire('Registro Eliminado', '', 'info');
    };

    renderHistorial();
});
