function verifyCallback(result)
{
  log('verify result:');
  log(result);
}

function verify(assertion)
{
  var url='https://browserid.org/verify?assertion='+assertion+'&audience=http://blanu.net';
  $.post(url, verifyCallback);
}

function success(assertion)
{
  verify(assertion);
}

function failure(assertion)
{
  log('failure:');
  log(assertion);
}

function signIn()
{
  navigator.id.get(function(assertion) {
    if (assertion) {
      success(assertion);
    } else {
      failure(assertion);
    }
  });

  return false;
}

function init()
{
  $('#signin').click(signIn);
}

$(document).ready(init);

