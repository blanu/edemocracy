var participants=[];

function makeParticipant(text)
{
  return '<li class="participant"><button class="deleteParticipant" value="'+text+'">X</button> <span class="participantName">'+text+'</span> <button class="queueParticipant">+</button></li>';
}

function makeQueue(text)
{
  return '<li class="participant"><button class="deleteItem" value="'+text+'">X</button> <span class="participantName">'+text+'</span> <button class="dequeueParticipant">v</button></li>';
}

function makeHistory(text)
{
  return '<li class="participant"><button class="deleteItem" value="'+text+'">X</button> <span class="participantName">'+text+'</span></li>';
}

function deleteItem()
{
  $(this).parent().remove();
}

function deleteParticipant()
{
  log(participants);
  var text=$(this).next().text();
  log(text);
  var index=jQuery.inArray(text, participants);
  log(index);
  if(index!=-1)
  {
    participants.splice(index, 1);
  }
  log(participants);

  deleteItem();
  addParticipants();
}

function queueParticipant(button)
{
  var text=$(this).prev().text();
  log('queue '+text);
  $('#queue').append(makeQueue(text));  
  activateButtons();
}

function dequeueParticipant(button)
{
  var text=$(this).prev().text();
  log('dequeue '+text);
  $(this).parent().remove();
  $('#history').append(makeHistory(text));  
  activateButtons();
}

function activateButtons()
{
  $('.deleteParticipant').unbind('click');
  $('.deleteParticipant').click(deleteParticipant);
  
  $('.deleteItem').unbind('click');
  $('.deleteItem').click(deleteItem);

  $('.queueParticipant').unbind('click');
  $('.queueParticipant').click(queueParticipant);

  $('.dequeueParticipant').unbind('click');
  $('.dequeueParticipant').click(dequeueParticipant);
  $('.dequeueParticipant').hide();
  $('.dequeueParticipant').first().show();
}

function add(text)
{
  log('adding participant '+text);
  $('#participants').append(makeParticipant(text));
  activateButtons();
}

function addParticipants()
{
  $('#participants').empty();

  participants=participants.sort();
  for(var i=0; i<participants.length; i++)
  {
    var p=participants[i];
    add(p);
  }
}

function addParticipant()
{
  var text=$('#addParticipantField').val();
  participants.push(text);
  log(participants);
  addParticipants();
  $('#addParticipantField').val('');

  return false;
}

function init()
{
  $('#addParticipantButton').click(addParticipant);
}

$(document).ready(init);

