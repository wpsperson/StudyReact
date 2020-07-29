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
    <InputWithLabel id='search' label = 'Search: ' value={searchTerm} onChange={handleSearch}/>
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


const InputWithLabel = ({id, label, value,  onChange}) => {
return  (
  <>
  <label htmlFor={id}>{label}</label>
  <input id={id} type='text' value ={value}  onChange = {onChange} />
  <p> your search word is: <strong>{value}</strong> </p>
  </>)

}


export default App;
