// Get references to page elements
const characterList = $('#character-list');
const characterName = $('#character-name');
const characterGame = $('#character-game');
const characterDesc = $('#character-desc');

let characterData;

// The API object contains methods for each kind of request we'll make
const API = {
  getCharacters: function () {
    return $.ajax({
      url: 'api/characters',
      type: 'GET'
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

      const delButton = $('<button>')
        .addClass('btn btn-danger float-right delete')
        .text('ｘ');

      li.append(delButton);

      return li;
    });
    characterData = data;
    characterList.empty();
    characterList.append(characters);

    $('.character-btn').click(function () {
      $('.character-btn').removeClass('selected-char-btn');
      $(this).addClass('selected-char-btn');
      selectCharacter($(this).attr('data-index'));
      sessionStorage.setItem('CharId', JSON.stringify($(this).attr('data-id')));
    });
  });
};

// Loads the selected character into the right column
const selectCharacter = index => {
  if (characterData.length > 0) {
    $('#charDetails').removeClass('hidden');
    characterName.text(characterData[index].name);
    characterGame.text(characterData[index].game);
    characterDesc.text(decodeURI(characterData[index].description));
  } else {
    characterName.empty();
    characterGame.empty();
    characterDesc.empty();
  }
};

// On Create Character click, clear the character ID
$('#create-character').click(() => {
  sessionStorage.removeItem('CharId');
});

$(function () {
  $('[data-toggle="tooltip"]').tooltip();
});

refreshCharacterList();
