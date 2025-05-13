"use client";
import React, { useState, useEffect } from 'react';
import { LayoutGrid, ChevronLeft, ChevronRight, Eye, EyeOff, ZoomIn, ZoomOut, RefreshCw } from 'lucide-react';
import NodeLinkImporter from "./NodeLinkImporter";

// Cytoscape
import Cytoscape from 'cytoscape';
import CytoscapeComponent from 'react-cytoscapejs';
// @ts-ignore
import COSEBilkent from 'cytoscape-cose-bilkent';
// @ts-ignore
import cola from 'cytoscape-cola';
// @ts-ignore
import dagre from 'cytoscape-dagre';
// @ts-ignore
import elk from 'cytoscape-elk';
// @ts-ignore
import klay from 'cytoscape-klay';

Cytoscape.use(COSEBilkent);
Cytoscape.use(cola);
// @ts-ignore
Cytoscape.use(dagre);
Cytoscape.use(elk);
Cytoscape.use(klay);

interface Layouts {
  [key: string]: cytoscape.LayoutOptions;
}
interface Node {
  id: string;
  label: string;
  content: string[];
}
// 利用可能なレイアウトの定義
// https://js.cytoscape.org/#extensions/layout-extensions
// https://blog.js.cytoscape.org/2020/05/11/layouts/
const layouts = {
  'cose': { name: 'cose', animate: true, randomize: false, nodeDimensionsIncludeLabels: true },
  'breadthfirst': { name: 'breadthfirst', directed: true, animate: true, spacingFactor: 1.5 },
  'concentric': { name: 'concentric', animate: true, minNodeSpacing: 50 },
  'grid': { name: 'grid', animate: true, condense: true },
  'circle': { name: 'circle', animate: true },
  'random': { name: 'random', animate: true },
  'preset': { name: 'preset', animate: true },
  'null': { name: 'null', animate: false },
  'cose-bilkent': { name: 'cose-bilkent', animate: true, randomize: false, nodeDimensionsIncludeLabels: true },
  'cola': { name: 'cola', animate: true, randomize: false, nodeDimensionsIncludeLabels: true },
  'dagre': { name: 'dagre', directed: true, animate: true, spacingFactor: 1.5 },
  'elk': { name: 'elk', animate: true, randomize: false, nodeDimensionsIncludeLabels: true },
  'klay': { name: 'klay', animate: true, randomize: false, nodeDimensionsIncludeLabels: true }
};

function LayoutButton(
  { layoutName, currentLayout, onClick }: 
  { layoutName: keyof typeof layouts; currentLayout: string; onClick: (layoutName: keyof typeof layouts) => void }) {
  return (
    <button 
    onClick={() => onClick(layoutName)} 
    style={{ 
      padding: '5px 10px', 
      backgroundColor: currentLayout === layoutName? '#3b82f6' : '#e5e7eb',
      color: currentLayout === layoutName ? 'white' : 'black',
      border: 'none', 
      borderRadius: '4px', 
      cursor: 'pointer' 
    }}
  >
    {layoutName}
  </button>
  )
}

