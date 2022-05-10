import { ClientEngineType } from '@prisma/sdk'
import crypto from 'crypto'

/**
 * Builds an inline schema hash for the data proxy client needed to communicate
 * with the data proxy. We do this at generation time to save on compute time.
 * @param inlineSchema
 * @returns
 */
export function buildInlineSchemaHash(clientEngineType: ClientEngineType, inlineSchema: string) {
  if (clientEngineType === ClientEngineType.DataProxy) {
    const schemaHash = crypto.createHash('sha256').update(inlineSchema).digest('hex')

    return `
config.inlineSchemaHash = '${schemaHash}'`
  }

  return ``
}
