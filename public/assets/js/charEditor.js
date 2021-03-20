const charNameInput = $('#char-name-input');
const charGameInput = $('#char-game-input');
const charDataInput = $('#char-data-input');

let selectedChar;

// The API object contains methods for each kind of request we'll make
const API = {
  getCharacter: function (id) {
    return $.ajax({
      url: `api/characters/${id}`,
      type: 'GET'
    });
  },
  saveCharacter: function (charData) {
    return $.ajax({
      url: 'api/characters',
      type: 'POST',
      data: charData
    });
  },
  updateCharacter: function (id, charData) {
    return $.ajax({
      url: `api/characters/${id}`,
      type: 'PUT',
      data: charData
    });
  }
};

// Checks if a character ID was provided. If so, load that character's data
const loadInitialData = () => {
  selectedChar = JSON.parse(sessionStorage.getItem('CharId'));
  if (selectedChar) {
    API.getCharacter(selectedChar).then(data => {
      charNameInput.val(data.name);
      charGameInput.val(data.game);
      charDataInput.val(decodeURI(data.description));
      $('#title').text('Edit Character');
    });
  } else {
    $('#title').text('Create Character');
  }
};

const saveCharacterForm = (form, e) => {
  e.preventDefault();
  const charData = {
    name: charNameInput.val().trim(),
    game: charGameInput.val().trim(),
    description: encodeURI(charDataInput.val())
  };
  if (!selectedChar) {
    API.saveCharacter(charData)
      .then(data => {
        sessionStorage.setItem('CharId', data.id);
        location.href = '/';
      });
  } else {
    API.updateCharacter(selectedChar, charData)
      .then(data => {
        location.href = '/';
      });
  }
};

$('#character-form').validate({
  rules: {
    name: {
      required: true,
      normalizer: value => $.trim(value)
    },
    game: {
      required: true,
      normalizer: value => $.trim(value)
    },
    data: {
      required: true,
      normalizer: value => $.trim(value)
    }
  },
  messages: {
    name: 'Required',
    game: 'Required',
    data: 'Required'
  },
  submitHandler: saveCharacterForm,
  errorPlacement: (error, element) => {
    error.addClass('ml-5 validation-err');
    error.insertBefore(element);
  }
});

loadInitialData();
