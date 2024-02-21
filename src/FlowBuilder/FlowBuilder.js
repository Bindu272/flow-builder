import React, { useEffect, useState } from "react";
import ReactFlow, { useNodesState, useEdgesState } from "reactflow";
import "reactflow/dist/style.css";
import TextsmsIcon from '@mui/icons-material/Textsms';

const defaultViewport = { x: 0, y: 0, zoom: 1 };

const FlowBuilder = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([
    {
      id: "1",
      data: { label: "Test Message 1" },
      position: { x: 300, y: 100  },
      targetPosition: 'right ',
      sourcePosition:'left'
    },
    {
      id: "2",
      data: { label: "Test Message 2" },
      position: { x: 100, y: 200},
      targetPosition: 'right',
      sourcePosition:'left'
    },
  ]);

  const [edges, setEdges, onEdgesChange] = useEdgesState([
    { id: "e1-2", source: "1", target: "2" },
  ]);

  const [nodeName, setNodeName] = useState({});
const [errorMessage, setErrorMessage]=useState("")
  useEffect(() => {
    const updatedNodes = nodes.map((node) => {
      return {
        ...node,
        data: { ...node.data, label: nodeName[node.id] || node.data.label },
      };
    });
    setNodes(updatedNodes);
  }, [nodeName, nodes, setNodes]);

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const id = Date.now().toString();
    const mouseX = event.clientX;
    const mouseY = event.clientY;
    const nodeToAdd = {
      id,
      data: { label: "New Node" },
      position: { x: mouseX, y: mouseY },
      targetPosition: 'right',
      sourcePosition:'left'
    };
    setNodes([...nodes, nodeToAdd]);
    setNodeName((prev) => ({ ...prev, [id]: "New Node" }));
  };

  const handleSaveChanges = () => {
    const nodesWithEmptyTargets = nodes.filter((node) => {
      const connectedEdgesCount = edges.filter((edge) => edge.source === node.id)
        .length;
      return connectedEdgesCount === 0;
    });

    if (nodes.length > 1 && nodesWithEmptyTargets.length > 1) {
     setErrorMessage("Cannot save flow")
      return;
    }

    console.log("Changes saved successfully.");
  };

  return (
    <div>
      <header
        style={{
          background: "#e6eaedc5",
          padding: "0.5rem",
          display: "flex",
          justifyContent: "space-around",
        }}
      >
      {errorMessage ?(<button style={{border:"none",color: "black", background:'#ff000063',
            padding: "5px",
            borderRadius: "5px",}}>{errorMessage}</button>):(<span></span>)}
        <button
          style={{
            background: "white",
            border: "1px solid blue",
            color: "blue",
            padding: "5px",
            borderRadius: "5px",
          }}
          onClick={handleSaveChanges}
        >
          Save Changes
        </button>
      </header>
      <div className="grid-container">
        <div
          className="grid-item-left"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            defaultViewport={defaultViewport}
            minZoom={0.2}
            maxZoom={4}
            attributionPosition="bottom-left"
            onConnect={(params) =>
              setEdges((edges) => [
                ...edges,
                {
                  id: `${params.source}-${params.target}`,
                  source: params.source,
                  target: params.target,
                },
              ])
            }
          
          />
        </div>
        <div className="grid-item-right">
          <div className="message-container node-panel"><TextsmsIcon color="primary"/>Message</div>
          <div className="updatenode__controls setting-panel">
            {nodes.map((node) => (
              <div key={node.id}>
                <label>{`Label for Node ${node.id}:`}</label>
                <input
                  value={nodeName[node.id] || ""}
                  onChange={(evt) =>
                    setNodeName((prev) => ({
                      ...prev,
                      [node.id]: evt.target.value,
                    }))
                  }
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlowBuilder;
