var sentiment = require('sentiment');

function(userId, history, callback){
  var count = 0, total = 0, conceited = 0, i =0, phrase = "",
  phrases = ["I am ", " mine ", " me ", " myself ", "I'm", "I've",
  "I have ", "I do ", "I like ", " my "];
  while(history){
    if (history.get('type') == "message"){
      phrase = history.get('text');
      while (phrases[i]){
        if (phrase.includes(phrases[i])){
      count ++;
      i++;
    }
    }
    total++;
    }
  }
conceited = ((count/total) * 100).toPercent();
return conceited;

}

//I am, mine, me, myself, I'm, I've, I have, I do,
