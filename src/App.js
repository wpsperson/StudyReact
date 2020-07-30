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

    const storiesReducer = (state, action)=>{

      switch (action.type) {
        case 'Load_Init':
          return {
            ...state,
            isLoading:true, 
            isError:false 
          }
        case 'Load_Success':
          return {
            ...state,
            data:action.payload,
            isLoading:false, 
            isError:false 
          }
        case 'Load_Error':
          return {
            ...state,
            isLoading:false, 
            isError:true 
          }
        case 'REMOVE_STORY':
          const newState = state.data.filter( (item) => (item.objectID !== action.payload.objectID) );
          return {
            data:newState,
            isLoading:false, 
            isError:false 
          }
        default:
          throw new Error();
      }
    }
    //stories 列表，初始为空
    //const [stories, setStories] = React.useState([]);
    //不再使用useState管理stories，改用useReducer。第一个参数是派发处理函数，第二个参数是stories的初始值
    const [stories, dispatchStories] = React.useReducer(storiesReducer, {data:[],isLoading:false, isError:false });

    const API_ENDPOINT = 'https://api.github.com/users/';

    const getAsyncStories = () =>
      new Promise(resolve => setTimeout( ()=>resolve({ data: { stories: initialStories } }), 2000 )      
    );


    const handleRemoveStory = (item)=>{
      // const newStories = stories.filter( (story) =>story.objectID !== item.objectID );
      // setStories(newStories);
      dispatchStories({type:'REMOVE_STORY', payload:item});
    }


    const handleSearch = (event)=>{
      setSearchTerm(event.target.value);      
    }

    React.useEffect( ()=>{
      localStorage.setItem('search', searchTerm);
    }, [searchTerm] )

    React.useEffect( ()=>{
      //setIsLoading(true);
      dispatchStories({type:'Load_Init'});
      getAsyncStories().then( (result)=>{
        //setStories(result.data.stories);
        dispatchStories({type:'Load_Success', payload:result.data.stories});
        //setIsLoading(false);
      } ).catch(
        (errInfo)=>dispatchStories({type:'Load_Error'}) //setIsError(true)
      )
    }, [] );

    //pseudo
    React.useEffect(() => {
      fetch(`${API_ENDPOINT}React`) // B
      .then(response => response.json()) // C
      .then(result => {
        let id = result.id;
        let name = result.login;
        let html_url = result.html_url;
        let story =     {
          title: '<<The ' + name +' Tutorial>>',
          url: html_url,
          author: name,
          num_comments: 2,
          points: 5,
          objectID: id,
          };
        let str = JSON.stringify(story);
        alert(str);
      })
      .catch(() => alert('fetch error!')
      );
      }, []);

    const searchedStories = stories.data.filter( (item)=> item.title.toLowerCase().includes(searchTerm.toLowerCase()) );

return (
  <div>
    <h3>{welcome.greet}, {welcome.word}</h3>
    <InputWithLabel id='search' value={searchTerm} isFocused={true} onChange={handleSearch}>
    <strong>Search:</strong>
    </InputWithLabel>
    {stories.isError && (<p>sorry, there is error!</p>)}
    {stories.isLoading?
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
