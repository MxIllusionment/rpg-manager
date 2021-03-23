// Get references to page elements
const characterList = $('#character-list');
const characterName = $('#character-name');
const characterGame = $('#character-game');
const characterDesc = $('#character-desc');

let characterData;
let selectedChar;

// The API object contains methods for each kind of request we'll make
const API = {
  getCharacters: function () {
    return $.ajax({
      url: 'api/characters',
      type: 'GET'
    });
  },
  deleteCharacter: function () {
    return $.ajax({
      url: `api/characters/${selectedChar}`,
      type: 'DELETE'
    });
  }
};

// Get character list from API
const refreshCharacterList = function () {
  return API.getCharacters().then(data => {
    const characters = data.map((char, idx) => {
      $('#charDetails').addClass('hidden');
      const li = $('<li>')
        .addClass('list-group-item character-btn')
        .attr('data-id', char.id)
        .attr('data-index', idx)
        .text(char.name);

      return li;
    });
    characterData = data;
    characterList.empty();
    characterList.append(characters);

    $('.character-btn').click(function () {
      selectCharacter($(this));
      sessionStorage.setItem('CharId', JSON.stringify($(this).attr('data-id')));
    });
  });
};

// Loads the selected character into the right column and highlight the list item
const selectCharacter = li => {
  const index = li.attr('data-index');

  // Highlight currently selected character
  $('.character-btn').removeClass('selected-char-btn');
  li.addClass('selected-char-btn');

  if (characterData.length > 0) {
    $('#charDetails').removeClass('hidden');
    characterName.text(characterData[index].name);
    characterGame.text(characterData[index].game);
    characterDesc.text(decodeURI(characterData[index].description));
    selectedChar = characterData[index].id;
  } else {
    characterName.empty();
    characterGame.empty();
    characterDesc.empty();
  }
};

// Loads the current character from the session
const loadCurrentCharacter = () => {
  const currentChar = parseInt(JSON.parse(sessionStorage.getItem('CharId')));

  if (currentChar) {
    // Find character entry in data
    const li = characterList.find(`[data-id=${currentChar}]`);

    if (li !== -1) {
      selectCharacter(li);
    }
  }
};

// On Create Character click, clear the character ID
$('#create-character').click(() => {
  sessionStorage.removeItem('CharId');
});

// Remove Character
$('#remove-char').click(e => {
  e.preventDefault();
  API.deleteCharacter()
    .then(refreshCharacterList);
});

$(function () {
  $('[data-toggle="tooltip"]').tooltip();
});

refreshCharacterList()
  .then(loadCurrentCharacter);
