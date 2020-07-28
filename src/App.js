import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { isTemplateElement, objectExpression } from '@babel/types';
import { filter } from 'minimatch';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }



const welcome = {greet:'Hay', word:'React'}

  function App() {

    const [curState, updateState] = React.useState('');
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

const filterdStories = stories.filter(
  (story)=> story.title.toLowerCase().includes(curState.toLowerCase())
);

  const AppCallBack = (event)=>{
    updateState(event.target.value);
  }
  return (
    <div>
      <Search mycallback={AppCallBack} curTerm={curState}/>
      <MyList list={filterdStories}/>
    </div>
  );
  }

  const Search = (props) => {
    return (
      <div>
        <h1>{welcome.greet}, {welcome.word}</h1>
        <label htmlFor="search">Search: </label>
        <input id="search" type="text" onChange={props.mycallback} />
        <p> 
          search term of <strong> {props.curTerm} </strong>
        </p>
      </div>
    );
  }

  const MyList = (props) => 
  props.list.map(function(item){
    return <div key={item.objectID}>
        <a href = {item.url}>{item.title}  </a>
        <span>{item.author}  </span>
        <span>{item.num_comments}  </span>
        <span>{item.points}  </span> 
      </div>
  })

export default App;
