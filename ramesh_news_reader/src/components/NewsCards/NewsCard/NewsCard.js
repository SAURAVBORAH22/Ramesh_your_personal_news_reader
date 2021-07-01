import React, { useState, useEffect, createRef } from 'react';//we will be using usestate, useffect and createRef here to create the scroll bar section of the page using refs
import { Card, CardActions, CardActionArea, CardContent, CardMedia, Button, Typography } from '@material-ui/core';//importing these from materialui to create different components which are already present in material-ui


import useStyles from './styles';

//we will be destructuring all the properties coming from the article
const NewsCard = ({ article: { description, publishedAt, source, title, url, urlToImage }, activeArticle, i }) => {
  const classes = useStyles();//creating a hook for the useStyles defined in styles.js
  //array for storing all the Refs
  //which is going to be empty at the beginning 
  //and it's gonna be empty array of references
  const [elRefs, setElRefs] = useState([]);
  
  //in the scrolltoref we are using a call back function where we will use ref as a param
  //then we are scrolling through window(x-axis=0 and y-axis= ref.current.offsetTop-50 )
  //ref.current.offsetTop-50 will make sure to get exactly to the top of the card and also to go a bit above so not exactly top of it
  const scrollToRef = (ref) => window.scroll(0, ref.current.offsetTop - 50);

  //using useEffect to create the references at the start of our applications one the newscard components mounts
  //this use effect only works at the start to setup all the references
  useEffect(() => {
    window.scroll(0, 0);
    //as soon as it mounts we are calling the below call back function
    //the below might not be a good approach 
    //we have a array of 20 empty elements(for 20 cards) and we are filling it
    //then we will map through them 
    //the first parameter will be nothing because we are only concerned with index here
    //if the ref[j] exists then we are gonna keep it else we are going to create the ref for that specific card
    setElRefs((refs) => Array(20).fill().map((_, j) => refs[j] || createRef()));
  }, []);

  //the below useeffect is used because it has to be ran each time alan reads a new article
  //this useeffect is called at the time when any one of  i , activearticles or elrefs changes
  useEffect(() => {
    if (i === activeArticle && elRefs[activeArticle]) //if i is equal to the activearticle and reference is pointed to the active article
    {
      scrollToRef(elRefs[activeArticle]);//then we are going to scroll to that reference
    }
  }, [i, activeArticle, elRefs]);//here we are looking for changes in i,activeArticle,elRefs

  return (
    //we have card element and under it we have card action area which is the clickable part of the card
    //inside the card element if activeArticle is equal to the index then we are highlighting the articles else we are closing it
    //inside the card element we are also providing ref to all elements using elRef[i]
    //inside card action area we have card media which will containg the image  
    //we will use typography because it very easy to set variant , color, components and other parameters here from material-ui
    //inside it we will have two typography component one of which will show the publishedat(converted to date string)  and other that will show the source name
    //below it we will have another typography component which will be having gutterbottom(padding/margin at the bottom)
    //below this we will be having card content that will show the description about the card
    //below that another typography which shows description
    //below that we will be having card actions which gonna contain the actual buttons
    //we will be using button from material-ui having size-small and color-primary
    //below this we have another typography which gives the page number or the card number 
    <Card ref={elRefs[i]} className={activeArticle === i ? classes.activeCard : classes.card}>
      <CardActionArea href={url} target="_blank">
        <CardMedia className={classes.media} image={urlToImage || 'https://www.industry.gov.au/sites/default/files/August%202018/image/news-placeholder-738.png'} title={title} />
        <div className={classes.details}>
          <Typography variant="body2" color="textSecondary" component="h2">{(new Date(publishedAt)).toDateString()}</Typography>
          <Typography variant="body2" color="textSecondary" component="h2">{source.name}</Typography>
        </div>
        <Typography className={classes.title} gutterBottom variant="h5" component="h2">{title}</Typography>
        <CardContent>
          <Typography variant="body2" color="textSecondary" component="p">{description}</Typography>
        </CardContent>
      </CardActionArea>
      <CardActions className={classes.cardActions}>
        <Button size="small" color="primary" href={url}>Learn More</Button>
        <Typography variant="h5" color="textSecondary" component="h2">{i + 1}</Typography>
      </CardActions>
    </Card>
  );
};

export default NewsCard;