export default function App() {
  const [layout, setLayout] = useState<keyof typeof layouts>('cose');
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [cy, setCy] = useState<cytoscape.Core | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [elements, setElements] = useState<cytoscape.ElementDefinition[]>([]);
  
  // クライアントサイドレンダリングの確認
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // ノードがクリックされた時の処理
  useEffect(() => {
    if (cy) {
      cy.on('tap', 'node', function(evt) {
        const node = evt.target;
        setSelectedNode({
          id: node.id(),
          label: node.data('label'),
          content: node.data('content') || []
        });
      });
      
      cy.on('tap', function(evt) {
        if (evt.target === cy) {
          setSelectedNode(null);
        }
      });
      
      // クリーンアップ関数
      return () => {
        cy.removeAllListeners();
      };
    }
  }, [cy]);


  
  const stylesheet = [
    {
      selector: 'node',
      style: {
        'background-color': '#ffffff',
        'border-width': 1,
        'border-color': '#333333',
        'label': 'data(label)',
        'text-wrap': 'wrap' as 'wrap',
        'text-valign': 'center' as 'center',
        'text-halign': 'center' as 'center',
        'text-max-width': '200px',
        'font-size': '12px',
        'color': '#000000',
        'width': 'label',
        'height': 'label',
        'padding': '15px',
        'shape': 'round-rectangle'
      }
    },
    {
      selector: 'node[primary]',
      style: {
        'background-color': '#f5f5f5',
        'border-color': '#000000',
        'border-width': 2,
        'font-weight': 'bold',
        'color': '#000000'
      }
    },
    {
      selector: 'node:selected',
      style: {
        'border-color': '#000000',
        'border-width': 3,
        'background-color': '#e0e0e0'
      }
    },
    {
      selector: 'edge',
      style: {
        'width': 2,
        'line-color': '#666666',
        'target-arrow-color': '#666666',
        'target-arrow-shape': 'triangle',
        'curve-style': 'bezier',
        'arrow-scale': 0.8
      }
    }
  ];
  
  
  const changeLayout = (layoutName: keyof typeof layouts) => {
    setLayout(layoutName);
    
    if (cy) {
      cy.layout(layouts[layoutName]).run();
    }
  };
  
  // 全体表示に戻る関数
  const fitView = () => {
    if (cy) {
      cy.fit();
    }
  };

  // ズームイン
  const zoomIn = () => {
    if (cy) {
      cy.zoom(cy.zoom() * 1.2);
    }
  };

  // ズームアウト
  const zoomOut = () => {
    if (cy) {
      cy.zoom(cy.zoom() / 1.2);
    }
  };
  
  if (!isClient) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p>Loading...</p>
      </div>
    );
  }
  
  return (
    <div 
      style={{ 
        backgroundColor: '#fcfcfc', 
        display: 'flex', 
        flexDirection: 'column', 
        height: '95vh',
        width: '95vw',
        position: 'relative'
      }}
    >
      {/* パネル表示切り替えボタン */}
      <button
        onClick={() => setShowControls(!showControls)}
        style={{
          position: 'absolute',
          top: 10,
          left: showControls ? 10 : 10,
          zIndex: 20,
          backgroundColor: '#3b82f6',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          padding: '8px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)'
        }}
        title={showControls ? 'パネルを隠す' : 'パネルを表示'}
      >
        {showControls ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
      </button>

      {/* レイアウト変更コントロールパネル */}
      {showControls && (
      <div 
        style={{ 
          position: 'absolute', 
          maxWidth: '300px',
          top: 10, 
          left: 40, 
          zIndex: 10, 
          backgroundColor: 'white', 
          padding: '10px', 
          borderRadius: '4px',
          boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <LayoutGrid size={18} />
            Layout Controls
          </h3>
          <Eye size={18} style={{ color: '#6b7280', cursor: 'pointer' }} onClick={() => setShowControls(false)} />
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '10px' }}>
            {Object.keys(layouts).map((layoutName) => (
              <LayoutButton 
                key={layoutName} 
                layoutName={layoutName as keyof typeof layouts} 
                currentLayout={layout} 
                onClick={changeLayout} 
              />
            ))}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
          <button 
            onClick={fitView} 
            style={{ 
              padding: '5px 10px', 
              backgroundColor: '#10b981', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px', 
              cursor: 'pointer',
              marginLeft: '10px'
            }}
          >
            Fit View
          </button>
          <button 
            onClick={zoomIn} 
            style={{ 
              padding: '5px 10px', 
              backgroundColor: '#6b7280', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px', 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <ZoomIn size={16} />
          </button>
          <button 
            onClick={zoomOut} 
            style={{ 
              padding: '5px 10px', 
              backgroundColor: '#6b7280', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px', 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <ZoomOut size={16} />
          </button>
        </div>
        <div style={{ position: "relative", padding: "10px 0" }}>
          <NodeLinkImporter onLoad={setElements} />
        </div>
      </div>
      )}
      
      {/* 選択されたノードの詳細パネル */}
      {selectedNode && (
        <div 
          style={{ 
            position: 'absolute', 
            top: "40%", 
            right: 0, 
            zIndex: 10, 
            backgroundColor: 'white', 
            padding: '15px', 
            borderRadius: '4px',
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
            maxWidth: '300px',
            overflowY: 'auto',
            maxHeight: '80vh'
          }}
        >
          <h3 style={{ margin: '0 0 10px 0' }}>{selectedNode.label}</h3>
          {selectedNode.content && selectedNode.content.length > 0 ? (
            <ul style={{ margin: '0', paddingLeft: '20px' }}>
              {selectedNode.content.map((item, index) => (
                <li key={index} style={{ marginBottom: '5px' }}>{item}</li>
              ))}
            </ul>
          ) : (
            <p style={{ color: '#6b7280', fontStyle: 'italic' }}>詳細情報なし</p>
          )}
          <button 
            onClick={() => setSelectedNode(null)} 
            style={{ 
              marginTop: '10px',
              padding: '5px 10px', 
              backgroundColor: '#ef4444', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px', 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <EyeOff size={16} />
            閉じる
          </button>
        </div>
      )}
      
      {(elements.length === 0) && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '48px' , fontWeight: 'bold' }}>
          <p>No elements found.</p>
        </div>
      )}
      {elements.length > 0 && (
        <CytoscapeComponent 
          // @ts-ignore
          elements={elements} 
          // @ts-ignore
          stylesheet={stylesheet as cytoscape.Stylesheet[]}
          style={{ width: '100%', height: '100%' }}
          layout={layouts[layout]}
          cy={(cy) => { 
            setCy(cy as unknown as cytoscape.Core); 
          }}
          boxSelectionEnabled={true}
          wheelSensitivity={0.3}
        />
      )}

    </div>
  );
}