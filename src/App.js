import React from 'react';
import axios from 'axios';
//import styles from './App.module.css';
import styled from 'styled-components';


const StyledContainer = styled.div`
height: 100vw;
padding: 20px;
background: #83a4d4;
background: linear-gradient(to left, #b6fbff, #83a4d4);
color: #171212;
`;
const StyledHeadlinePrimary = styled.h1`
font-size: 48px;
font-weight: 300;
letter-spacing: 2px;
`;
const StyledItem = styled.div`
display: flex;
align-items: center;
padding-bottom: 5px;
`;
const StyledColumn = styled.span`
padding: 0 5px;
white-space: nowrap;
overflow: hidden;
white-space: nowrap;
text-overflow: ellipsis;
a {
color: inherit;
}
width: ${props => props.width};
`;
const StyledButton = styled.button`
background: transparent;
border: 1px solid #171212;
padding: 5px;
cursor: pointer;
transition: all 0.1s ease-in;
&:hover {
background: #171212;
color: #ffffff;
}
`;
//注意这里有继承关系
const StyledButtonSmall = styled(StyledButton)`
padding: 5px;
`;
const StyledButtonLarge = styled(StyledButton)`
padding: 10px;
`;
const StyledSearchForm = styled.form`
padding: 10px 0 20px 0;
display: flex;
align-items: baseline;
`;

const StyledLabel = styled.label`
border-top: 1px solid #171212;
border-left: 1px solid #171212;
padding-left: 5px;
font-size: 24px;
`;
const StyledInput = styled.input`
border: none;
border-bottom: 1px solid #171212;
background-color: transparent;
font-size: 24px;
`;




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
    <StyledContainer >
      <StyledHeadlinePrimary >My Hacker Stories</StyledHeadlinePrimary>
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
    </StyledContainer>
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
      <StyledLabel htmlFor={id}  >{children}</StyledLabel>
      &nbsp;
      <StyledInput
        ref={inputRef}
        id={id}
        type={type}
        value={value}
        onChange={onInputChange}
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
  <StyledItem >
    <StyledColumn width='40%'>
      <a href={item.url}>{item.title}</a>
    </StyledColumn>
    <StyledColumn width='30%'>{item.author}</StyledColumn>
    <StyledColumn width='10%'>{item.num_comments}</StyledColumn>
    <StyledColumn width='10%'>{item.points}</StyledColumn>
    <StyledColumn width='10%'>
      <StyledButtonSmall type="button" onClick={() => onRemoveItem(item)}>
        Dismiss
      </StyledButtonSmall>
    </StyledColumn>
  </StyledItem>
);

const SearchForm = ({searchTerm, handleSearchInput, handleSearchSubmit }) => {
  return (
    <StyledSearchForm  onSubmit={handleSearchSubmit} >
    <InputWithLabel
      id="search"
      value={searchTerm}
      isFocused
      onInputChange={handleSearchInput}
    >
      <strong>Search:</strong>
    </InputWithLabel>
    <StyledButtonLarge  type="submit" disabled={!searchTerm} >
      Submit
    </StyledButtonLarge>
    </StyledSearchForm>
  )
}


export default App;
