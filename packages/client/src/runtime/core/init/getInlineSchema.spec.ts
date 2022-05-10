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

  expect(schema).toMatchInlineSnapshot(`
    datasource my_db {
      provider = "postgres"
      url      = env("POSTGRES_URL")
    }

    model User {
      id      String   @default(cuid()) @id
      name    String
      hobbies String[]
    }

  `)
})

it('tries to read the schema from `<dirname>/schema.prisma`', () => {
  const schema = handle(() => getInlineSchema({ dirname: path.join(fixtureDir, 'prisma') }))

  expect(schema).toMatchInlineSnapshot(`
    datasource my_db {
      provider = "postgres"
      url      = env("POSTGRES_URL")
    }

    model User {
      id      String   @default(cuid()) @id
      name    String
      hobbies String[]
    }

  `)
})

it('errors to read a bad schema from `<dirname>/<filename>`', () => {
  const schema = handle(() => getInlineSchema({ dirname: '<dirname>', filename: '<filename>' }))

  expect(schema).toMatchInlineSnapshot(`[Error: ENOENT: no such file or directory, open '<dirname>/<filename>']`)
})

it('errors to read a bad schema from `<dirname>/schema.prisma`', () => {
  const schema = handle(() => getInlineSchema({ dirname: '<dirname>' }))

  expect(schema).toMatchInlineSnapshot(`[Error: ENOENT: no such file or directory, open '<dirname>/schema.prisma']`)
})
