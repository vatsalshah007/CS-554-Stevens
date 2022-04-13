import React, {useEffect, useState} from "react";
import '../App.css';
import ImageList from "./ImageList";
import noImage from '../img/no_image.webp';
import { Card, CardActionArea, CardContent, CardMedia, Grid, Typography, Button } from '@mui/material';
import { makeStyles } from "@mui/styles";
import { useQuery } from "@apollo/client";
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

const Images = () => {
	const classes = useStyles()
	const [pageNum, setPageNum] = useState(1);
	const { loading, error, data, refetch } = useQuery(queries.GET_UNSPLASH_IMAGES, {
		variables: {pageNum: pageNum},
		fetchPolicy: `cache-and-network`
	})
	
	if (data) {
		return(
			<div>
				<Grid container sx={{marginBottom: 1}} className={classes.grid} spacing={5}>
					<ImageList refetch={refetch} data={data}/>
				</Grid>
				<Button id="showMoreBtn" onClick={(e) => {
					e.preventDefault();
					setPageNum(pageNum+1)
					refetch();
				}} className={classes.button}>
					Show More
				</Button>
			</div>
		)	
	}else if (loading) {
		return (
		<div>Loading...</div>
		);
	} else if (error) {
		return (
		<div>{error.message}</div>
		);
	}
};

export default Images;