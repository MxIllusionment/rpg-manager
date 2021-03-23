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
  },
  deleteInventory: function (itemId) {
    return $.ajax({
      url: `api/characters/${selectedChar}/inventory/${itemId}`,
      type: 'DELETE'
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
  let x = itemQuant.val();
  if (x < 99) {
    x++;
    itemQuant.val(x);
  }
});

// On Decrement click, remove 1 from the quantity
$('#dec-quantity').click(() => {
  let y = itemQuant.val();
  if (y > 0) {
    y--;
    itemQuant.val(y);
  }
});

// Submit and save quantity
$('#quantity-form').submit(e => {
  e.preventDefault();
  API.updateQuantity(selectedItem, itemQuant.val())
    .then(refreshInvList);
});

// Remove Item
$('#remove-item').click(e => {
  e.preventDefault();
  API.deleteInventory(selectedItem)
    .then(refreshInvList);
});
// Validate item quantity on value change
itemQuant.change(() => {
  const val = parseInt(itemQuant.val());
  if (isNaN(val)) {
    itemQuant.val(0);
  } else if (val > 99) {
    itemQuant.val(99);
  } else if (val < 0) {
    itemQuant.val(0);
  } else {
    itemQuant.val(val);
  }
});

$(function () {
  $('[data-toggle="tooltip"]').tooltip();
});

loadSelectedChar();
refreshInvList();
