import React from 'react'
import { Card, CardActionArea, CardContent, CardMedia, Grid, Typography, Button } from '@mui/material';
import { Link, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux';
import actions from '../actions'
import { makeStyles } from "@mui/styles";


const useStyles = makeStyles({
	card: {
		maxWidth: 250,
		height: 'auto',
		marginLeft: 'auto',
		marginRight: 'auto',
		borderRadius: 5,
		border: '1px solid #1e8678',
		boxShadow: '0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);'
		// backgroundColor: '#14213D'
	},
	titleHead: {
		borderBottom: '1px solid #1e8678',
		fontWeight: 'bold'
	},
	grid: {
		flexGrow: 1,
		flexDirection: 'row'
	},
	media: {
		height: '100%',
		width: '100%'
	},
	button: {
		color: '#ffffff',
		fontWeight: 'bold',
		fontSize: 12
	},
	links: {
		textDecoration: 'none'
	}
});

function TrainersList(props) {
    const classes = useStyles()
//  const allTrainers = useSelector((state) => state.trainers);
    const allPokemon = useSelector((state) => state.pokemons);
    console.log("allpokemon",allPokemon)
    const dispatch =useDispatch();
    const selectTrainer = () => {
      if(props.trainer.selected) {
        dispatch(actions.unselectTrainer(props.trainer.id));
      }
      else {
      dispatch(actions.selectTrainer(props.trainer.id));
      }
        
    }
    const deleteTrainer = () => {
        dispatch(actions.deleteTrainer(props.trainer.id));
    }

    const buildCard = (pokemon) => {
		return (
			<Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={pokemon.id}>
				<Card className={classes.card} variant='outlined'>
					<CardActionArea>
						<Link to={`/pokemon/${pokemon.id}`} style={{ textDecoration: 'none' }}>
							<CardMedia
								className={classes.media}
								component='img'
								image={pokemon.imageUrl}
								title={pokemon.name}
							/>
							<CardContent>
								<Typography className={classes.titleHead} gutterBottom variant='h6' component='h2'>
									{pokemon.name}
								</Typography>
							</CardContent>
						</Link>
                        
					</CardActionArea>
				</Card>
			</Grid>
		);
	};

  return (
    <Grid container sx={{marginBottom: "5rem"}}  className={classes.grid} spacing={1}>
        <Typography sx={{textDecoration: "none"}} className={classes.titleHead} variant='h6' component='h2'>
            Trainer: {props.trainer.name}
		</Typography>
      
        {!props.trainer.selected && <Button variant="outlined" onClick={deleteTrainer} >Delete Trainer</Button>}
        {!props.trainer.selected && <Button variant="contained" className="button" onClick={() => selectTrainer()}>Select</Button>}
        {props.trainer.selected && <Button variant="contained" className="button" onClick={() => selectTrainer()}>Unselect</Button>}
      
      <p>Pokemon</p>
      {allPokemon.length > 0 ? allPokemon.filter(pokemon => pokemon.trainerId === props.trainer.id).map((pokemon) => {
        return buildCard(pokemon)
      }) : null}
    </Grid>
  )
}

export default TrainersList;