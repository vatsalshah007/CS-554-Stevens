const addTrainer = (name) => ({
    type: "ADD_TRAINER",
    payload: {
        name: name,
        selected: false
    }
});

const deleteTrainer = (id) => ({
    type: 'DELETE_TRAINER',
    payload: {
        id:id
    }
});

const selectTrainer = (id) => ({
    type: 'SELECT_TRAINER',
    payload: {
        id: id
    }
});

const unselectTrainer = (id) => ({
    type: 'UNSELECT_TRAINER',
    payload: {
        id: id
    }
});

const catchPokemon = (card) => (
    {
    type: 'CATCH_POKEMON',
    payload: {
       ...card,
    }
});

const releasePokemon = (card) => ({
    type: 'RELEASE_POKEMON',
    payload: {
        ...card,
    }
});

module.exports = {
    addTrainer,
    deleteTrainer,
    selectTrainer,
    unselectTrainer,
    catchPokemon,
    releasePokemon
}