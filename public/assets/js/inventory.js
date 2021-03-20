// Get references to page elements
const invList = $('#inventory-list');
const itemName = $('#item-name');
const itemDesc = $('#item-desc');
const itemQuant = $('#item-quantity');

let itemData;
let selectedChar;
let selectedItem;

// The API object contains methods for each kind of request we'll make
const API = {
  getInventory: function () {
    return $.ajax({
      url: `api/characters/${selectedChar}/inventory`,
      type: 'GET'
    });
  },
  updateQuantity: function (itemId, quantity) {
    return $.ajax({
      url: `api/characters/${selectedChar}/inventory/${itemId}`,
      type: 'PUT',
      data: { quantity }
    });
  }
};

// Get inventory list from API
const refreshInvList = function () {
  return API.getInventory().then(data => {
    const inv = data.map((item, idx) => {
      $('#itemDetails').addClass('hidden');
      const li = $('<li>')
        .addClass('list-group-item inv-btn')
        .attr('data-id', item.id)
        .attr('data-index', idx)
        .text(`${item.name}   ×${item.Inventory.quantity}`);

      return li;
    });

    itemData = data;
    invList.empty();
    invList.append(inv);

    if (selectedItem) {
      selectItem(invList.find(`[data-id=${selectedItem}]`));
    }

    $('.inv-btn').click(function () {
      selectItem($(this));
    });
  });
};

// Loads the selected item into the right column and highlights the selection
const selectItem = li => {
  const index = li.attr('data-index');

  $('.inv-btn').removeClass('selected-inv-btn');
  li.addClass('selected-inv-btn');

  if (itemData.length > 0) {
    selectedItem = itemData[index].id;
    $('#itemDetails').removeClass('hidden');
    itemName.text(itemData[index].name);
    itemDesc.text(decodeURI(itemData[index].description));
    itemQuant.val(itemData[index].Inventory.quantity);
  } else {
    $('#itemDetails').addClass('hidden');
    itemName.empty();
    itemDesc.empty();
  }
};

// Loads the selected character from session storage
const loadSelectedChar = () => {
  selectedChar = JSON.parse(sessionStorage.getItem('CharId'));
};

// On Increment click, add 1 to the quantity
$('#inc-quantity').click(() => {
  const $quantity = $('#item-quantity');
  let x = $quantity.val();
  x++;
  $quantity.val(x);
});

// On Decrement click, remove 1 from the quantity
$('#dec-quantity').click(() => {
  const $quantity = $('#item-quantity');
  let y = $quantity.val();
  if (y >= 1) {
    y--;
    $quantity.val(y);
  }
});

$('#save-quantity').click(() => {
  API.updateQuantity(selectedItem, $('#item-quantity').val())
    .then(refreshInvList);
});

$(function () {
  $('[data-toggle="tooltip"]').tooltip();
});

loadSelectedChar();
refreshInvList();
