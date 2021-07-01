import React, { useState, useEffect } from 'react';//useEffect is a hook/function that happens when our code starts
import { Typography } from '@material-ui/core';
//we need to import wordsTonumbers because when we say article number something it understands it as a string example two,four/for
//so prevent this we have installed this dependancy which will convert that string to number
import wordsToNumbers from 'words-to-numbers';
import alanBtn from '@alan-ai/alan-sdk-web';//To initialize the Alan Button
import logo from './images/my_pic.jpeg';
import rameshlogo from './images/ramesh_logo.png';
import { NewsCards, Modal } from './components';
import useStyles from './styles';

const App = () => {
  //hooks for the index of the article he is currently reading
  const [activeArticle, setActiveArticle] = useState(0);
  //with hooks we are doing array destructuring
  //React hooks are a new way (still being developed) to access the core features of react such as state without having to use classes
  const [newsArticles, setNewsArticles] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  //calling useStyles as hook
  const classes = useStyles();

  useEffect(() => {
    alanBtn({
      key: 'edef8fe242e577ca5a39a5ebdc68aee72e956eca572e1d8b807a3e2338fdd0dc/stage',//key which connects us to our alan ai platform
      onCommand: ({ command, articles, number }) => {
        if (command === 'newHeadlines') {
          //console.log(articles);
          setNewsArticles(articles);
          setActiveArticle(-1);
        } else if (command === 'instructions') 
        {
          setIsOpen(true);
        } else if (command === 'highlight')//highlighting the posts as alan reads
        {
          //here we create a call back function to move to the next article from the previous article
          setActiveArticle((prevActiveArticle) => prevActiveArticle + 1);
        } 
        //creating the command for opening the article
        else if (command === 'open') {
          //here we will create a parsednumber and will only parse if number length is greater than 2
          //inside the wordTonumbers we pass the number and fuzzy as true because it will then try to find the closest number to a word it understands
          //example if he understands our voice as for then he will try to find the number that matches closest to it which is 4
          const parsedNumber = number.length > 2 ? wordsToNumbers((number), { fuzzy: true }) : number;
          //based on the parsedNumber we can get the article as articles[parseNumber-1]
          const article = articles[parsedNumber - 1];
          //if we have our articles then we can play them using the alan button
          if (parsedNumber > articles.length) {
            alanBtn().playText('Please try that again...');
          } else if (article) {
            window.open(article.url, '_blank');//here we are opening the article url in a blank page
            alanBtn().playText('Opening...');
          } else {
            alanBtn().playText('Please try that again...');//article not found or some other error
          }
        }
      },
    });
  }, []);//if the array is level empty it's gonna run  only 1 time

  return (
    //passing newsArticles as a prop to the newscards
    //in the img tag we are providing the image which will acts as our logo 
    <div>
      <div className={classes.logoContainer}>
        {newsArticles.length ? (
          <div className={classes.infoContainer}>
            <div className={classes.card}><Typography variant="h5" component="h2">Try saying: <br /><br />Open article number [4]</Typography></div>
            <div className={classes.card}><Typography variant="h5" component="h2">Try saying: <br /><br />Go back</Typography></div>
          </div>
        ) : null}
        <img src={rameshlogo} className={classes.alanLogo} alt="logo" />
      </div>
      <NewsCards articles={newsArticles} activeArticle={activeArticle} />
      <Modal isOpen={isOpen} setIsOpen={setIsOpen} />
      {!newsArticles.length ? (
        <div className={classes.footer}>
          <Typography variant="body1" component="h2">
            Created by
            <a className={classes.link} href="https://github.com/SAURAVBORAH22"> SAURAV BORAH</a>
          </Typography>
          <img className={classes.image} src={logo} height="50px" alt="My pic" />
        </div>
      ) : null}
    </div>
  );
};

export default App;
