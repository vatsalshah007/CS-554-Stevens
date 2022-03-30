import React, {useState, useEffect} from "react";
import '../App.css';
import { Link, useParams } from 'react-router-dom';
import noImage from '../img/no_image.webp';
import { Card, CardMedia, Grid, Typography, List, ListItem, ListItemText } from '@mui/material';
import { makeStyles } from "@mui/styles";
import { axiosID } from "../axiosFunctions";

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

const Characters = () => {
	const classes = useStyles();
	const [ loading, setLoading ] = useState(true);
	const [ characterData, setCharacterData ] = useState(undefined);
    let { id } = useParams()
    const [ characterID, setCharacterID ] = useState(Number(id));
    const [ errorPage, setErrorPage ] = useState(false)
	let page = null;
	let image = noImage
 
	// Using callback
	useEffect(() => {
		console.log('on load useeffect for character by ID');
		async function fetchData() {
			try {
				const data = await axiosID(`characters`, characterID)
                if (data.data.results.length === 0) {
                    setErrorPage(true)
                } else {
                    setCharacterData(data.data.results);
                    setCharacterID(Number(id));
                    setLoading(false);
                }
			} catch (e) {
				console.log(e);
			}
		}
        if (isNaN(characterID)) {
            setErrorPage(true)
            setLoading(false)
        }else {
            fetchData();
        }
	}, [characterID, id]);

    
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
        characterData[0].thumbnail.path.split('/')[10] !== "image_not_available"? image = `${characterData[0].thumbnail.path}.${characterData[0].thumbnail.extension}` : image = noImage
		const allSeries = (serie) => {
            let seriesID = serie.resourceURI.split('/')[6]
            return (
                <ListItem key={seriesID}>
                    <Link to={`/series/${seriesID}`} className={`seriesNComics`}> 
                        <ListItemText primary= { serie.name }/>
                    </Link>
                </ListItem>
            );
        };
        let seriesList = characterData[0].series.items &&
                        characterData[0].series.items.map((serie) => {
                            return allSeries(serie)
                        });
        const allComics = (comic) => {
            let comicsID = comic.resourceURI.split('/')[6]
            return (
                <ListItem key={comicsID}>
                    <Link to={`/comics/${comicsID}`} className={`seriesNComics`}>
                        <ListItemText primary= { comic.name }/>
                    </Link>
                </ListItem>
            );
        };
        let comicsList = characterData[0].comics.items &&
                        characterData[0].comics.items.map((comic) => {
                            return allComics(comic)
                        });
        const naListItem = () => {
            return (
                <ListItem>
                    <ListItemText primary= "NA"/>
                </ListItem>
            );
        };
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
                        image={image}
                        alt="Character image"
                    />
                </Card>
                <Typography gutterBottom variant="h3" component="div" textAlign='center'>
                    {characterData[0].name}
                </Typography>
                <Typography variant="body1" textAlign='center'>
                <dl>
                        <dt className='title'>Summary:</dt>
                        <dd>{characterData[0].description ? characterData[0].description : `NA`}</dd>
                </dl>
                </Typography>
                <Typography variant="h5" component="div">
                    <Grid item container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 3 }} className={classes.grid}>
                        <Grid item xs={6}>
                            Comics:
                            <List>
                                {characterData[0].comics.items.length > 0 ? comicsList : naListItem()}
                            </List>
                        </Grid>
                        <Grid item xs={6}>
                            Series:
                            <List>
                                {characterData[0].series.items.length > 0 ? seriesList : naListItem()}
                            </List>
                        </Grid>
                    </Grid>
                </Typography>   
			</div>
		);
	}
}

export default Characters;