

// Build inventory items into the HTML table components and inject into DOM
function buildInventoryList(data) {
    let inventoryDisplay = document.getElementById("inventoryDisplay");
    // Set up the table labels
    let dataTable = '<thead>';
    dataTable += '<tr><th>Vehicle Name</th><td>&nbsp;</td><td>&nbsp;</td></tr>';
    dataTable += '</thead>';
    // Set up the table body
    dataTable += '<tbody>';
    // Iterate over all vehicles in the array and put each in a row
    data.array.forEach(function (element) {
        console.log(element.inv_id + "," + element.inv_model);
        dataTable += `<tr><td>${element.inv_make} ${element.inv_model} </td>`;
        dataTable += `<td><a href='/inv/edit/${element.inv_id}' title='Click to update'>Modify</a></td>`;
        dataTable += `<td><a href='/inv/delete/${element.inv_id}' title='Click to delete'>Delete</a></td></tr>`;
    });
    dataTable += '</tbody>';
    // Display the contents in the Inventory Management view
    inventoryDisplay.innerHTML = dataTable;
}