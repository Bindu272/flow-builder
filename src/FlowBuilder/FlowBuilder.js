/* Import necessary dependencies */
import React, { useEffect, useState } from "react";
import ReactFlow, { useNodesState, useEdgesState } from "reactflow";
import "reactflow/dist/style.css"; /* Import ReactFlow CSS */
import TextsmsIcon from "@mui/icons-material/Textsms"; /* Import TextsmsIcon from Material UI */
/* Define default viewport */
const defaultViewport = { x: 0, y: 0, zoom: 1 };

const FlowBuilder = () => {
  /* State management for nodes */
  const [nodes, setNodes, onNodesChange] = useNodesState([
    {
      id: "1",
      data: { label: "Test Message 1" },
      position: { x: 300, y: 100 },
      targetPosition: "right ",
      sourcePosition: "left",
    },
    {
      id: "2",
      data: { label: "Test Message 2" },
      position: { x: 100, y: 200 },
      targetPosition: "right",
      sourcePosition: "left",
    },
  ]);
  /* State management for edges */
  const [edges, setEdges, onEdgesChange] = useEdgesState([
    { id: "e1-2", source: "1", target: "2" },
  ]);
  /* State management for node names */
  const [nodeName, setNodeName] = useState({});
  /* State management for error message */
  const [errorMessage, setErrorMessage] = useState("");
  /* Effect hook to update node labels */
  useEffect(() => {
    const updatedNodes = nodes.map((node) => {
      return {
        ...node,
        data: { ...node.data, label: nodeName[node.id] || node.data.label },
      };
    });
    setNodes(updatedNodes);
  }, [nodeName, nodes, setNodes]);
  /* Function to handle drag over event */
  const handleDragOver = (event) => {
    event.preventDefault();
  };
  /* Function to handle drop event */
  const handleDrop = (event) => {
    event.preventDefault();
    const id = Date.now().toString();
    const mouseX = event.clientX;
    const mouseY = event.clientY;
    const nodeToAdd = {
      id,
      data: { label: "New Node" },
      position: { x: mouseX, y: mouseY },
      targetPosition: "right",
      sourcePosition: "left",
    };
    setNodes([...nodes, nodeToAdd]);
    setNodeName((prev) => ({ ...prev, [id]: "New Node" }));
  };
  /* Function to handle save changes */
  const handleSaveChanges = () => {
    const nodesWithEmptyTargets = nodes.filter((node) => {
      const connectedEdgesCount = edges.filter(
        (edge) => edge.source === node.id
      ).length;
      return connectedEdgesCount === 0;
    });

    if (nodes.length > 1 && nodesWithEmptyTargets.length > 1) {
      setErrorMessage("Cannot save flow");
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
        {errorMessage ? (
          <button
            style={{
              border: "none",
              color: "black",
              background: "#ff000063",
              padding: "5px",
              borderRadius: "5px",
            }}
          >
            {errorMessage}
          </button>
        ) : (
          <span></span>
        )}
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
          <div className="message-container node-panel">
            <TextsmsIcon color="primary" />
            Message
          </div>
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
