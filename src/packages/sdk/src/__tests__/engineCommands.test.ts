import { getDMMF, getConfig, formatSchema } from '../engineCommands'
import stripAnsi from 'strip-ansi'
import fs from 'fs'
import path from 'path'

jest.setTimeout(10000)

describe('getDMMF', () => {
  test('simple model', async () => {
    const dmmf = await getDMMF({
      datamodel: `model A {
    id Int @id
    name String
  }`,
    })

    expect(dmmf.datamodel).toMatchInlineSnapshot(`
      Object {
        "enums": Array [],
        "models": Array [
          Object {
            "dbName": null,
            "fields": Array [
              Object {
                "isGenerated": false,
                "isId": true,
                "isList": false,
                "isReadOnly": false,
                "isRequired": true,
                "isUnique": false,
                "isUpdatedAt": false,
                "kind": "scalar",
                "name": "id",
                "type": "Int",
              },
              Object {
                "isGenerated": false,
                "isId": false,
                "isList": false,
                "isReadOnly": false,
                "isRequired": true,
                "isUnique": false,
                "isUpdatedAt": false,
                "kind": "scalar",
                "name": "name",
                "type": "String",
              },
            ],
            "idFields": Array [],
            "isEmbedded": false,
            "isGenerated": false,
            "name": "A",
            "uniqueFields": Array [],
          },
        ],
      }
    `)
    expect(dmmf).toMatchSnapshot()
  })

  test('big schema', async () => {
    const file = fs.readFileSync(
      path.join(__dirname, '../../fixtures/bigschema.prisma'),
      'utf-8',
    )
    const dmmf = await getDMMF({ datamodel: file })
    const str = JSON.stringify(dmmf)
    expect(str.length).toMatchInlineSnapshot(`56783345`)
  })

  test('with validation errors', async () => {
    const datamodel = `generator client {
      provider = "prisma-client-js"
    }
    
    datasource my_db {
      provider = "sqlite"
      url      = "file:dev.db"
    }
    
    model User {
      id           String     @id @default(cuid())
      id           String     @id @default(cuid())
      name         String
      email        String     @unique
      status       String     @default("")
      permissions  Permission @default()
      permissions  Permission @default("")
      posts        Post[]
      posts        Post[]
    }
    
    model Post {
      id        String   @id @default(cuid())
      name      String
      email     String   @unique
      createdAt DateTime @default(now())
      updatedAt DateTime @updatedAt
    }
    
    enum Permission {
      ADMIN
      USER
      OWNER
      COLLABORATOR
    }
    `
    /* eslint-disable jest/no-try-expect */
    try {
      await getDMMF({ datamodel })
    } catch (e) {
      expect(stripAnsi(e.message)).toMatchSnapshot()
    }
    /* eslint-enable jest/no-try-expect */
  })
})

describe('getConfig', () => {
  test('empty config', async () => {
    const config = await getConfig({
      datamodel: `model A {
      id Int @id
      name String
    }`,
    })

    expect(config).toMatchSnapshot()
  })

  test('with generator and datasource', async () => {
    const config = await getConfig({
      datamodel: `
    datasource db {
      url = "file:dev.db"
      provider = "sqlite"
    }

    generator gen {
      provider = "fancy-provider"
      binaryTargets = ["native"]
    }

    model A {
      id Int @id
      name String
    }`,
    })

    expect(config).toMatchSnapshot()
  })
})

describe('format', () => {
  test('valid blog schema', async () => {
    const formatted = await formatSchema({
      schemaPath: path.join(__dirname, 'fixtures/blog.prisma'),
    })

    expect(formatted).toMatchInlineSnapshot(`
      "datasource db {
        provider = \\"sqlite\\"
        url      = \\"file:dev.db\\"
      }

      generator client {
        provider      = \\"prisma-client-js\\"
        binaryTargets = [\\"native\\"]
      }

      model User {
        id    String  @default(cuid()) @id
        email String  @unique
        name  String?
        posts Post[]
        Like  Like[]
      }

      model Post {
        id        String   @default(cuid()) @id
        createdAt DateTime @default(now())
        updatedAt DateTime @updatedAt
        published Boolean
        title     String
        content   String?
        authorId  String?
        author    User?    @relation(fields: [authorId], references: [id])
        Like      Like[]
      }

      model Like {
        id     String @default(cuid()) @id
        userId String
        user   User   @relation(fields: [userId], references: [id])
        postId String
        post   Post   @relation(fields: [postId], references: [id])

        @@unique([userId, postId])
      }"
    `)
  })
})
