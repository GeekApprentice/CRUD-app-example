import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(() => ({
  media: {
    height: 0,
    paddingTop: '80%',
    width: '100%'
  },
  border: {
    border: 'solid',
  },
  fullHeightCard: {
    height: '100%',
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    borderRadius: '15px',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    top: '20px',
    left: '20px',
    color: 'white',
  },
  overlay2: {
    position: 'absolute',
    top: '20px',
    right: '20px',
    color: 'white',
  },
  grid: {
    display: 'flex',
  },
  details: {
    display: 'flex',
    justifyContent: 'space-between',
    margin: '10px',
  },
  title: {
    padding: '0 10px',
    overflow: 'hidden'
  },
  cardActions: {
    padding: '0 16px 8px 16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  openpost: {
    cursor: 'pointer',
    '&:hover': {
      opacity: '0.5'
    }
  },
  
}));