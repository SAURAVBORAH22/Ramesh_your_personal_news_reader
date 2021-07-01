import { makeStyles } from '@material-ui/core/styles';//importing makestyles to do styling

//using export default makeStyles we can do styling using material-ui without doing much in css
//everything is in camel case
export default makeStyles({
  card: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    height: '45vh',
    padding: '10%',
    borderRadius: 10,
    color: 'white',
  },
  infoCard: {
    display: 'flex', 
    flexDirection: 'column', 
    textAlign: 'center',
  },
  container: {
    padding: '0 5%', 
    width: '100%', 
    margin: 0,
  },
});
