import React, {useState, useEffect} from "react";
import '../App.css';
import { Link, useParams } from 'react-router-dom';
import { Card, CardMedia, Grid, Typography, List, ListItem, ListItemText, Button } from '@mui/material';
import { makeStyles } from "@mui/styles";
import { useQuery } from '@apollo/client';
import queries from '../queries';
import { useSelector, useDispatch } from 'react-redux';
import actions from '../actions';

const useStyles = makeStyles({
	card: {
		maxWidth: 250,
		height: 'auto',
		marginLeft: 'auto',
		marginRight: 'auto',
		borderRadius: 5,
		boxShadow: '0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);'
	},
	titleHead: {
		borderBottom: '1px solid #1e8678',
		fontWeight: 'bold'
	},
	grid: {
		flexGrow: 1,
		flexDirection: 'column'
	},
	media: {
		height: '100%',
		width: '100%'
	},
	button: {
		color: '#1e8678',
		fontWeight: 'bold',
		fontSize: 12
	},
	links: {
		textDecoration: 'none'
	}
});

const Pokemons = () => {
	const classes = useStyles();
    const dispatch = useDispatch();
	const [ pokemonData, setPokemonData ] = useState(undefined);
    let { id } = useParams()
    const [ pokemonID, setPokemonID ] = useState(parseInt(id));
    const [ errorPage, setErrorPage ] = useState(false);
    const allPokemon = useSelector((state) => state.pokemons);
    const allTrainers = useSelector((state) => state.trainers);
    let selectedTrainer = allTrainers.find(x => x.selected);
    let isThereASelectedTrainer = selectedTrainer ? true : false;
    console.log(allPokemon)
  
    let pokemonWithTrainer=[]
    if(selectedTrainer){
     pokemonWithTrainer = allPokemon.filter(x => x.trainerId === selectedTrainer.id);
    }
	let page = null;
    const { loading, error, data } = useQuery(queries.GET_POKEMON, {
        variables: { id: pokemonID },
        fetchPolicy: 'cache-and-network'
    });
 
	// Using callback
	useEffect(() => {
		console.log('on load useeffect for pokemon by ID');
		setPokemonID(Number(id))
	}, [pokemonID, id]);

    const onClick = (status, pokemon) => {
        let obj={}
        obj={
            ...pokemon,
            trainerId: selectedTrainer.id,
        }
        if(status === 'catch') {
            dispatch(actions.catchPokemon(obj));
        } else {
            dispatch(actions.releasePokemon(obj));
        }
    }
    
	if (loading) {
		return (
			<div>
				<h2>Loading....</h2>
			</div>
		);
	} else if (error) {
		return (
			<div>
				<h2>404: Page not Found</h2>
			</div>
		);
	} else if (errorPage) {
        return (
            <div>404: Page Not Found</div>
        )
    }else {
        console.log(data);
        return (
			<div>
				<br />
                {page}
				<br />
				<br />
                <Card className={classes.card}>
                    <CardMedia
                        component="img"
                        className={classes.media}
                        image={data.getPokemon.imageUrl}
                        alt={data.getPokemon.name}
                    />
                </Card>
                <Typography gutterBottom variant="h3" component="div" textAlign='center'>
                    {data.getPokemon.name}
                </Typography>
        
                {(!(pokemonWithTrainer.find(x => x.id === data.getPokemon.id)? true : false) && (pokemonWithTrainer.length>=6) && (selectedTrainer ? true : false)) &&  
                    <Button sx={{backgroundColor: "#ffff"}} variant="disabled">Party Full</Button>}
                {(!(pokemonWithTrainer.find(x => x.id === data.getPokemon.id)? true : false) && (pokemonWithTrainer.length<6) && (selectedTrainer ? true : false)) &&  
                    <Button variant="primary" onClick={() => onClick('catch', data.getPokemon)}>Catch</Button>}
                {((pokemonWithTrainer.find(x => x.id === data.getPokemon.id)? true : false) &&  (selectedTrainer ? true : false))&&
                    <Button variant="danger" onClick={() => onClick('release', data.getPokemon)}>Release</Button>}
                <Typography gutterBottom variant="h4" component="div" textAlign='center'>
                    Types: {data.getPokemon.types.map((x, index)=> {
                        return(
                            <span key={index} style={{marginRight: "0.5rem"}}>{x.name}</span>
                        );
                    })}
                </Typography> 
                <hr/>
                {data.getPokemon.stats.map((x, index)=> {
                    return(
                        <Typography key={index} gutterBottom variant="h4" component="div" textAlign='center'>
                            {x.name}: {x.value}
                        </Typography>
                    );
                })}  
			</div>
		);
	}
}

export default Pokemons;