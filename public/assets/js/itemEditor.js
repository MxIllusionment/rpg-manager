const itemNameInput = $('#item-name-input');
const itemDescInput = $('#item-desc-input');

let selectedItem;

// The API object contains methods for each kind of request we'll make
const API = {
  getItem: function (id) {
    return $.ajax({
      url: `api/items/${id}`,
      type: 'GET'
    });
  }
};

// Checks if an item ID was provided. If so, load that item's data
const loadInitialData = () => {
  selectedItem = JSON.parse(sessionStorage.getItem('ItemId'));
  if (selectedItem) {
    API.getItem(selectedItem).then(data => {
      itemNameInput.val(data.name);
      itemDescInput.val(decodeURI(data.description));
      $('#title').text('Edit Item');
    });
  } else {
    $('#title').text('Create Item');
  }
};

loadInitialData();
