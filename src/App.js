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

  const initialStories = [
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

    //stories 列表，初始为空
    const [stories, setStories] = React.useState([]);
    //加载完成标记，默认否
    const [isLoading, setIsLoading] = React.useState(false);
    //加载过程是否出错
    const [isError, setIsError] = React.useState(false);
    
    const getAsyncStories = () =>
      new Promise(resolve => setTimeout( ()=>resolve({ data: { stories: initialStories } }), 2000 )      
    );


    const handleRemoveStory = (item)=>{
      const newStories = stories.filter( (story) =>story.objectID !== item.objectID );
      setStories(newStories);
    }


    const handleSearch = (event)=>{
      setSearchTerm(event.target.value);      
    }

    React.useEffect( ()=>{
      localStorage.setItem('search', searchTerm);
    }, [searchTerm] )

    React.useEffect( ()=>{
      setIsLoading(true);
      getAsyncStories().then( (result)=>{
        setStories(result.data.stories);
        setIsLoading(false);
      } ).catch(
        (errInfo)=>setIsError(true)
      )
    }, [] );

    const searchedStories = stories.filter( (item)=> item.title.toLowerCase().includes(searchTerm.toLowerCase()) );

return (
  <div>
    <h3>{welcome.greet}, {welcome.word}</h3>
    <InputWithLabel id='search' value={searchTerm} isFocused={true} onChange={handleSearch}>
    <strong>Search:</strong>
    </InputWithLabel>
    {isError && (<p>sorry, there is error!</p>)}
    {isLoading?
    (<p> loading...</p>)
    :(<List list={searchedStories} onRemoveItem={handleRemoveStory}/>)}
    
  </div>
);
}

const List = ({list, onRemoveItem})=> list.map( 
  (item)=> <Item key={item.objectID} item={item} onRemoveItem={onRemoveItem}/>
)

const Item = ({item, onRemoveItem})=>(
  <div>
  <span>
  <a href={item.url}>{item.title}</a>
  </span>
  <span>{item.author}</span>
  <span>{item.num_comments}</span>
  <span>{item.points}</span>
  <span>
    //onClick={onRemoveItem.bind(null, item)}
    <button type="button" onClick={ ()=>onRemoveItem(item) }>
      Dismiss
    </button>
  </span>
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
