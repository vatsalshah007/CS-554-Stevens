import React, { useState }  from 'react'
import { Button, Grid } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import TrainersList from './TrainersList';
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


function Trainers() {
    const classes = useStyles()
    const allTrainers = useSelector((state) => state.trainers);
    const allPokemon = useSelector((state) => state.pokemons);
    const dispatch = useDispatch()
    const [name, setName] = useState("")

    
    return (
        <div className='container'>
            <br/>
            <h1>Add Trainers</h1>
            <div className='container'>
                <div>
                    <br></br>
                    <label>Trainer:
                        <input type="text" onChange={(e) => setName({...name, name: e.target.value})} 
                        required
                        id='trainer'
                        name = 'trainer'
                        placeholder='Trainer'
                        />
                    </label>
                </div>
                <Button variant='contained' className="button" onClick={(e) => {
                    e.preventDefault();
                    if(name === undefined || name.name==='' || name.name===undefined ){
                        alert('Please enter a name');
                    } else {
                    dispatch(actions.addTrainer(name));
                    document.getElementById('trainer').value='';
                    setName({name:''});
                    }
                }}>Add</Button>
            </div>
            <br>
            </br>
            {allTrainers.length > 0 ? <h1>Trainers</h1>:null}
            {allTrainers.map((trainer, index) => {
            return (
                <Grid container className={classes.grid} key={index} spacing={1}>
                    <TrainersList trainer={trainer} />
                </Grid>
            );
            }
        )}
        </div>
    )
}

export default Trainers