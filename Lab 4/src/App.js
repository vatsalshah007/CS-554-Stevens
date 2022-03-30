import React from 'react';
import './App.css';
import Home from './components/Home';
import CharacterList from './components/CharactersList';
import ComicsList from './components/ComicsList';
import SeriesList from './components/SeriesList';
import Characters from './components/Characters';
import Comics from './components/Comics';
import Series from './components/Series';
import {BrowserRouter as Router, Route, Link, Routes} from 'react-router-dom';
// import { Button } from '@mui/material';


function App() {
  return (
    <Router>
      <div className='App'>
        <header className='App-header'>
          <div className='Navbar'>
            <h1 className='App-title'>
              <Link className='logo' to='/'>
              Marvel Repository
              </Link>
            </h1>
            <div className='NavLinks'>
              <Link className='showlink' to='/characters/page/0'>
                Characters
              </Link>  
              <Link className='showlink' to='/comics/page/0'>
                Comics
              </Link>
              <Link className='showlink' to='/series/page/0'>
                Series
              </Link>
            </div>
          </div>
        </header>
        <br />
        <br />
        <div className='App-body'>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/characters/page/:pagenum' element={<CharacterList />} />
            <Route path='/series/page/:pagenum' element={<SeriesList />} />
            <Route path='/comics/page/:pagenum' element={<ComicsList />} />
            <Route path='/characters/:id' element={<Characters />} />
            <Route path='/series/:id' element={<Series />} />
            <Route path='/comics/:id' element={<Comics />} />
            <Route path='/*' element= {	<div> <h2>404: Page not Found</h2></div> } />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
