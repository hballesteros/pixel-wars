import { Signal } from "@preact/signals";
import { PIXEL_SIZE, WIDTH } from "../shared/constants.ts";
import { Color, Grid } from "../shared/types.ts";
import { useEffect } from "preact/hooks";

export function Tiles({
  grid,
  selectedColor,
}: {
  grid: Signal<Color[]>;
  selectedColor: Color;

}) {

    useEffect(() => {
      const eventSource = new EventSource('/api/listen')

      eventSource.onmessage = (event) => {
        const { index, color } : { index: number, color: Color } = JSON.parse(event.data)
        const gridValue = grid.value
        grid.value = gridValue.with(index, color)
      }

      return () => {
        eventSource.close()
      }
    }, [])

    const updateGrid = async (index: number, selectedColor: Color) => {

      const response = await fetch( '/api/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ index, color: selectedColor})
      })

      if (!response.ok) {
        console.log('Failed to update grid')
        return
      }

      const { versionstamp } : { versionstamp: string } = await response.json()

      const gridValue = grid.value
      // modify the grid value at the index
      grid.value = gridValue.with(index, selectedColor)
      // old way
      //gridValue[index] = selectedColor
      //grid.value = [...gridValue] // need to make a copy to trigger signal
    }

    return (
      <div className='grid' style={`
        width:${PIXEL_SIZE * WIDTH}px;
        grid-template-columns: repeat(${WIDTH}, 1fr);
      `}>
        {grid.value.map((color, index) => (
        <div key={index} className='tile' style={`
          background-color: ${color};
          width: ${PIXEL_SIZE}px;
          height: ${PIXEL_SIZE}px;
        `}
        onClick={() => {
          updateGrid(index, selectedColor)
        }}

        >
        </div>
        ))}
      </div>
    )
}
