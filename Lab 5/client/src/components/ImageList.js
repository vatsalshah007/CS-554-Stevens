import React from "react";
import '../App.css';
import { Card, CardActions, CardActionArea, CardHeader, CardContent, CardMedia, Grid, Typography, IconButton } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/DeleteOutlined';
import { Delete } from "@mui/icons-material";
import DeleteIcons from '@mui/icons-material/DeleteForever'
import { makeStyles } from "@mui/styles";
import {useMutation} from '@apollo/client';
import queries from "../queries";


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
		// borderBottom: '1px solid #1e8678',
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

const ImageList = (props) => {
    const classes = useStyles();
    const [binUnbinIamge, {data, loading, error}] = useMutation(queries.UPDATE_IMAGE, {onCompleted: props.refetch});
    const [delImage] = useMutation(queries.DELETE_IMAGE, {onCompleted: props.refetch});
    let card

    // Check if binned or not | START
    const binUnbinBtn = (x) => {
        if (!x.binned) {
            return(
                <IconButton sx={{fontSize: 15}} onClick={(e)=>{
                    e.preventDefault();
                    binUnbinIamge({
                        variables: {
                            id: x.id,
                            url: x.url,
                            description: x.description,
                            posterName: x.posterName,
                            userPosted: x.userPosted,
                            binned: x.binned,
                            numBinned: x.numBinned
                        }
                    })
                }} 
                aria-label="add to bin">
                    <FavoriteIcon />
                    Add to Bin
                </IconButton>
            );
        } else {
            return (
                <IconButton sx={{fontSize: 15}} onClick={(e)=>{
                    e.preventDefault()
                    binUnbinIamge({
                        variables: {
                            id: x.id,
                            url: x.url,
                            description: x.description,
                            posterName: x.posterName,
                            userPosted: x.userPosted,
                            binned: x.binned,
                            numBinned: x.numBinned
                        }
                    })
                    // setBinImage(true)
                }}
                aria-label="add to bin">
                    <Delete />
                    Remove from Bin
                </IconButton>
            );
        }
    }
    // Check if binned or not | START

    const imageGrid = (x) => {
        return (
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={x.id}>
                <Card className={classes.card} variant='outlined'>
                    <CardHeader
                        subheader={x.posterName ? x.posterName : 'No Poster Name'}
                    />
                        <CardMedia
                            className={classes.media}
                            component='img'
                            image= {x.url}
                            title={x.description}
                        />
                        <CardContent>
                            <Typography variant='body2' color='textSecondary' component='p'>
                                {x.description ? x.description : 'No Description'}
                            </Typography>
                        </CardContent>
                        <CardActions>
                        {binUnbinBtn(x)}
                        </CardActions>
                </Card>
            </Grid>
        );
    }

    const myImageGrid = (x) => {
        return (
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={x.id}>
                <Card className={classes.card} variant='outlined'>
                    <CardHeader
                        subheader={x.posterName ? x.posterName : 'No Poster Name'}
                        action = {
                            <IconButton onClick={(e)=>{
                                e.preventDefault()
                                delImage({
                                    variables: {
                                        id: x.id
                                    }
                                }); 
                            }}
                            aria-label="delete">
                                <DeleteIcons />
                            </IconButton>
                        }
                    />
                    <CardActionArea>
                        <CardMedia
                            className={classes.media}
                            component='img'
                            image= {x.url}
                            title={x.description}
                        />
                        <CardContent>
                            <Typography variant='body2' color='textSecondary' component='p'>
                                {x.description ? x.description : 'No Description'}
                            </Typography>
                        </CardContent>
                        <CardActions>
                        {binUnbinBtn(x)}
                        </CardActions>
                    </CardActionArea>
                </Card>
            </Grid>
        );
    }

    if(props.data.unsplashImages){
        card = props.data.unsplashImages.map( x => {
            return imageGrid(x)
        })
    } else if (props.data.binnedImages) {
        if(props.data.binnedImages.length === 0) {
            return <div>Please Bin some images to see them here.</div>
        }
        card = props.data.binnedImages.map( x => {
            return imageGrid(x)
        })
    } else if(props.data.userPostedImages){
        if(props.data.userPostedImages.length === 0) {
            return <div>Please post some images to see them here.</div>
        }
        card = props.data.userPostedImages.map( x => {
            return myImageGrid(x)
        })
    } else if(props.data.getTopTenBinnedPosts){
        if(props.data.getTopTenBinnedPosts.length === 0) {
            return <div>Please post some images to see them here.</div>
        }
        card = props.data.getTopTenBinnedPosts.map( x => {
            return imageGrid(x)
        })
    }
	
    return(
        card
	)
};

export default ImageList;