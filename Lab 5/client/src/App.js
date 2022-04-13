import React, {useState} from 'react';
import './App.css';
import logo from './trash-can-solid.svg';
import Images from './components/Images';
import MyPost from './components/MyPosts';
import BinnedImages from './components/BinnedImages';
import UploadImage from './components/UploadImage';
import {BrowserRouter as Router, Route, Link, Routes} from 'react-router-dom';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  HttpLink,
  useQuery,
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
        <div className="App">
          <header className="App-header">
            {/* <Navbar/> */}
            <img src={logo} className="App-logo" alt="logo" />
            <p>Bintrest</p>
          </header>
          <div className= "navbar">
            <Link className='showlink' id='bin'to='/my-bin'>
              my bin
            </Link>
            {/* <hr/>  */}
            <Link className='showlink' to='/'>
              images
            </Link> 
            {/* <hr/> */}
            <Link className='showlink' to='/my-posts'>
              my posts
            </Link>
          </div>
          <div className='App-body'>
            <Routes>
              <Route path='/' element={< Images />} />
              <Route path='/my-bin' element={< BinnedImages />} />
              <Route path='/my-posts' element={< MyPost />} />
              <Route path='/new-post' element={< UploadImage />} />
            </Routes>
          </div>
        </div>
      </Router>
    </ApolloProvider>
  );
}

export default App;
