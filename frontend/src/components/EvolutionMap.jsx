import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  GitBranch,
  Zap,
  Target,
  Lightbulb,
  ArrowRight,
  ZoomIn,
  ZoomOut,
  Maximize,
  Layers,
  Cpu,
} from "lucide-react";

// --- Mock Data for Visualization ---
// In a real app, this would be passed as props derived from the project state
const MOCK_EVOLUTION_DATA = {
  root: {
    id: "root",
    type: "idea",
    label: "Core Idea",
    description: "AI-powered fitness app for personalized hydration.",
    date: "2023-10-01",
  },
  branches: [
    {
      id: "element-1",
      type: "element",
      label: "Supply Chain",
      parentId: "root",
      children: [
        {
          id: "pivot-1",
          type: "pivot",
          subtype: "fix",
          label: "Automate Sourcing",
          status: "completed",
          date: "2023-11-15",
        },
      ],
    },
    {
      id: "element-2",
      type: "element",
      label: "Customer Segment",
      parentId: "root",
      children: [
        {
          id: "pivot-2",
          type: "pivot",
          subtype: "pivot",
          label: "B2B Corporate Wellness",
          status: "active",
          date: "2024-01-10",
        },
        {
          id: "pivot-3",
          type: "pivot",
          subtype: "pivot",
          label: "Elderly Care Integration",
          status: "potential",
          date: "2024-02-01",
        },
      ],
    },
    {
      id: "element-3",
      type: "element",
      label: "Revenue Model",
      parentId: "root",
      children: [],
    },
  ],
};

const Node = ({ data, x, y, onClick, isSelected }) => {
  const getIcon = () => {
    if (data.type === "idea") return Lightbulb;
    if (data.type === "element") return Layers;
    if (data.type === "pivot") return data.subtype === "fix" ? Zap : GitBranch;
    return Target;
  };

  const Icon = getIcon();
  const color =
    data.type === "idea"
      ? "text-yellow-400 bg-yellow-400/10 border-yellow-400/20"
      : data.type === "element"
      ? "text-blue-400 bg-blue-400/10 border-blue-400/20"
      : data.subtype === "fix"
      ? "text-green-400 bg-green-400/10 border-green-400/20"
      : "text-accent bg-accent/10 border-accent/20";

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10"
      style={{ left: x, top: y }}
      onClick={() => onClick(data)}
    >
      <div
        className={`relative flex flex-col items-center group ${
          isSelected ? "scale-110" : ""
        } transition-transform duration-300`}
      >
        <div
          className={`w-12 h-12 rounded-full border-2 flex items-center justify-center backdrop-blur-md shadow-[0_0_15px_rgba(0,0,0,0.5)] transition-all duration-300 ${color} ${
            isSelected
              ? "ring-2 ring-white shadow-[0_0_25px_rgba(255,255,255,0.2)]"
              : ""
          }`}
        >
          <Icon className="w-6 h-6" />
        </div>
        <div className="absolute top-14 w-32 text-center">
          <span className="text-xs font-bold text-white bg-black/50 px-2 py-1 rounded backdrop-blur-sm border border-white/10 block truncate">
            {data.label}
          </span>
          {data.date && (
            <span className="text-[10px] text-gray-400 mt-0.5 block">
              {data.date}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const Connection = ({ start, end, type }) => {
  // Calculate control points for a smooth bezier curve
  const midX = (start.x + end.x) / 2;
  const path = `M ${start.x} ${start.y} C ${midX} ${start.y}, ${midX} ${end.y}, ${end.x} ${end.y}`;

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
      <motion.path
        d={path}
        fill="none"
        stroke={
          type === "fix" ? "#4ade80" : type === "pivot" ? "#c8ff16" : "#3b82f6"
        }
        strokeWidth="2"
        strokeOpacity="0.3"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.3 }}
        transition={{ duration: 1, ease: "easeInOut" }}
      />
    </svg>
  );
};

