import path from 'path'

import { handle } from '../../../../../../helpers/blaze/handle'
import { getInlineSchema } from './getInlineSchema'

const fixtureDir = path.join(__dirname, '..', '..', '..', '..', 'fixtures', 'scalarList')

it('immediately returns the provided inline schema', () => {
  const schema = getInlineSchema({ inlineSchema: '<schema>', dirname: '<not-used>' })

  expect(schema).toMatchInlineSnapshot(`<schema>`)
})

it('tries to read the schema from `<dirname>/<filename>`', () => {
  const schema = handle(() => getInlineSchema({ dirname: path.join(fixtureDir, 'prisma'), filename: 'schema.prisma' }))

  expect(schema).toMatchInlineSnapshot(
    `ZGF0YXNvdXJjZSBteV9kYiB7CiAgcHJvdmlkZXIgPSAicG9zdGdyZXMiCiAgdXJsICAgICAgPSBlbnYoIlBPU1RHUkVTX1VSTCIpCn0KCm1vZGVsIFVzZXIgewogIGlkICAgICAgU3RyaW5nICAgQGRlZmF1bHQoY3VpZCgpKSBAaWQKICBuYW1lICAgIFN0cmluZwogIGhvYmJpZXMgU3RyaW5nW10KfQo=`,
  )
})

it('tries to read the schema from `<dirname>/schema.prisma`', () => {
  const schema = handle(() => getInlineSchema({ dirname: path.join(fixtureDir, 'prisma') }))

  expect(schema).toMatchInlineSnapshot(
    `ZGF0YXNvdXJjZSBteV9kYiB7CiAgcHJvdmlkZXIgPSAicG9zdGdyZXMiCiAgdXJsICAgICAgPSBlbnYoIlBPU1RHUkVTX1VSTCIpCn0KCm1vZGVsIFVzZXIgewogIGlkICAgICAgU3RyaW5nICAgQGRlZmF1bHQoY3VpZCgpKSBAaWQKICBuYW1lICAgIFN0cmluZwogIGhvYmJpZXMgU3RyaW5nW10KfQo=`,
  )
})

it('errors to read a bad schema from `<dirname>/<filename>`', () => {
  const schema = handle(() => getInlineSchema({ dirname: '<dirname>', filename: '<filename>' }))

  expect(schema).toMatch(`[Error: ENOENT: no such file or directory, open '<dirname>${path.sep}<filename>']`)
})

it('errors to read a bad schema from `<dirname>/schema.prisma`', () => {
  const schema = handle(() => getInlineSchema({ dirname: '<dirname>' }))

  expect(schema).toMatch(`[Error: ENOENT: no such file or directory, open '<dirname>${path.sep}schema.prisma']`)
})
