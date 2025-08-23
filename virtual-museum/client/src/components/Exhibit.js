import { useState } from 'react'

export default function Exhibit(props) {
  const [hovered, setHovered] = useState(false)

  return (
    <mesh
      {...props}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial color={hovered ? 'orange' : 'white'} />
    </mesh>
  )
}