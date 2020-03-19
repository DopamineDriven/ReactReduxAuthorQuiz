import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import AuthorQuiz from './AuthorQuiz.jsx';
import * as serviceWorker from './serviceWorker';
import { shuffle, sample } from 'underscore';
import { BrowserRouter, Route, withRouter } from 'react-router-dom';
import AddAuthorForm from './AddAuthorForm.jsx';
import * as Redux from 'redux';
import * as ReactRedux from 'react-redux';

const authors = [
    {
      name: 'Mark Twain',
      imageUrl: 'images/authors/marktwain.jpg',
      imageSource: 'Wikimedia Commons',
      books: ['The Adventures of Huckleberry Finn']
    },
    {
      name: 'Joseph Conrad',
      imageUrl: 'images/authors/josephconrad.png',
      imageSource: 'Wikimedia Commons',
      books: ['Heart of Darkness']
    },
    {
      name: 'J.K. Rowling',
      imageUrl: 'images/authors/jkrowling.jpg',
      imageSource: 'Wikimedia Commons',
      imageAttribution: 'Daniel Ogren',
      books: ['Harry Potter and the Sorcerers Stone']
    },
    {
      name: 'Stephen King',
      imageUrl: 'images/authors/stephenking.jpg',
      imageSource: 'Wikimedia Commons',
      imageAttribution: 'Pinguino',
      books: ['The Shining', 'IT']
    },
    {
      name: 'Charles Dickens',
      imageUrl: 'images/authors/charlesdickens.jpg',
      imageSource: 'Wikimedia Commons',
      books: ['David Copperfield', 'A Tale of Two Cities']
    },
    {
      name: 'William Shakespeare',
      imageUrl: 'images/authors/williamshakespeare.jpg',
      imageSource: 'Wikimedia Commons',
      books: ['Hamlet', 'Macbeth', 'Romeo and Juliet']
    }
  ];

// ------------ getTurnData OVERVIEW ------------
// function selects set of possible answers 
// join together list off books written by all authors in dataset
// then shuffle them in a random order with underscore npm 
// https://www.npmjs.com/package/underscore
// then choosing the first four

// build collection by reducing author collections and
// concatenating each author's books into the larger set
const getTurnData = (authors) => {
    const allBooks = authors.reduce((p, c, i) => {
        return p.concat(c.books)
    }, []);
    
    // value fourRandomBooks equals shuffle all books
    // use slice method to extract first four books returned
    const fourRandomBooks = shuffle(allBooks).slice(0,4)
    
    // choose correct answer from fourRandomBooks
    // use sample function to choose a random value
    const answer = sample(fourRandomBooks)

    // return authors via find method of authors array
    // to find author such that authors book collection contains
    // a books title is equal to the answer chosen
    return {
        books: fourRandomBooks,
        author: authors.find((author) => 
            author.books.some((title) => 
                title === answer ))
    }
};


// props received by Turn will be author and books
const resetState = () => {
    return {
    turnData: getTurnData(authors),
    highlight: ''
    }
};

// reducer takes existing state and action
// applies action to existing state to produce a new state
const reducer = (
    state = { authors, turnData: getTurnData(authors), highlight: '' }, 
    action) => {
      // reducers as switch statement, switch on the type of the action
      switch (action.type) {
        case 'ANSWER_SELECTED':
          const isCorrect = state.turnData.author.books.some((book) => book === action.answer);
          return Object.assign(
            // return empty object first
            {},
            state, {
              highlight: isCorrect ? 'correct' : 'incorrect'
            });
        case 'CONTINUE': 
          return Object.assign({}, state, {
            highlight: '',
            turnData: getTurnData(state.authors)
            });
        case 'ADD_AUTHOR':
          return Object.assign({}, state, {
            authors: state.authors.concat([action.author])
          });
        default: return state
      }
};

// creating a store, establishing a reducer function
let store = Redux.createStore(reducer)
let state = resetState();
// Determine if answer is correct or incorrect
// to assess, must inspect turnData books collection
async function onAnswerSelected(answer) {
    // find book in collection such that title = answer user selected
    // this is done via isCorrect
    const isCorrect = state.turnData.author.books.some((book) => book === answer);
    // ternary operation
    state.highlight = isCorrect ? 'correct' : 'incorrect';
    // update application with new state via render function
    render();
};

// Wraps Author Quiz element
// wrapping component in ReactRedux.Provider to give access to store
const App = () => {
    return <ReactRedux.Provider store={store}> 
    <AuthorQuiz />
    </ReactRedux.Provider>
}

// wrapper function for onAddAuthor
// existing set of authors stored in array called authors
// push new author to authors array
// use withRouter {history} to push author to new path
const AuthorWrapper = withRouter (({ history }) => {
    return <AddAuthorForm onAddAuthor={(author) => {
        authors.push(author)
        history.push('/')
    }} />
})

// render function called when script executed and also after app state is updated
// so that state change flows through UI
// wrap component in BrowserRouter to introduce route components
const render = () => {
    ReactDOM.render(
    <BrowserRouter>
    <React.Fragment>
        <Route exact path = "/" component={App} /> 
        <Route path = "/add" component={AuthorWrapper} />
    </React.Fragment>
    </BrowserRouter>, document.getElementById('root'));
};
// React.fragment solves issue of grouping react elements under single parent 
// fragments are components with no DOM representation 
render();
serviceWorker.unregister();


// withRouter notes
// You can get access to the history object’s properties and the closest <Route>'s 
// match via the withRouter higher-order component. withRouter will pass updated 
// match, location, and history props to the wrapped component whenever it renders.
// Important
// withRouter does not subscribe to location changes like React Redux’s connect does for state changes
// Instead, re-renders after location changes propagate out from the <Router> component
// withRouter does not re-render on route transitions unless its parent component re-renders