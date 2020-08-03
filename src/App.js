import React from 'react';
import axios from 'axios';
import './App.css';
import { sortBy } from 'lodash';

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
        ...state,
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

const extractSearchTerm = url=>url.replace(API_ENDPOINT, '');
const getUrl = searchTerm => `${API_ENDPOINT}${searchTerm}`;

const getLastSearches = urls => urls.slice(-5).map(url=>extractSearchTerm(url));

const App = () => {
  const [searchTerm, setSearchTerm] = useSemiPersistentState(
    'search',
    'React'
  );

  const [urls, setUrls] = React.useState(
    [getUrl(searchTerm)]
  );

  const [stories, dispatchStories] = React.useReducer(
    storiesReducer,
    { data: [], isLoading: false, isError: false }
  );

  const handleFetchStories = React.useCallback(async () => {
    dispatchStories({ type: 'STORIES_FETCH_INIT' });

    try {
      //用axios 和 用 fetch 不同，如果404会进入catch中，不用再then中判断了。
      let url = urls[urls.length - 1];
      let result = await axios.get(url);
      //dispatchStories({ type: 'STORIES_FETCH_SUCCESS',  payload: result.data.hits, });
      let id = result.data.id;
      let name = result.data.login;
      let html_url = result.data.html_url;
      let story =     {
        title: 'first ' + name +' Tutorial',
        url: html_url,
        author: "wangwu",
        num_comments: 5,
        points: 5,
        objectID: id,
        };
      let story2 =     {
        title: 'second ' + name +'2 Tutorial',
        url: html_url,
        author: "lisi",
        num_comments: 3,
        points: 8,
        objectID: id+1,
        };
      let story3 =     {
        title: 'third ' + name +'3 Tutorial',
        url: html_url,
        author: 'zhangsan',
        num_comments: 9,
        points: 4,
        objectID: id+2,
        };
           
      dispatchStories({
        type: 'STORIES_FETCH_SUCCESS',
        payload: [story, story2, story3],
      });
    } catch {
      dispatchStories({ type: 'STORIES_FETCH_FAILURE' });
    }
  }, [urls]);

  React.useEffect(() => {
    handleFetchStories();
  }, [handleFetchStories]);

  const handleRemoveStory = item => {
    dispatchStories({
      type: 'REMOVE_STORY',
      payload: item,
    });
  };

  const handleSearchInput = event => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = event => {
    handleSearch(searchTerm);
    event.preventDefault();
  };

  const lastSearches = getLastSearches(urls);
  const handleLastSearch = searchTerm => {
    handleSearch(searchTerm);
  };
  const handleSearch = searchTerm => {
    const url = getUrl(searchTerm);
    setUrls(urls.concat(url));
    };

  return (
    <div>
      <h1>My Hacker Stories</h1>

      <SearchForm
        searchTerm={searchTerm}
        onSearchInput={handleSearchInput}
        onSearchSubmit={handleSearchSubmit}
      />
      {
        lastSearches.map( (searchTerm, index)=>(
          <button key={searchTerm+index}
          onClick = {()=>handleLastSearch(searchTerm)}
          >
            {searchTerm}
          </button>
        ) )
      }

      <hr />

      {stories.isError && <p>Something went wrong ...</p>}

      {stories.isLoading ? (
        <p>Loading ...</p>
      ) : (
        <List list={stories.data} onRemoveItem={handleRemoveStory} />
      )}
    </div>
  );
};

const SearchForm = ({
  searchTerm,
  onSearchInput,
  onSearchSubmit,
}) => (
  <form onSubmit={onSearchSubmit}>
    <InputWithLabel
      id="search"
      value={searchTerm}
      isFocused
      onInputChange={onSearchInput}
    >
      <strong>Search:</strong>
    </InputWithLabel>

    <button type="submit" disabled={!searchTerm}>
      Submit
    </button>
  </form>
);

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
    if (isFocused && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isFocused]);

  return (
    <>
      <label htmlFor={id}>{children}</label>
      &nbsp;
      <input
        ref={inputRef}
        id={id}
        type={type}
        value={value}
        onChange={onInputChange}
      />
    </>
  );
};

const List = ({ list, onRemoveItem }) => {

  const [sortState, setSortState] = React.useState('title');
  const [needReverse, setNeedReverse] = React.useState(false);
  const onClickHeader = (key)=>{
    if(key === sortState){
      setNeedReverse( !needReverse );
    }
    setSortState(key);
  }
  const sortedList = sortBy(list, sortState);
  if(needReverse){
    sortedList.reverse();
  }

  return <>
  <div className='item'>
    <button style={{ width: '40%' }}  onClick={()=>onClickHeader('title')} >title</button>
    <button style={{ width: '30%' }}  onClick={()=>onClickHeader('author')} >author</button>
    <button style={{ width: '10%' }}  onClick={()=>onClickHeader('num_comments')} >num_comments</button>
    <button style={{ width: '10%' }}  onClick={()=>onClickHeader('points')} >points</button>
  </div>
    {
      sortedList.map(item => (
        <Item
          key={item.objectID}
          item={item}
          onRemoveItem={onRemoveItem}
        />
      ))
    }
  </>
}

const Item = ({ item, onRemoveItem }) => (
  <div className='item'>
    <span style={{ width: '40%' }}>
      <a href={item.url}>{item.title}</a>
    </span>
    <span style={{ width: '30%' }}>{item.author}</span>
    <span style={{ width: '10%' }}>{item.num_comments}</span>
    <span style={{ width: '10%' }}>{item.points}</span>
    <span style={{ width: '10%' }}>
      <button type="button" onClick={() => onRemoveItem(item)}>
        Dismiss
      </button>
    </span>
  </div>
);

export default App;
export { SearchForm, InputWithLabel, List, Item };