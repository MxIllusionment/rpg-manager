// Get references to page elements
const itemList = $('#item-list');
const itemName = $('#item-name');
const itemDesc = $('#item-desc');

let itemData;
let selectedChar;
let selectedItem;
let inventory;

// The API object contains methods for each kind of request we'll make
const API = {
  getItems: function () {
    return $.ajax({
      url: 'api/items',
      type: 'GET'
    });
  },
  getInventory: function (charId) {
    return $.ajax({
      url: `api/characters/${charId}/inventory`,
      type: 'GET'
    });
  },
  addItemToInventory: function (charId, itemData) {
    return $.ajax({
      url: `api/characters/${charId}/inventory`,
      type: 'POST',
      data: itemData
    });
  }
};

// Get item list from API
const refreshItemList = function () {
  return API.getItems().then(data => {
    const items = data.map((item, idx) => {
      const li = $('<li>')
        .addClass('list-group-item item-btn')
        .attr('data-id', item.id)
        .attr('data-index', idx)
        .attr('data-allow-add', !inventory.includes(item.id))
        .text(item.name);

      return li;
    });

    itemData = data;
    itemList.empty();
    itemList.append(items);

    $('.item-btn').click(function () {
      selectItem($(this));
      sessionStorage.setItem('ItemId', JSON.stringify($(this).attr('data-id')));
    });
  });
};

// Loads the selected item into the right column and highlights the list item
const selectItem = li => {
  const index = li.attr('data-index');

  $('.item-btn').removeClass('selected-item-btn');
  li.addClass('selected-item-btn');
  $('.item-block').removeClass('hidden');

  if (itemData.length > 0) {
    selectedItem = parseInt(itemData[index].id);
    itemName.text(itemData[index].name);
    itemDesc.text(decodeURI(itemData[index].description));
    if (itemData[index].UserId === parseInt(sessionStorage.getItem('EditorId'))) {
      $('#edit-icon').removeClass('remove');
    } else {
      $('#edit-icon').addClass('remove');
    }
    if (li.attr('data-allow-add') === 'true') {
      $('#add-icon').removeClass('remove');
    } else {
      $('#add-icon').addClass('remove');
    }
  } else {
    selectedItem = 0;
    itemName.empty();
    itemDesc.empty();
  }
};

// Loads the current item from the session
const loadCurrent = () => {
  const currentItem = parseInt(JSON.parse(sessionStorage.getItem('ItemId')));

  if (currentItem) {
    // Find character entry in data
    const li = itemList.find(`[data-id=${currentItem}]`);

    if (li !== -1) {
      selectItem(li);
    }
  }
};

// Loads the current character's inventory
const loadInventory = () => {
  selectedChar = parseInt(JSON.parse(sessionStorage.getItem('CharId')));
  return API.getInventory(selectedChar).then(data => {
    inventory = data.map(item => item.id);
  });
};

const returnToInventory = () => {
  sessionStorage.removeItem('ItemId');
  sessionStorage.removeItem('EditorId');
  location.href = '/inventory-tracker';
};

$('#add-icon').click(() => {
  if (selectedChar && selectedItem) {
    const itemData = {
      id: selectedItem
    };
    API.addItemToInventory(selectedChar, itemData)
      .then(returnToInventory);
  }
});

// On Create Item click, clear the item ID
$('#create-item').click(() => {
  sessionStorage.removeItem('ItemId');
});

$('#return-icon').click(returnToInventory);

$(function () {
  $('[data-toggle="tooltip"]').tooltip();
});

loadInventory()
  .then(refreshItemList)
  .then(loadCurrent);
