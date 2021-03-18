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
  }
};

// Checks if a character ID was provided. If so, load that character's data
const loadInitialData = () => {
  selectedChar = JSON.parse(sessionStorage.getItem('CharId'));
  console.log(selectedChar);
  if (selectedChar) {
    API.getCharacter(selectedChar).then(data => {
      charNameInput.val(data.name);
      charGameInput.val(data.game);
      charDataInput.val(data.description);
    });
  }
};

loadInitialData();
