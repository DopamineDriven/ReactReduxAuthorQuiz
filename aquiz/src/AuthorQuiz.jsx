import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types'
import './App.css';
import './bootstrap.min.css'

const Hero = () => {
  // offset-1 = offset from left by 1 column
  return (
  <div className = "row">
    <div className = "jumbotron col-10 offset-1">
    <h1>Author Quiz</h1>
    <p>Select the book written by the author shown</p>
    </div>
  </div>)
}

// onClick handler for highlight property to be responsive (R vs G)
const Book = ({ title, onClick }) => {
  return (
    <div className="answer" onClick={() => {onClick(title)}}>
      <h4>{ title }</h4>
    </div>
  )
}

// need author prop and books prop
// anytime you render a collection of components via map
// must provide a key prop with a unique identifier so that
// react can distinguish individual elements
// onAnswerSelected is a prop of the Turn component which means it must
// be provided by the AuthorQuiz component
const Turn = ({ author, books, highlight, onAnswerSelected }) => {
  const highlightToBgColor = (highlight) => {
    const mapping = {
      'none': '',
      'correct': 'green',
      'incorrect': 'red'
    }
    return mapping[highlight]
  }
  // change background color to green || red depending on whether
  // user selects correct || incorrect answer, respectively 
  // convert DOM event onClick into a component event
  // which is event that is expressed in language of domain model
  // low level it is a click on a div, but conceptually, the user is selecting an answer
  // onAnswerSelected will be a prop of the Turn component
  return (
    <div className="row turn" style={{ backgroundColor: highlightToBgColor(highlight) }}>
      <div className="col-4 offset-1">
        <img src={author.imageUrl} className="authorimage" alt="Author"/>
      </div>
      <div className="col-6">
        {books.map((title) => <Book title={title} key={title} onClick={onAnswerSelected} />)}
      </div>
    </div>
  )
};

Turn.propTypes = {
  author: PropTypes.shape({
    name: PropTypes.string.isRequired,
    imageUrl: PropTypes.string.isRequired,
    imageSource: PropTypes.string.isRequired,
    books: PropTypes.arrayOf(PropTypes.string).isRequired
  }),
  books: PropTypes.arrayOf(PropTypes.string).isRequired,
  onAnswerSelected: PropTypes.func.isRequired,
  highlight: PropTypes.string.isRequired
};

// ternary conditional
const Continue = ({ show, onContinue }) => {
  return (
    <div className="row continue">
        { show 
        ? <div className="col-11">
            <button className="btn btn-primary btn-lg float-right" onClick={onContinue}>Continue</button>
        </div> 
      : null }
    </div>
  )
};

const Footer = () => {
  return (
    <div id="footer" className="row">
      <div className="co-12">
        <p className="text-muted credit">
        All images are from <a href="http://commons.wikimedia.org/wiki/Main_Page">Wikemedia Commons</a> and are in the public domain
          </p>
      </div>
    </div>
  )
}

// onAnswerSelected added as a prop of the AuthorQuiz
const AuthorQuiz = ({ turnData, highlight, onAnswerSelected, onContinue }) => {
  // container-fluid specifies fluid layout for application
  // Hero component for Header
  // Turn component for the central game mechanics
  // Continue component for button that moves user along 
  return (
    <div className="container-fluid">
      <Hero />
      <Turn {...turnData} highlight={highlight} onAnswerSelected={onAnswerSelected} />
      <Continue show={ highlight === 'correct' } onContinue={onContinue} />
      <p>
        <Link to="/add">Add an author</Link>
      </p>
      <Footer />
    </div>
  )
}

export default AuthorQuiz;
