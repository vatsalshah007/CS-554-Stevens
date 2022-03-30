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

const Comics = () => {
	const classes = useStyles();
	const [ loading, setLoading ] = useState(true);
	const [ comicData, setComicData ] = useState(undefined);
    let { id } = useParams()
    const [ comicID, setComicID ] = useState(Number(id));
    const [ errorPage, setErrorPage ] = useState(false)
	let page = null;
	let image = noImage
 
	// Using callback
	useEffect(() => {
		console.log('on load useeffect for comic by ID');
		async function fetchData() {
			try {
				const data = await axiosID(`comics`, comicID)
                if (data.data.results.length === 0) {
                    setErrorPage(true)
                } else {
                    setComicData(data.data.results);
                    setComicID(Number(id));
                    setLoading(false);
                }
			} catch (e) {
				console.log(e);
			}
		}
        if (isNaN(comicID)) {
            setErrorPage(true)
            setLoading(false)
        }else {
            fetchData();
        }
	}, [comicID, id]);

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
        comicData[0].thumbnail.path.split('/')[10] !== "image_not_available"? image = `${comicData[0].thumbnail.path}.${comicData[0].thumbnail.extension}` : image = noImage
		
        const allCharacters = (character) => {
            let charactersID = character.resourceURI.split('/')[6]
            return (
                <ListItem key={charactersID}>
                    <Link to={`/characters/${charactersID}`} className={`seriesNComics`}> 
                        <ListItemText primary= { character.name }/>
                    </Link>
                </ListItem>
            );
        };
        let charactersList = comicData[0].characters.items &&
                        comicData[0].characters.items.map((character) => {
                            return allCharacters(character)
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
                        alt="comic image"
                    />
                </Card>
                <Typography gutterBottom variant="h3" component="div" textAlign='center'>
                    {comicData[0].title}
                </Typography>
                <Typography variant="body1" textAlign='center'>
                <dl>
                        <dt className='title'>Summary:</dt>
                        <dd>{comicData[0].description ? comicData[0].description : `NA`}</dd>
                </dl>
                </Typography>
                <Typography variant="h5" component="div">
                    <Grid item container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 3 }} className={classes.grid}>
                        <Grid item xs={6}>
                            Characters:
                            <List>
                                {comicData[0].characters.items.length > 0 ? charactersList : naListItem()}
                            </List>
                        </Grid>
                    </Grid>
                </Typography>
                
			</div>
		);
	}
}

export default Comics;