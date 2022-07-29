import React, { useEffect, useRef } from 'react';
import { select as d3_select} from 'd3-selection';
import 'd3-graphviz';
import { wasmFolder } from "@hpcc-js/wasm";
import { transition as d3_transition} from 'd3-transition';
import { zoomIdentity as d3_zoomIdentity} from 'd3-zoom';
import { zoomTransform as d3_zoomTransform} from 'd3-zoom';

const Graph = (props) => {
  const divRef = useRef(d3_select(null));
  const graphviz = useRef();
  const originalViewBox = useRef();
  const svg = useRef(d3_select(null));
  const graph0 = useRef()

  useEffect(()=>{
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
      .fit(false)
      .on('initEnd', () => renderGraph());
  }

  const renderGraph = () => {
    let width = divRef.current.node().parentElement.clientWidth;
    let height = divRef.current.node().parentElement.clientHeight;
    graphviz.current
    .width(width)
    .height(height)
    .dot(props.dotSrc,handleDotLayoutReady)
    .on('renderEnd')
    .render(handleRenderGraphReady);
  }

  const handleDotLayoutReady = () => {
    let [, , width, height] = graphviz.current.data().attributes.viewBox.split(' ');
    originalViewBox.current = {width, height};
  }
  const handleRenderGraphReady = () => {
    svg.current = divRef.current.selectWithoutDataPropagation("svg");
    graph0.current = svg.current.selectWithoutDataPropagation("g");
    console.log("Graph is ready")
  }

  const fitGraph = () => {
    svg.current
      .attr("viewBox", `0 0 ${originalViewBox.current.width} ${originalViewBox.current.height}`);
  }

  const handleZoomInButtonClick = () => {
    let scale = d3_zoomTransform(graphviz.current.zoomSelection().node()).k;
    scale = scale * 1.2;
    setZoomScale(scale);
  }

  const handleZoomOutButtonClick = () => {
    let scale = d3_zoomTransform(graphviz.current.zoomSelection().node()).k;
    scale = scale / 1.2;
    setZoomScale(scale);
  }

  const setZoomScale = (scale, center=false, reset=false) => {
    let viewBox = svg.current.attr("viewBox").split(' ');
    let bbox = graph0.current.node().getBBox();
    let {x, y, k} = d3_zoomTransform(graphviz.current.zoomSelection().node());
    let [x0, y0, scale0] = [x, y, k];
    let xOffset0 = x0 + bbox.x * scale0;
    let yOffset0 = y0 + bbox.y * scale0;
    let xCenter = viewBox[2] / 2;
    let yCenter = viewBox[3] / 2;
    let xOffset;
    let yOffset;
    if (center) {
      xOffset = (viewBox[2] - bbox.width * scale) / 2;
      yOffset = (viewBox[3] - bbox.height * scale) / 2;
    } else if (reset) {
      xOffset = 0;
      yOffset = 0;
    } else {
      xOffset = xCenter - (xCenter - xOffset0) * scale / scale0;
      yOffset = yCenter - (yCenter - yOffset0) * scale / scale0;
    }
    x = -bbox.x * scale + xOffset;
    y = -bbox.y * scale + yOffset;
    let transform = d3_zoomIdentity.translate(x, y).scale(scale);
    graphviz.current.zoomSelection().call(graphviz.current.zoomBehavior().transform, transform);
  }

    return (
      <React.Fragment>
        <div>
          <button onClick={handleZoomInButtonClick}>ZoomIn Button</button>
          <button onClick={handleZoomOutButtonClick}>ZoomOut Button</button>
          <button onClick={fitGraph}>fitGraph Button</button>
        </div>
        <div
          id="canvas"
          ref={div => {
            divRef.current = d3_select(div);
          }}
          style={{width:'100%',height:'100vh',backgroundColor:'yellow'}}
        >
        </div>        
      </React.Fragment>
    );
}

export default Graph;
