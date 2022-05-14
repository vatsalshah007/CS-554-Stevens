import React, {useState, useEffect} from "react";
import '../App.css';
import { Card, CardActionArea, CardContent, CardMedia, Grid, Typography, Button } from '@mui/material';
import { makeStyles } from "@mui/styles";
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useLazyQuery, useQuery } from '@apollo/client';
import queries from '../queries';
import actions from '../actions';
import {useSelector, useDispatch} from 'react-redux';
import SearchPokemon from "./SearchBar";

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

const PokemonList = () => {
    const dispatch = useDispatch();
    const regex = /(<([^>]+)>)/gi;
	const classes = useStyles();
	const [ pokemonData, setpokemonData ] = useState(undefined);
	const [ searchTerm, setSearchTerm ] = useState("");
	const [ searchData, setSearchData ] = useState(undefined);
  const navigate = useNavigate()
	let { pagenum } = useParams()
  // pagenum=parseInt(pagenum)
    const [pageNum, setPageNum] = useState(Number(pagenum))
  	const [ prevPage, setPrevPage ] = useState(false);
  	const [ nextPage, setNextPage ] = useState(false);
	const [ errorPage, setErrorPage ] = useState(false);
    const allPokemon = useSelector((state) => state.pokemons);
    const allTrainers = useSelector((state) => state.trainers);
    let selectedTrainer = allTrainers.find(x => x.selected);
    console.log(allPokemon)

    let pokemonWithTrainer=[]
    if(selectedTrainer){
        pokemonWithTrainer = allPokemon.filter(x => x.trainerId === selectedTrainer.id);
      }
	let card = null;
    const {loading, error, data} = useQuery(queries.GET_POKEMON_LIST, {
        variables: {pageNum: pageNum}
        // fetchPolicy: `cache-and-network`
    })

    useEffect(() => {
      console.log('on load useeffect');
      setPageNum(Number(pagenum))
	  }, [pagenum]); 

    useEffect(() => {
        if (data) {
            console.log('after Data useEffect');
            setNextPage(data.pokemons.next ? true : false)
            setPrevPage(data.pokemons.prev ? true : false)
        }
    }, [data])
 
    const searchValue = async (value) => {
        setSearchTerm(value);
    };
    if (searchTerm) {
            console.log('searchTerm is set', searchData);   
    }

    const pagination = () => {
        if (!prevPage) {
          return(
            <div id="paginationBtns">
              <Link className="links" to={`/pokemon/page/${Number(pagenum) + 1}`}>
                <Button className="button" variant='contained' onClick={(e) => {
                  e.preventDefault()
                  navigate(`/pokemon/page/${Number(pagenum) + 1}`)
                }}>Next</Button>
              </Link>
            </div>
          )
        }
        if (!nextPage) {
          return(
            <div id="paginationBtns">
              <Link className="links" to={`/pokemon/page/${Number(pagenum) - 1}`}>
                <Button className="button" variant='contained'>Previous</Button>
              </Link>
            </div>
          )
        }
        return(
          <div id="paginationBtns">
            <Link className="links" to={`/pokemon/page/${Number(pagenum) - 1}`}>
              <Button className="button"  variant='contained'>Previous</Button>
            </Link>
            <Link className="links" to={`/pokemon/page/${Number(pagenum) + 1}`}>
              <Button className="button" variant='contained'>Next</Button>
            </Link>
          </div>
        )
    }

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
                        {(!(pokemonWithTrainer.find(x => x.id === pokemon.id)? true : false) && (pokemonWithTrainer.length>=6) && (selectedTrainer ? true : false)) &&  
                            <Button sx={{backgroundColor: "#ffff"}} variant="disabled">Party Full</Button>}
                        {(!(pokemonWithTrainer.find(x => x.id === pokemon.id)? true : false) && (pokemonWithTrainer.length<6) && (selectedTrainer ? true : false)) &&  
                            <Button variant="primary" onClick={() => onClick('catch', pokemon)}>Catch</Button>}
                        {((pokemonWithTrainer.find(x => x.id === pokemon.id)? true : false) &&  (selectedTrainer ? true : false))&&
                            <Button variant="danger" onClick={() => onClick('release', pokemon)}>Release</Button>}
          
					</CardActionArea>
				</Card>
			</Grid>
		);
	};
    
  if (data) {
        console.log(data);
        
        card =  data.pokemons.result && data.pokemons.result.map((pokemon) => {
            return buildCard(pokemon);
        });
        return(
            <div>
                <SearchPokemon searchValue={searchValue}/>
                <br/>
                {pagination()}
                <br/>
                <Grid container className={classes.grid} spacing={5}>
					{data.pokemons.result.length > 0 ? card : setErrorPage(true)}
				</Grid>
            </div>
        );
    } else if (loading) {
        return(
            <div>Loading...</div>
        ); 
    } else if (error) {
		return (
		<div>{error.message}</div>
		);
	}
}

export default PokemonList;