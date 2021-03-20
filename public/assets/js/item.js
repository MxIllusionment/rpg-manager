// Get references to page elements
const itemList = $('#item-list');
const itemName = $('#item-name');
const itemDesc = $('#item-desc');

let itemData;

// The API object contains methods for each kind of request we'll make
const API = {
  getItems: function () {
    return $.ajax({
      url: 'api/items',
      type: 'GET'
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

  if (itemData.length > 0) {
    itemName.text(itemData[index].name);
    itemDesc.text(decodeURI(itemData[index].description));
  } else {
    itemName.empty();
    itemDesc.empty();
  }
};

// Loads the current item from the session
const loadCurrentItem = () => {
  const currentItem = parseInt(JSON.parse(sessionStorage.getItem('ItemId')));

  if (currentItem) {
    // Find character entry in data
    const li = itemList.find(`[data-id=${currentItem}]`);

    if (li !== -1) {
      selectItem(li);
    }
  }
};

// On Create Item click, clear the item ID
$('#create-item').click(() => {
  sessionStorage.removeItem('ItemId');
});

$(function () {
  $('[data-toggle="tooltip"]').tooltip();
});

refreshItemList()
  .then(loadCurrentItem);
