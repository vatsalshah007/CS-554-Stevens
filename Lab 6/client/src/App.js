import React from 'react';
import './App.css';
import Home from './components/Home';
import PokemonList from './components/PokemonList';
import Pokemons from './components/Pokemons';
import Trainers from './components/Trainers';
import {BrowserRouter as Router, Route, Link, Routes} from 'react-router-dom';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  HttpLink,
  useQuery
} from "@apollo/client";
const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: 'http://localhost:4000'
  })
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <div className='App'>
          <header className='App-header'>
            <div className='Navbar'>
              <h1 className='App-title'>
                <Link className='logo' to='/'>
                Pokémon Repository
                </Link>
              </h1>
              <div className='NavLinks'>
                <Link className='showlink' to='/pokemon/page/0'>
                  Pokémons
                </Link>  
                <Link className='showlink' to='/trainers'>
                  Trainers
                </Link>
              </div>
            </div>
          </header>
          <br />
          <br />
          <div className='App-body'>
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/pokemon/page/:pagenum' element = {<PokemonList/>}/>
              <Route path='/pokemon/:id' element = {<Pokemons/>}/>
              <Route path='/trainers' element = {<Trainers/>}/>
              <Route path='/*' element= {	<div> <h2>404: Page not Found</h2></div> } />
            </Routes>
          </div>
        </div>
      </Router>
    </ApolloProvider>
  );
}

export default App;
