var attendeesStat=0;
var membersStat=0;
var quorumStat=0;
var majorityStat=0;
var checkStat=false;

var members=[
    'Encenito Acedillo',
    'Martin Bogomolni',
    'Eric Blount',
    'Angie Bonser',
    'Paul Bonser',
    'Derek Bridges',
    'Marina Braverman@',
    'Brent Burton',
    'Aaron Choate',
    'Richard Clark@',
    'Tom Davidson@',
    'Mert Eastman',
    'Michelle Elbert',
    'Cara Fealy-Choate',
    'Chad Franke',
    'Tim Fredlund@',
    'Vladimir Garner',
    'Andy Howell@',
    'Andrew Harris@',
    'Jonathan Kelly',
    'Mandie Kramer',
    'Matthew Ludlum',
    'Matt Mancuso',
    'Matt McCabe',
    'Roland McIntosh',
    'Chris McLaughlin',
    'David Mitchell',
    'Evelyn Nelson',
    'Karl Pauls@',
    'Marshall Peck',
    'Mike Rich',
    'Jessica Ross',
    'Joe Saunders$$',
    'Scott Saunders',
    'Michael Smith',
    'Patricia Swarin',
    'Douglas Swarin',
    'Bill Tyler@',
    'Elom Tsogbe@$$',
    'Marshall Vaughan',
    'John Wiggins',
    'Pat Wheaton@',
    'Gardner Williams',
];

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

function memberClick()
{
    console.log("clicked");
    if($(this).hasClass('memberCheckbox'))
    {
        console.log('is member');
        if($(this).is(':checked'))
        {
            attendeesStat=attendeesStat+1;
        }
        else
        {
            attendeesStat=attendeesStat-1;            
        }

        if(attendeesStat>=quorumStat)
        {
          checkStat=true;
        }
        else
        {
          checkStat=false;
        }
        
        $('#membersStat').empty().append(membersStat);
        $('#quorumStat').empty().append(quorumStat);
        $('#majorityStat').empty().append(majorityStat);
        $('#attendeesStat').empty().append(attendeesStat);
        $('#checkStat').empty().append(''+checkStat);
    }
}

function init()
{
  members.sort();
  for(var memberNum in members)
  {
      var member=members[memberNum];
      if(member.substring(member.length-1, member.length)=='@')
      {
          $('#members').append('<li class="nonquorum"><input class="nonquorumCheckbox" type="checkbox"/>'+member+'</li>');
      }
      else if(member.substring(member.length-1, member.length)=='$')
      {
          $('#members').append('<li class="nonquorum"><input class="nonquorumCheckbox" type="checkbox"/>'+member+'</li>');          
      }
      else
      {
          $('#members').append('<li class="member"><input class="memberCheckbox" type="checkbox"/>'+member+'</li>');          
          membersStat=membersStat+1;
          quorumStat=Math.round(membersStat/3);          
          majorityStat=Math.round((membersStat/2)+1);
      }
  }

  $('#quorumStat').empty().append(quorumStat);
  $('#majorityStat').empty().append(majorityStat);
  $('#attendeesStat').empty().append(attendeesStat);
  $('#membersStat').empty().append(membersStat);
  $('#checkStat').empty().append(''+checkStat);
  $(':checkbox').click(memberClick);
}

$(document).ready(init);
