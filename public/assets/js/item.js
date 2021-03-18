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
      $('.item-btn').removeClass('selected-item-btn');
      $(this).addClass('selected-item-btn');
      selectItem($(this).attr('data-index'));
      sessionStorage.setItem('ItemId', JSON.stringify($(this).attr('data-id')));
    });
  });
};

// Loads the selected item into the right column
const selectItem = index => {
  if (itemData.length > 0) {
    itemName.text(itemData[index].name);
    itemDesc.text(decodeURI(itemData[index].description));
  } else {
    itemName.empty();
    itemDesc.empty();
  }
};

// On Create Item click, clear the item ID
$('#create-item').click(() => {
  sessionStorage.removeItem('ItemId');
});

refreshItemList();
