const initialState = []
let copyState = null;
let index = 0;


const pokeReducer = (state = initialState, action) => {
    const {type, payload} = action;
  
    switch (type) {
        case 'CATCH_POKEMON':
            console.log('payload', payload);
            copyState = [...state]
            return [
                ...state,
                payload
            ];
        
        case 'RELEASE_POKEMON':
            copyState = [...state];
            index = copyState.findIndex((x) => x.id === payload.id);
            copyState.splice(index, 1);
            return [...copyState];
        
        default:
            return state;
    }
  };
  
  export default pokeReducer;