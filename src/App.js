import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { isTemplateElement, objectExpression } from '@babel/types';
import { filter } from 'minimatch';



const welcome = {greet:'Hay', word:'React'}

function App() {

  const [searchTerm, setSearchTerm] = React.useState('');

  const stories = [
    {
    title: 'React',
    url: 'https://reactjs.org/',
    author: 'Jordan Walke',
    num_comments: 3,
    points: 4,
    objectID: 0,
    },
    {
    title: 'Redux',
    url: 'https://redux.js.org/',
    author: 'Dan Abramov, Andrew Clark',
    num_comments: 2,
    points: 5,
    objectID: 1,
    },
    ];

    const AppOnSearch = (event)=>{
      setSearchTerm(event.target.value);
    }

    const filtedStories = stories.filter( (item)=> item.title.toLowerCase().includes(searchTerm.toLowerCase()) );

return (
  <div>
    <h3>{welcome.greet}, {welcome.word}</h3>
    <Search onSearch={AppOnSearch} searchWord={searchTerm}/>
    <List list={filtedStories}/>
  </div>
);
}

const List = (props)=> props.list.map( (item)=>
( 
   <div key={item.objectID} >
      <span>
      <a href={item.url}>{item.title}</a>
      </span>
      <span>{item.author}</span>
      <span>{item.num_comments}</span>
      <span>{item.points}</span>
    </div>
)
)  

const Search = props =>{
  return (<div>
  <label htmlFor="search">Search: </label>
  <input id="search" type="text" onChange = {props.onSearch} />
  <p> your search word is: <strong>{props.searchWord}</strong> </p>
  </div>)
}


export default App;
