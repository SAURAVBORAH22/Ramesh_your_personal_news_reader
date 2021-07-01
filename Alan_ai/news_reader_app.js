intent('What does this app do?','What can I do here?',
       reply('This is a news project created by SAURAV BORAH.'));

intent('Ok Ramesh',
      reply('Ha ha . That is not going to work . I am not Google.'));

intent('What is your name',
      reply('Hi, I am Ramesh.Your personal news reader.Feel free to use me.'))

intent('Hello Ramesh',
      reply('Hello Boss, What can i do for you?'));

intent('What is my name',
      reply('Your name is Saurav.'));

intent('Na na na na',
      reply('Naaa ray Naaa ray Naaa ray'));

// intent('Jinne mera dil lutiya',
//       reply('O ho'));

intent('You are my',
      reply('Love charger'));

intent('Tell us about your developer','Who is your developer',
      reply('I was developed by SAURAV BORAH .He is a final year undergraduate student pursuing a Bachelor of Technology degree in Computer Science and Engineering at SRM Institute of Science and Technology.He has been able to deliver a consistent approach throughout a challenging period of development. He is extremely driven, with a clear goal to succeed. I am really proud of him xD'));

intent('Tell me a joke',
      reply('I went to the zoo the other day. There was only a dog in it – it was a shihtzu.'));

intent('Do you know Gujrati',
      reply('Kem cho Mota bhai'));

intent('Do you know Assamese',
      reply('Moie bhal aa su , aapuni kenekua aa se'));



//intent('Start a command', (p)=> {
// p.play({command:'testCommand'});
// })

const API_KEY = '26a9dea7072448e1944334f46b948b7f';//api key from newsapi.org
let savedArticles = [];//array to save the articles 

// News by Source
//$source gives helps to get it dynamically
intent('Give me the news from $(source* (.+))', (p) => {
    let NEWS_API_URL = `https://newsapi.org/v2/top-headlines?apiKey=${API_KEY}`;//api url for headline by source from newsapi.org
    
    if(p.source.value) //if value in source exists(boolean true)
    {
        NEWS_API_URL = `${NEWS_API_URL}&sources=${p.source.value.toLowerCase().split(" ").join('-')}`//this basically coverts our speech to url and everything we say converts to lower case and works dynamically
    }
    
    //alan has api.request built in but we can use axios instead
    api.request(NEWS_API_URL, (error, response, body) => {
        const { articles } = JSON.parse(body);  //this is just a way to get the data from api using api.request
        
        if(!articles.length) 
        {
            p.play('Sorry, please try searching for news from a different source');
            return;
        }
        
        savedArticles = articles;//populating the articles array
        
        p.play({ command: 'newHeadlines', articles });//passing newHeadlines with articles data
        p.play(`Here are the (latest|recent) ${p.source.value}.`);//to avoid alan sounding boring lastest|recent is use so that he can use both of them at will
  
        p.play('Would you like me to read the headlines?');
        p.then(confirmation);
    });
})

// News by Term
intent('what\'s up with $(term* (.*))', (p) => {
    let NEWS_API_URL = `https://newsapi.org/v2/everything?apiKey=${API_KEY}`;//here we are searching for everthing
    
    if(p.term.value) {
        NEWS_API_URL = `${NEWS_API_URL}&q=${p.term.value}`//we have to search for q(query) which is p.term.value
    }
    
    //api call
    api.request(NEWS_API_URL, (error, response, body) => {
        const { articles } = JSON.parse(body);
        
        //if search term wasn't correct
        if(!articles.length) {
            p.play('Sorry, please try searching for something else.');
            return;
        }
        
        //populating the articles if found
        savedArticles = articles;
        
        //reading the headlines from the articles
        p.play({ command: 'newHeadlines', articles });
        p.play(`Here are the (latest|recent) articles on ${p.term.value}.`);
        
        p.play('Would you like me to read the headlines?');
        p.then(confirmation);//confirmation regarding reading headline
    });
})

// News by Categories
//a array to contain all different categories from which we can search
const CATEGORIES = ['business', 'entertainment', 'general', 'health', 'science', 'sports', 'technology'];
//mapping and choosing the required category 
const CATEGORIES_INTENT = `${CATEGORIES.map((category) => `${category}~${category}`).join('|')}|`;

intent(`(show|what is|tell me|what's|what are|what're|read) (the|) (recent|latest|) $(N news|headlines) (in|about|on|) $(C~ ${CATEGORIES_INTENT})`,//we can choose from any of these different combinations
  `(read|show|get|bring me|give me) (the|) (recent|latest) $(C~ ${CATEGORIES_INTENT}) $(N news|headlines)`, (p) => {
    let NEWS_API_URL = `https://newsapi.org/v2/top-headlines?apiKey=${API_KEY}&country=us`;//current country is set to us but can be changed as per wish or remove &country for global
    
    //if category value is true we search for the category in the url
    if(p.C.value) {
        NEWS_API_URL = `${NEWS_API_URL}&category=${p.C.value}`
    }
    
    //making the api request
    api.request(NEWS_API_URL, (error, response, body) => {
        const { articles } = JSON.parse(body);
        
        //if articles not found or search term isn't correct
        if(!articles.length) {
            p.play('Sorry, please try searching for a different category.');
            return;
        }
        
        //populating the savedArticles array
        savedArticles = articles;
        
        //playing the headlines 
        p.play({ command: 'newHeadlines', articles });
        
        //if the categoty exists then we are playing the latest articles
        if(p.C.value) {
            p.play(`Here are the (latest|recent) articles on ${p.C.value}.`);        
        } 
        //if category not provided then we show the latest news
        else 
        {
            p.play(`Here are the (latest|recent) news`);   
        }
        
        //calling the confirmation context
        p.play('Would you like me to read the headlines?');
        p.then(confirmation);
    });
});

//context is used to make Alan read the text of the headline
//context is basically a dialogue between you and alan where you enter
//that specific conversation about something  and then you can exit it out based on your answers

const confirmation = context(() => {
    intent('yes', async (p) => {
        //for is used instead of map because of the async call
        for(let i = 0; i < savedArticles.length; i++)//iterating over the savedArticles array
        {
            //we are issuing a command called highlight which highlights the articles while alan is reading iterating
            //so that alan knows which article he is reading
            p.play({ command: 'highlight', article: savedArticles[i]});
            p.play(`${savedArticles[i].title}`);
        }
    })
    
    //we confirmation is no 
    intent('no','nope','not now','not now thanks','no thanks', (p) => {
        p.play('Sure, sounds good to me.')
    })
})

//logic for opening the article
//we use a call back function
intent('open (the|) (article|) (number|) $(number* (.*))', (p) => {
    if(p.number.value) //is valid article number 
    {
        p.play({ command:'open', number: p.number.value, articles: savedArticles})//we are creating a command for opening the articles where number is the article number and then pusing savedArticles to articles
    }
})

//creating the back button
intent('(go|) back', (p) => {
    p.play('Sure, going back');
    p.play({ command: 'newHeadlines', articles: []})//we will go back to newheadline and we will also be providing articles of empty array
})


