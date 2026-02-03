import React from 'react'

function GraphStage() {
  return (
    <section 
      id="graph"
      className="fixed inset-0 w-dvw h-dvh z-0 overflow-hidden"
      style={{ backgroundColor: 'lightgreen'}}
    >
      {/* ThreeJS Canvas will be rendered here */}
      <div className="w-full h-full" />
    </section>
  )
}

export default GraphStage