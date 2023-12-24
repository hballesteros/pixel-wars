import { type Handlers } from 'https://deno.land/x/fresh@1.6.1/server.ts'
import { updateGrid } from '../../shared/db.ts'
import { WIDTH, HEIGHT } from '../../shared/constants.ts';
import { COLORS } from "../../shared/constants.ts";

export const handler: Handlers = {
  async POST(request) {

    const { index, color } = await request.json()

    if(typeof index !== 'number') {
      return Response.json({
        error: 'Index must be a number'
      }, { status: 400 })
    }

    // validar que no intenten actualizar un pixel fuera del rango
    if( index < 0 || index >= WIDTH * HEIGHT) {
      return Response.json({
        error: 'Index out of range'
      }, { status: 400 })
    }

    if(!COLORS.includes(color)) {
      return Response.json({
        error: 'Invalid color'
      }, { status: 400 })
    }

    const versionstamp = await updateGrid(index, color)

    return Response.json({ versionstamp })

  }
}
