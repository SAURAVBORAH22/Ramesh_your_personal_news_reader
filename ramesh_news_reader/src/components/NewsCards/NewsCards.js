import React from 'react';//importing react
import { Grid, Grow, Typography } from '@material-ui/core';//will help in making app mobile friendly and will provide animmation to the cards and texts

import NewsCard from './NewsCard/NewsCard';
import useStyles from './styles.js';//we used usestyles here because makestyles creates a hook here

//array of 4 info cards that will be shown at first when nothing is said and will act as home page
//we will be looping over them and mapping over them to display them
const infoCards = [
  { color: '#00838f', title: 'Latest News', text: 'Give me the latest news' },
  { color: '#1565c0', title: 'News by Categories', info: 'Business, Entertainment, General, Health, Science, Sports, Technology', text: 'Give me the latest Technology news' },
  { color: '#4527a0', title: 'News by Terms', info: 'Bitcoin, PlayStation 5, Smartphones, Donald Trump...', text: 'What\'s up with PlayStation 5' },
  { color: '#283593', title: 'News by Sources', info: 'CNN, Wired, BBC News, Time, IGN, Buzzfeed, ABC News...', text: 'Give me the news from CNN' },
];

//creating a arrow function component
//destructuring active articles from the props
const NewsCards = ({ articles, activeArticle }) => {
  const classes = useStyles();//calling as a hook which gives access to the classes object 

  //there are no articles then we will be showing those cards(acts a home page)
  if (!articles.length) {
    return (
      //grow in triggers the enter and exit of elements
      //we will be mapping and looping over the infocards
      //inside the grid we will be providing infocard title in the typography tag
      //below it we will be having a ternary function that will show the info if presenet else not
      //we are dynamically grabbing the word eg., categories , terms , sources from title if info present
      //infoCard.title.split(' ')[2] will split the title into an array and take the 2 element as in the above comment
      //else if we don't have a info then it's gonna be null
      <Grow in>
        <Grid className={classes.container} container alignItems="stretch" spacing={3}>
          {infoCards.map((infoCard) => (
            <Grid item xs={12} sm={6} md={4} lg={3} className={classes.infoCard}>
              <div className={classes.card} style={{ backgroundColor: infoCard.color }}>
                <Typography variant="h5" component="h5">{infoCard.title}</Typography>
                {infoCard.info ? <Typography variant="h6" component="h6"><strong>{infoCard.title.split(' ')[2]}</strong>: <br />{infoCard.info}</Typography> : null}
                <Typography variant="h6" component="h6">Try saying: <br /> <i>{infoCard.text}</i></Typography>
              </div>
            </Grid>
          ))}
        </Grid>
      </Grow>
    );
  }

  //rendering different news cards based on the articles that we are getting
  //grow in show the component if true and triggers the animation enter or exit animation
  //below that in newscard we are passing a specific article as props
  //in the newscard we are checking for each specific card,whether it's active or not
  return (
    <Grow in>
      <Grid className={classes.container} container alignItems="stretch" spacing={3}>
        {articles.map((article, i) => (
          <Grid item xs={12} sm={6} md={4} lg={3} style={{ display: 'flex' }}>
            <NewsCard activeArticle={activeArticle} i={i} article={article} />
          </Grid>
        ))}
      </Grid>
    </Grow>
  );
};

export default NewsCards;
