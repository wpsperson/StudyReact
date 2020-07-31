import React from 'react';
import axios from 'axios';
import './App.css';

//const API_ENDPOINT = 'https://hn.algolia.com/api/v1/search?query=';
const API_ENDPOINT = 'https://api.github.com/users/';

const useSemiPersistentState = (key, initialState) => {
  const [value, setValue] = React.useState(
    localStorage.getItem(key) || initialState
  );

  React.useEffect(() => {
    localStorage.setItem(key, value);
  }, [value, key]);

  return [value, setValue];
};

const storiesReducer = (state, action) => {
  switch (action.type) {
    case 'STORIES_FETCH_INIT':
      return {
        ...state,
        isLoading: true,
        isError: false,
      };
    case 'STORIES_FETCH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload,
      };
    case 'STORIES_FETCH_FAILURE':
      return {
        data:[],
        isLoading: false,
        isError: true,
      };
    case 'REMOVE_STORY':
      return {
        ...state,
        data: state.data.filter(
          story => action.payload.objectID !== story.objectID
        ),
      };
    default:
      throw new Error();
  }
};

const App = () => {
  const [searchTerm, setSearchTerm] = useSemiPersistentState(
    'search',
    'React'
  );
  const [url, setUrl] = React.useState(`${API_ENDPOINT}${searchTerm}`);

  const [stories, dispatchStories] = React.useReducer(
    storiesReducer,
    { data: [], isLoading: false, isError: false }
  );

    //采用 memoized function
  const handleFetchStories = React.useCallback( async ()=>{
    dispatchStories({ type: 'STORIES_FETCH_INIT' });
    try {
          //用axios 和 用 fetch 不同，如果404会进入catch中，不用再then中判断了。
        let result = await axios.get(url);
        //dispatchStories({ type: 'STORIES_FETCH_SUCCESS',  payload: result.data.hits, });
        let id = result.data.id;
        let name = result.data.login;
        let html_url = result.data.html_url;
        let story =     {
          title: '<<The ' + name +' Tutorial>>',
          url: html_url,
          author: name,
          num_comments: 2,
          points: 5,
          objectID: id,
          };
        let story2 =     {
          title: '<<The ' + name +'2 Tutorial>>',
          url: html_url,
          author: name,
          num_comments: 2,
          points: 5,
          objectID: id+1,
          };
        dispatchStories({ type: 'STORIES_FETCH_SUCCESS',  payload: [story, story2], }); 
    } catch (error) {
        dispatchStories({ type: 'STORIES_FETCH_FAILURE' })
    }
  }, [url] )

  //采用 memoized function
  React.useEffect(() => {
    handleFetchStories();
  }, [handleFetchStories]);

  const handleRemoveStory = item => {
    dispatchStories({
      type: 'REMOVE_STORY',
      payload: item,
    });
  };
  //输入的handler
  const handleSearchInput = event => {
    setSearchTerm(event.target.value);
  };
  //提交按钮的handler
  const handleSearchSubmit = (event) => {
    setUrl(`${API_ENDPOINT}${searchTerm}`);
    event.preventDefault();
  };



  return (
    <div className='container'>
      <h3 className='headline-primary'>My Hacker Stories</h3>
      <SearchForm  
          searchTerm={searchTerm} 
          handleSearchInput={handleSearchInput} 
          handleSearchSubmit={handleSearchSubmit} 
      />
      <hr />
      {stories.isError && <p>Something went wrong ...</p>}

      {stories.isLoading ? (
        <p>Loading ...</p>
      ) : (
        <List
          list={stories.data}
          onRemoveItem={handleRemoveStory}
        />
      )}
    </div>
  );
};

const InputWithLabel = ({
  id,
  value,
  type = 'text',
  onInputChange,
  isFocused,
  children,
}) => {
  const inputRef = React.useRef();

  React.useEffect(() => {
    if (isFocused) {
      inputRef.current.focus();
    }
  }, [isFocused]);

  return (
    <>
      <label htmlFor={id}  className="label" >{children}</label>
      &nbsp;
      <input
        ref={inputRef}
        id={id}
        type={type}
        value={value}
        onChange={onInputChange}
        className="input"
      />
    </>
  );
};

const List = ({ list, onRemoveItem }) =>
  list.map(item => (
    <Item
      key={item.objectID}
      item={item}
      onRemoveItem={onRemoveItem}
    />
  ));

const Item = ({ item, onRemoveItem }) => (
  <div className="item">
    <span style={{ width: '40%' }}>
      <a href={item.url}>{item.title}</a>
    </span>
    <span style={{ width: '30%' }}>{item.author}</span>
    <span style={{ width: '10%' }}>{item.num_comments}</span>
    <span style={{ width: '10%' }}>{item.points}</span>
    <span style={{ width: '10%' }}>
      <button type="button" onClick={() => onRemoveItem(item)} className="button button_small">
        Dismiss
      </button>
    </span>
  </div>
);

const SearchForm = ({searchTerm, handleSearchInput, handleSearchSubmit }) => {
  return (
    <form  onSubmit={handleSearchSubmit} className="search-form">
    <InputWithLabel
      id="search"
      value={searchTerm}
      isFocused
      onInputChange={handleSearchInput}
    >
      <strong>Search:</strong>
    </InputWithLabel>
    <button  type="submit" disabled={!searchTerm} className="button button_large">
      Submit
    </button>
    </form>
  )
}


export default App;
