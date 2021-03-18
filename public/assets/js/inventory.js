// Get references to page elements
const invList = $('#inventory-list');
const itemName = $('#item-name');
const itemDesc = $('#item-desc');
const itemQuant = $('#item-quantity');

let itemData;
let selectedChar;

// The API object contains methods for each kind of request we'll make
const API = {
  getInventory: function () {
    return $.ajax({
      url: `api/characters/${selectedChar}/inventory`,
      type: 'GET'
    });
  }
};

// Get inventory list from API
const refreshInvList = function () {
  return API.getInventory().then(data => {
    const inv = data.map((item, idx) => {
      const li = $('<li>')
        .addClass('list-group-item inv-btn')
        .attr('data-id', item.id)
        .attr('data-index', idx)
        .text(`${item.name}   Quantity: ${item.Inventory.quantity}`);

      return li;
    });

    itemData = data;
    invList.empty();
    invList.append(inv);

    $('.inv-btn').click(function () {
      $('.inv-btn').removeClass('selected-inv-btn');
      $(this).addClass('selected-inv-btn');
      selectItem($(this).attr('data-index'));
    });
  });
};

// Loads the selected item into the right column
const selectItem = index => {
  if (itemData.length > 0) {
    itemName.text(itemData[index].name);
    itemDesc.text(itemData[index].description);
    itemQuant.val(itemData[index].Inventory.quantity);
  } else {
    itemName.empty();
    itemDesc.empty();
  }
};

// Loads the selected character from session storage
const loadSelectedChar = () => {
  selectedChar = JSON.parse(sessionStorage.getItem('CharId'));
};

loadSelectedChar();
refreshInvList();
