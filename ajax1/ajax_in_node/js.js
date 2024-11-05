$(document).ready(function() {
    $('#getPeople').click(function() {
      $.ajax({
        url: 'http://localhost:3000/cmd/people',
        method: 'GET',
        success: function(data) {
          let output = '<ul>';
          data.forEach(person => {
            output += `<li>${person.name}</li>`;
          });
          output += '</ul>';
          $('#output').html(output);
        },
        error: function(err) {
          console.log('Error:', err);
        }
      });
    });
  

    $.ajax({
      url: 'http://localhost:3000/cmd/getDrinkTypes',
      method: 'GET',
      success: function(response) {
        console.log("Drink Types List:", response);
 
        const drinkTypeSelect = $('#drinkType');
        drinkTypeSelect.empty();
        response.forEach(type => {
          drinkTypeSelect.append(new Option(type.typ, type.ID));
        });
      },
      error: function(error) {
        console.error("Error fetching drink types:", error);
      }
    });
  
 
    $('#drinkForm').submit(function(event) {
      event.preventDefault();
  
      const drinkData = [{
        date: new Date().toISOString().split('T')[0],
        id_people: $('#userId').val(),
        id_types: $('#drinkType').val()
      }];
  

      $.ajax({
        url: 'http://localhost:3000/cmd/saveDrinks',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(drinkData),
        success: function(response) {
          $('#saveMessage').html(response.message);
          $('#drinkForm')[0].reset();
        },
        error: function(err) {
          $('#saveMessage').html('Error saving drinks: ' + err.responseJSON.error);
        }
      });
    });
  });
  