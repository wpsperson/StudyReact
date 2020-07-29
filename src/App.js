import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { isTemplateElement, objectExpression } from '@babel/types';
import { filter } from 'minimatch';



const welcome = {greet:'Hay', word:'React'}

function App() {

  const [searchTerm, setSearchTerm] = React.useState( 
    localStorage.getItem('search') ||  'React'
    );

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


    const handleSearch = (event)=>{
      setSearchTerm(event.target.value);      
    }

    React.useEffect( ()=>{
      localStorage.setItem('search', searchTerm);
    }, [searchTerm] )

    const filtedStories = stories.filter( (item)=> item.title.toLowerCase().includes(searchTerm.toLowerCase()) );

return (
  <div>
    <h3>{welcome.greet}, {welcome.word}</h3>
    <InputWithLabel id='search' value={searchTerm} isFocused={true} onChange={handleSearch}>
    <strong>Search:</strong>
    </InputWithLabel>
    <List list={filtedStories}/>
  </div>
);
}

const List = (props)=> props.list.map( 
  ({objectID, ...item})=> <Item key={objectID} {...item}/>
)

const Item = ({url, title, author, num_comments, points})=>(
  <div>
  <span>
  <a href={url}>{title}</a>
  </span>
  <span>{author}</span>
  <span>{num_comments}</span>
  <span>{points}</span>
  </div>
)

const InputWithLabel = ({id, value, isFocused,  onChange, children}) => {

  const inputRef = React.createRef();
  React.useEffect( ()=>{
    if(inputRef && isFocused){
      inputRef.current.focus();
    }
  }, [isFocused] )

return  (
  <>
  <label htmlFor={id}>{children}</label>
  <input id={id} type='text' value ={value}  onChange = {onChange} ref={inputRef} />
  <p> your search word is: <strong>{value}</strong> </p>
  </>)

}


export default App;
