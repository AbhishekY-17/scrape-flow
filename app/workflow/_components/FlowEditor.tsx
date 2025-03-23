"use client"

import { Workflow } from '@prisma/client'
import { addEdge, Background, BackgroundVariant, Connection, Controls, Edge, getOutgoers, ReactFlow, useEdgesState, useNodesState, useReactFlow } from '@xyflow/react'
import React, { useCallback, useEffect } from 'react'
import "@xyflow/react/dist/style.css";
import { CreateFlowNode } from '@/lib/workflow/createFlowNode';
import { TaskParamType, TaskType } from '@/types/task';
import NodeComponent from './nodes/NodeComponent';
import { AppNode } from '@/types/appNode';
import DeletableEdge from './edges/DeletableEdge';
import { TaskRegistry } from '@/lib/workflow/task/registry';

const nodeTypes = {
  FlowScrapeNode: NodeComponent,
}

const edgeTypes = {
  default: DeletableEdge,
}

const snapGrid: [number, number] = [50, 50];
const fitViewOptions = { padding: 2};

function FlowEditor({ workflow }: { workflow: Workflow }) {
  const [nodes, setNodes, onNodesChange] = useNodesState<AppNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const { setViewport, screenToFlowPosition, updateNodeData } = useReactFlow();
  useEffect(() => {
    try {
      const flow = JSON.parse(workflow.definition);
      if (!flow) return;
      setNodes(flow.nodes || []);
      setEdges(flow.edges || []);
      if (!flow.viewport) return;
      const { x = 0, y = 0, zoom = 1} = flow.viewport;
      setViewport({x, y, zoom});
    } catch (error) {}
  }, [  ]);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move'
  }, []);

  const onDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    const taskType = event.dataTransfer.getData("application/reactflow");
    if (typeof taskType === undefined || !taskType) return;

    const position = screenToFlowPosition({
      x: event.clientX,
      y: event.clientY,
    });

    const newNode = CreateFlowNode(taskType as TaskType, position);
    setNodes((nds) => nds.concat(newNode));
  }, [screenToFlowPosition, setNodes])

  const onConnect = useCallback((connection: Connection) => {
    setEdges((eds) => addEdge({...connection}, eds));
    if(!connection.targetHandle) return;
    // remove input value if is present on connection
    const node = nodes.find((nd) => nd.id === connection.target);
    if (!node) return;
    const nodeInputs = node.data.inputs;
    // delete nodeInputs[connection.targetHandle];
    // updateNodeData(node.id, {inputs: nodeInputs});
    updateNodeData(node.id, {
      inputs: {
        ...nodeInputs,
        [connection.targetHandle]: "",
      },
    });
  }, [setEdges, updateNodeData, nodes]);
  
  const isValidConnection = useCallback(
    (connection: Edge | Connection) => {
      // no self-connection
      if(connection.source === connection.target) {
        return false;
      }
      // Same taskParam type connection
      const source = nodes.find((node) => node.id === connection.source);
      const target = nodes.find((node) => node.id === connection.target);
      if (!source || !target) {
        console.error("invalid connection: source or target not found");
        return false;
      }
      const sourceTask = TaskRegistry[source.data.type as keyof typeof TaskRegistry];
      const targetTask = TaskRegistry[target.data.type as keyof typeof TaskRegistry];
      
      const output = sourceTask.outputs.find(
        (o) => o.name === connection.sourceHandle
      );

      const input = targetTask.inputs.find(
        (o) => o.name === connection.targetHandle
      );

      if ((input?.type as TaskParamType) !== (output?.type as TaskParamType)) {
        console.log("invalid connection: type mismatch");
        return false;
      }
      // console.log("##DEBUG", { input, output });

      const hasCycle = (node: AppNode, visited = new Set()) => {
        if (visited.has(node.id)) return false;
        visited.add(node.id);
 
        for (const outgoer of getOutgoers(node, nodes, edges)) {
          if (outgoer.id === connection.source) return true;
          if (hasCycle(outgoer, visited)) return true;
        }
      };
      const detectedCycle = hasCycle(target);
      return !detectedCycle;
    },
    [nodes, edges]);
  return (
    <main className='h-full w-full'>
        <ReactFlow 
        nodes={nodes} 
        edges={edges}
        onEdgesChange={onEdgesChange}
        onNodesChange={onNodesChange}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        snapToGrid
        snapGrid={snapGrid}
        fitViewOptions={fitViewOptions}
        fitView
        onDragOver={onDragOver}
        onDrop={onDrop}
        onConnect={onConnect}
        isValidConnection={isValidConnection}
        >
            <Controls position="top-left" fitViewOptions={fitViewOptions}/>
            <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        </ReactFlow>
    </main>
  )
}

export default FlowEditor