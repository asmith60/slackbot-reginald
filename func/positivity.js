var sentiment = require('sentiment');

function(userId, history, callback){
  var count = 0, posNeg = 0, score = 0, message = "", words = 0;
  while(history){
    if (history.get('userId') === userId){
      message = sentiment(history.get('message'));
      while (message){
        words = words + message.tokens.length();
        score = score + message.score;
                     }
    }
  }
  count = (score/(words *4)) * 100;
posNeg = count.toPercent();
return posNeg;

}
