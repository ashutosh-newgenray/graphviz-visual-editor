import React, { useEffect, useRef } from 'react';
import { select as d3_select} from 'd3-selection';
import 'd3-graphviz';
import { wasmFolder } from "@hpcc-js/wasm";

const Graph = (props) => {
  const divRef = useRef();
  const graphviz = useRef();

  useEffect(()=>{
    divRef.current = d3_select("#canvas");
    createGraph();
  },[]);

  const handleError = (errorMessage) => {
    let line = errorMessage.replace(/.*error in line ([0-9]*) .*\n/, '$1');
    console.error({message: errorMessage, line: line});    
  }

  const createGraph = () => {
    wasmFolder('/@hpcc-js/wasm/dist');
    graphviz.current = divRef.current.graphviz()
      .onerror(handleError)
      .on('initEnd', () => renderGraph());
  }

  const renderGraph = () => {
    graphviz.current.renderDot(props.dotSrc);
  }

    return (
      <React.Fragment>
        <div
          id="canvas"
          style={{width:'100%',height:'100vh',backgroundColor:'yellow'}}
        >
        </div>        
      </React.Fragment>
    );
}

export default Graph;
