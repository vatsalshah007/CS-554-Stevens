import {v4} from 'uuid';
const initialState = []
let copyState = null
let index = 0

const trainerReducer = (state = initialState, action) => {
    const {type, payload} = action
    switch (type) {
        case "ADD_TRAINER":
            console.log("Add Trainer Payload", payload);
            return [
                ...state,
                {
                    id: v4(),
                    name: payload.name.name,
                    selected: payload.selected
                }
            ]
        
        case 'DELETE_TRAINER':
            console.log("Delete Trainer Payload", payload);
            copyState = [...state];
            index = copyState.findIndex((x) => x.id === payload.id);
            copyState.splice(index, 1);
            return [...copyState];

        case 'SELECT_TRAINER':
            copyState = [...state];
            index = copyState.findIndex(x => x.id === payload.id);
            copyState.map(trainer => {
                trainer.selected = false;
            });
            copyState[index].selected = true;
            return copyState;

        case 'UNSELECT_TRAINER':
            copyState = [...state];
            index = copyState.findIndex(x => x.id === payload.id);
            console.log('index', copyState[index]);
            copyState[index].selected = false;
            console.log('index', copyState[index]);
            return copyState;
        default:
            return state;
    }
}

export default trainerReducer;