import React, {useState, useEffect} from "react";
import '../App.css';
import { Link, useParams } from 'react-router-dom';
import SearchCharacters from "./SearchBar";
import noImage from '../img/no_image.webp';
import { Card, CardActionArea, CardContent, CardMedia, Grid, Typography, Button } from '@mui/material';
import { makeStyles } from "@mui/styles";
import { axiosLists, axiosSearch } from "../axiosFunctions";

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

const CharacterList = () => {
    const regex = /(<([^>]+)>)/gi;
	const classes = useStyles();
	const [ loading, setLoading ] = useState(true);
	const [ charactersData, setcharactersData ] = useState(undefined);
	const [ searchTerm, setSearchTerm ] = useState("");
	const [ searchData, setSearchData ] = useState(undefined);
	let { pagenum } = useParams()
	let intOffset = Number(pagenum) * 20
    const [ offset, setOffset ] = useState(intOffset);
  	const [ prevPage, setPrevPage ] = useState(false);
  	const [ nextPage, setNextPage ] = useState(false);
	const [ errorPage, setErrorPage ] = useState(false); 
	let card = null;
    let page = null;
	let image = noImage
 
	// Using callback
	useEffect(() => {
		console.log('on load useeffect');
		async function fetchData() {
			try {
				const data = await axiosLists(`characters`, offset);
				setcharactersData(data.data.results);
				setOffset(Number(pagenum)*20);
				try {
					let nextData = await axiosLists(`characters`, offset + 20);
					if (nextData.data.results.length === 0) {
						setNextPage(false)
					}else{
						setNextPage(true)
					}
				} catch (e) {
					setNextPage(false);
				}
				if(offset > 0){
					try {
						let prevData = await axiosLists(`characters`, offset-20);
						if (prevData.code !== 200) {
							setPrevPage(false)
						}else{
							setPrevPage(true)	
						}
					} catch (e) {
						setPrevPage(false);
					}
				} else {
					setPrevPage(false)
				}
				setErrorPage(false);
				setLoading(false);
			} catch (e) {
				console.log(e);
			}
		}
		if(Number(pagenum) >= 0 && Number(pagenum) <= 77){
			fetchData();
		} else {
			setLoading(false)
			setErrorPage(true);
		}
	}, [pagenum, offset]);
	
	// Search Bar UseEffect 
	useEffect(
		() => {
			console.log('search useEffect fired');
			async function fetchData() {
				try {
					console.log(`in fetch searchTerm: ${searchTerm}`);
					const data = await axiosSearch(`characters`, searchTerm); 
					setSearchData(data.data.results);
					setLoading(false);
				} catch (e) {
					console.log(e);
				}
			}
			if (searchTerm) {
				console.log ('searchTerm is set')
				fetchData();
			}
		},
		[ searchTerm ]
	);

  const pagination = (pagenum) => {
    if (!prevPage) {
      return(
        <div id="paginationBtns">
          <Link className="links" to={`/characters/page/${Number(pagenum) + 1}`}>
            <Button className="button" variant='contained'>Next</Button>
          </Link>
        </div>
      )
    }
    if (!nextPage) {
      return(
        <div id="paginationBtns">
          <Link className="links" to={`/characters/page/${Number(pagenum) - 1}`}>
            <Button className="button" variant='contained'>Previous</Button>
          </Link>
        </div>
      )
    }
    return(
      <div id="paginationBtns">
        <Link className="links" to={`/characters/page/${Number(pagenum) - 1}`}>
          <Button className="button"  variant='contained'>Previous</Button>
        </Link>
        <Link className="links" to={`/characters/page/${Number(pagenum) + 1}`}>
          <Button className="button" variant='contained'>Next</Button>
        </Link>
      </div>
        
    )
  }

	const searchValue = async (value) => {
		setSearchTerm(value);
	};
	const buildCard = (character) => {
		return (
			<Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={character.id}>
				<Card className={classes.card} variant='outlined'>
					<CardActionArea>
						<Link to={`/characters/${character.id}`} style={{ textDecoration: 'none' }}>
							<CardMedia
								className={classes.media}
								component='img'
								image={image}
								title='character image'
							/>

							<CardContent>
								<Typography className={classes.titleHead} gutterBottom variant='h6' component='h2'>
									{character.name}
								</Typography>
								<Typography variant='body2' color='textSecondary' component='p'>
									{character.description ? character.description.replace(regex, '').substring(0, 139) + '...' : 'No Summary'}
									{character.description? 'More Info': ''}
								</Typography>
							</CardContent>
						</Link>
					</CardActionArea>
				</Card>
			</Grid>
		);
	};


	if (searchTerm) {
		card =
			searchData &&
			searchData.map((character) => {
				character.thumbnail.path.split('/')[10] !== "image_not_available"? image = `${character.thumbnail.path}.${character.thumbnail.extension}` : image = noImage
				return buildCard(character);
			});
	} else {
		page = pagination(pagenum);
		card =
			charactersData &&
			charactersData.map((character) => {
				character.thumbnail.path.split('/')[10] !== "image_not_available"? image = `${character.thumbnail.path}.${character.thumbnail.extension}` : image = noImage
				return buildCard(character);
			});
	}

	if (loading) {
		return (
			<div>
				<h2>Loading....</h2>
			</div>
		);
	} else if (errorPage) {
		return (
			<div>
				<h2>404: Page not Found</h2>
			</div>
		);
	} else {
		return (
			<div>
				<SearchCharacters searchValue={searchValue} />
				<br />
                {page}
				<br />
				<br />
				<Grid container className={classes.grid} spacing={5}>
					{card}
				</Grid>
			</div>
		);
	}
}


// Checking for multiple instances
require('react-dom');
window.React2 = require('react');
console.log(window.React1 === window.React2);

export default CharacterList;