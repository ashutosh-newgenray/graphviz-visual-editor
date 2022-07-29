import React from 'react';
import Graph from './Graph2';
const App = () => {
  return (
    <Graph
            dotSrc={`strict digraph {
              a [shape="ellipse" style="filled" fillcolor="#1f77b4"]
              b [shape="polygon" style="filled" fillcolor="#ff7f0e"]
              a -> b [fillcolor="#a6cee3" color="#1f78b4"]
              b -> c [fillcolor="#a6cee3" color="#1f78b4"]
          }`}           
          />
  );
}

export default App;