export default function EvolutionMap({ projectData }) {
  const [selectedNode, setSelectedNode] = useState(null);
  const [zoom, setZoom] = useState(1);

  // In a real implementation, we would calculate positions dynamically based on the tree structure.
  // For this demo, we'll use fixed relative positions for the mock data.
  const centerX = 400;
  const centerY = 300;

  const nodes = [
    { ...MOCK_EVOLUTION_DATA.root, x: centerX, y: centerY },
    ...MOCK_EVOLUTION_DATA.branches.map((branch, i) => ({
      ...branch,
      x: centerX + 250,
      y: centerY + (i - 1) * 150, // Spread vertically
    })),
    // Flatten children (pivots)
    ...MOCK_EVOLUTION_DATA.branches.flatMap((branch, i) =>
      branch.children.map((child, j) => ({
        ...child,
        x: centerX + 500,
        y: centerY + (i - 1) * 150 + (j - 0.5) * 80, // Offset from parent
      }))
    ),
  ];

  const connections = [
    ...MOCK_EVOLUTION_DATA.branches.map((branch, i) => ({
      start: { x: centerX, y: centerY },
      end: { x: centerX + 250, y: centerY + (i - 1) * 150 },
      type: "element",
    })),
    ...MOCK_EVOLUTION_DATA.branches.flatMap((branch, i) =>
      branch.children.map((child, j) => ({
        start: { x: centerX + 250, y: centerY + (i - 1) * 150 },
        end: { x: centerX + 500, y: centerY + (i - 1) * 150 + (j - 0.5) * 80 },
        type: child.subtype,
      }))
    ),
  ];

  return (
    <div className="relative w-full h-[600px] bg-black/40 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-xl group">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />

      {/* Controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2 z-20">
        <button
          onClick={() => setZoom((z) => Math.min(z + 0.1, 2))}
          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-colors"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={() => setZoom((z) => Math.max(z - 0.1, 0.5))}
          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-colors"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-colors">
          <Maximize className="w-4 h-4" />
        </button>
      </div>

      {/* Map Container */}
      <div
        className="w-full h-full overflow-auto custom-scrollbar relative"
        style={{ cursor: "grab" }}
      >
        <div
          className="relative min-w-[1000px] min-h-[800px] origin-top-left transition-transform duration-300"
          style={{ transform: `scale(${zoom})` }}
        >
          {/* Connections Layer */}
          {connections.map((conn, i) => (
            <Connection
              key={i}
              start={conn.start}
              end={conn.end}
              type={conn.type}
            />
          ))}

          {/* Nodes Layer */}
          {nodes.map((node) => (
            <Node
              key={node.id}
              data={node}
              x={node.x}
              y={node.y}
              onClick={setSelectedNode}
              isSelected={selectedNode?.id === node.id}
            />
          ))}
        </div>
      </div>

      {/* Detail Panel Overlay */}
      <AnimatePresence>
        {selectedNode && (
          <motion.div
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            className="absolute top-4 right-16 bottom-4 w-80 bg-[#0A0A0A]/95 backdrop-blur-xl border border-white/10 rounded-xl p-6 shadow-2xl z-30 overflow-y-auto"
          >
            <div className="flex items-center gap-3 mb-4">
              <div
                className={`p-2 rounded-lg ${
                  selectedNode.type === "idea"
                    ? "bg-yellow-400/10 text-yellow-400"
                    : selectedNode.type === "element"
                    ? "bg-blue-400/10 text-blue-400"
                    : "bg-accent/10 text-accent"
                }`}
              >
                {selectedNode.type === "idea" ? (
                  <Lightbulb className="w-5 h-5" />
                ) : selectedNode.type === "element" ? (
                  <Layers className="w-5 h-5" />
                ) : (
                  <Target className="w-5 h-5" />
                )}
              </div>
              <div>
                <h3 className="font-bold text-white leading-tight">
                  {selectedNode.label}
                </h3>
                <span className="text-[10px] font-mono text-gray-500 uppercase">
                  {selectedNode.type}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">
                  Description
                </h4>
                <p className="text-sm text-gray-300 leading-relaxed">
                  {selectedNode.description || "No description available."}
                </p>
              </div>

              {selectedNode.status && (
                <div>
                  <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">
                    Status
                  </h4>
                  <span
                    className={`px-2 py-1 rounded text-xs font-bold uppercase border ${
                      selectedNode.status === "active"
                        ? "bg-accent/10 border-accent/20 text-accent"
                        : selectedNode.status === "completed"
                        ? "bg-green-400/10 border-green-400/20 text-green-400"
                        : "bg-gray-500/10 border-gray-500/20 text-gray-400"
                    }`}
                  >
                    {selectedNode.status}
                  </span>
                </div>
              )}

              {selectedNode.date && (
                <div className="pt-4 border-t border-white/5">
                  <span className="text-xs text-gray-500">
                    Created on {selectedNode.date}
                  </span>
                </div>
              )}
            </div>

            <button
              onClick={() => setSelectedNode(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-white"
            >
              <ArrowRight className="w-4 h-4 rotate-180" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
