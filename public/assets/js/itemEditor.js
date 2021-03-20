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
  },
  saveItem: function (itemData) {
    return $.ajax({
      url: 'api/items',
      type: 'POST',
      data: itemData
    });
  },
  updateItem: function (id, itemData) {
    return $.ajax({
      url: `api/items/${id}`,
      type: 'PUT',
      data: itemData
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

const saveItemForm = (form, e) => {
  e.preventDefault();

  const itemData = {
    name: itemNameInput.val().trim(),
    description: encodeURI(itemDescInput.val())
  };
  if (!selectedItem) {
    API.saveItem(itemData)
      .then(data => {
        sessionStorage.setItem('ItemId', data.id);
        location.href = '/add-item';
      });
  } else {
    API.updateItem(selectedItem, itemData)
      .then(data => {
        location.href = '/add-item';
      });
  }
};

$('#item-form').validate({
  rules: {
    name: {
      required: true,
      normalizer: value => $.trim(value)
    },
    description: {
      required: true,
      normalizer: value => $.trim(value)
    }
  },
  messages: {
    name: 'Required',
    description: 'Required'
  },
  submitHandler: saveItemForm,
  errorPlacement: (error, element) => {
    error.addClass('ml-5 validation-err');
    error.insertBefore(element);
  }
});

loadInitialData();
