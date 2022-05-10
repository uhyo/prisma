import fs from 'fs'
import path from 'path'

import { GetPrismaClientConfig } from '../../getPrismaClient'

// pick only the relevant part of the config for this function
type Input = Pick<GetPrismaClientConfig, 'dirname' | 'filename' | 'inlineSchema'>

/**
 * Get the schema from the provided config or tries to read it from a file.
 *
 * @param {Input} input
 * @returns schema contents
 */
export function getInlineSchema({ dirname, filename, inlineSchema }: Input) {
  if (inlineSchema) return inlineSchema

  // this should never happen for users, just when used internally
  const schemaPath = path.join(dirname, filename ?? 'schema.prisma')

  return fs.readFileSync(schemaPath, 'base64')
}
