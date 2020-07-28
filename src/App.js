import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { isTemplateElement, objectExpression } from '@babel/types';
import { filter } from 'minimatch';



const welcome = {greet:'Hay', word:'React'}

  function App() {
  return (
    <div>
      <h3>{welcome.greet}, {welcome.word}</h3>
    </div>
  );
  }


export default App;
