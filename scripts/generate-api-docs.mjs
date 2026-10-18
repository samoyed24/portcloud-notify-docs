import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const specPath = resolve(root, '.vitepress/openapi.json')
const spec = JSON.parse(readFileSync(specPath, 'utf8'))
const models = spec.components?.schemas ?? {}
const operations = [
  { slug: 'send', path: '/api/v1/send', method: 'post', zh: '发送通知', en: 'Send a notification' },
  {
    slug: 'send-preset',
    path: '/api/v1/send-preset',
    method: 'post',
    zh: '使用发送预设',
    en: 'Send with a sending preset',
    body: '{"title":"Hello","body":"Sent via Portcloud Notify"}',
  },
  {
    slug: 'status',
    path: '/api/v1/send/{log_id}',
    method: 'get',
    zh: '查询发送状态',
    en: 'Delivery status',
  },
  {
    slug: 'account',
    path: '/api/v1/me',
    method: 'get',
    zh: '账号与 Message Credits',
    en: 'Account and Message Credits',
  },
  {
    slug: 'recipients',
    path: '/api/v1/emails',
    method: 'get',
    zh: '已验证收件邮箱',
    en: 'Verified recipients',
  },
  { slug: 'logs', path: '/api/v1/logs', method: 'get', zh: '发送日志', en: 'Send logs' },
  {
    slug: 'stats',
    path: '/api/v1/stats/overview',
    method: 'get',
    zh: '统计概览',
    en: 'Statistics',
  },
]

const labels = {
  zh: {
    generated: '本页由后端 OpenAPI 契约自动生成，参数和响应结构随代码同步。',
    auth: '鉴权',
    authBody: '所有公开接口使用 API Key，不使用控制台会话 Cookie。',
    request: '请求示例',
    parameters: '路径与查询参数',
    body: '请求体',
    responses: '响应',
    headers: '响应头',
    models: '数据结构',
    field: '字段',
    type: '类型',
    required: '必填',
    detail: '说明与约束',
    location: '位置',
    yes: '是',
    no: '否',
    default: '默认值',
    values: '可选值',
    minimum: '最小值',
    maximum: '最大值',
    minLength: '最小长度',
    maxLength: '最大长度',
    pattern: '匹配规则',
    format: '格式',
    download: '下载公开 OpenAPI 契约',
    errors: '错误处理',
    sendingNote:
      '201 只表示已受理。用返回的 `log_id` [查询发送状态](/api/status)，不要自动重发结果未知的通知。',
    presetNote:
      '请求体只有 `title` 与 `body`，不含预设 ID。尚未配置预设时返回 `400 NO_PRESET`。受理返回单个 `log_id`，用[查询发送状态](/api/status)轮询到终态。',
  },
  en: {
    generated:
      'Generated from the backend OpenAPI contract. Parameters and response structures are published with the code.',
    auth: 'Authentication',
    authBody: 'All public endpoints require an API key, not the console session cookie.',
    request: 'Request example',
    parameters: 'Path and query parameters',
    body: 'Request body',
    responses: 'Responses',
    headers: 'Response headers',
    models: 'Data structures',
    field: 'Field',
    type: 'Type',
    required: 'Required',
    detail: 'Description and constraints',
    location: 'Location',
    yes: 'Yes',
    no: 'No',
    default: 'Default',
    values: 'Allowed values',
    minimum: 'Minimum',
    maximum: 'Maximum',
    minLength: 'Min length',
    maxLength: 'Max length',
    pattern: 'Pattern',
    format: 'Format',
    download: 'Download the public OpenAPI contract',
    errors: 'Error handling',
    sendingNote:
      '201 means accepted only. Use the returned `log_id` to [check delivery status](/en/api/status); do not automatically resend a notification with an unknown outcome.',
    presetNote:
      'The body is only `title` and `body`, with no preset ID. Returns `400 NO_PRESET` when none is configured. Acceptance returns a single `log_id`; poll [delivery status](/en/api/status) for the terminal result.',
  },
}

function cell(value) {
  return String(value ?? '—')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('|', '\\|')
    .replace(/\r?\n/g, '<br>')
}

function refName(ref) {
  if (!ref.startsWith('#/components/schemas/'))
    throw new Error(`Unsupported schema reference: ${ref}`)
  const name = ref.slice('#/components/schemas/'.length).replaceAll('~1', '/').replaceAll('~0', '~')
  if (!models[name]) throw new Error(`Missing schema: ${name}`)
  return name
}

function resolveSchema(schema) {
  return schema?.$ref ? models[refName(schema.$ref)] : (schema ?? {})
}

function schemaType(schema) {
  if (schema.$ref) return refName(schema.$ref)
  if (schema.anyOf || schema.oneOf)
    return (schema.anyOf ?? schema.oneOf).map(schemaType).join(' | ')
  if (schema.allOf) return schema.allOf.map(schemaType).join(' & ')
  if (schema.type === 'array') return `Array<${schemaType(schema.items ?? {})}>`
  if (Array.isArray(schema.type)) return schema.type.join(' | ')
  return schema.type ?? (schema.properties ? 'object' : 'unknown')
}

function detail(schema, text) {
  const parts = []
  if (schema.description) parts.push(schema.description)
  const resolved = resolveSchema(schema)
  for (const key of [
    'default',
    'enum',
    'minimum',
    'maximum',
    'minLength',
    'maxLength',
    'pattern',
    'format',
  ]) {
    if (resolved[key] === undefined) continue
    const label = key === 'enum' ? text.values : text[key]
    parts.push(`${label}: ${JSON.stringify(resolved[key])}`)
  }
  return parts.join('; ') || '—'
}

function fieldTable(schema, text) {
  const resolved = resolveSchema(schema)
  if (!resolved.properties) return `\`${schemaType(schema)}\`\n`
  const rows = [
    `| ${text.field} | ${text.type} | ${text.required} | ${text.detail} |`,
    '| --- | --- | --- | --- |',
  ]
  for (const [name, value] of Object.entries(resolved.properties)) {
    rows.push(
      `| \`${cell(name)}\` | ${cell(schemaType(value))} | ${resolved.required?.includes(name) ? text.yes : text.no} | ${cell(detail(value, text))} |`,
    )
  }
  return rows.join('\n') + '\n'
}

function referencedModels(value, found = new Set()) {
  if (!value || typeof value !== 'object') return found
  if (value.$ref) {
    const name = refName(value.$ref)
    if (!found.has(name)) {
      found.add(name)
      referencedModels(models[name], found)
    }
  }
  for (const child of Object.values(value)) referencedModels(child, found)
  return found
}

mkdirSync(resolve(root, 'public'), { recursive: true })
copyFileSync(specPath, resolve(root, 'public/openapi.json'))

for (const language of ['zh', 'en']) {
  const text = labels[language]
  const base = language === 'en' ? '/en/' : '/'
  const target = resolve(root, language === 'en' ? 'en/api' : 'api')
  mkdirSync(target, { recursive: true })
  for (const operation of operations) {
    const contract = spec.paths[operation.path]?.[operation.method]
    if (!contract)
      throw new Error(`Missing public operation: ${operation.method} ${operation.path}`)
    if (!contract.security?.some((scheme) => Object.hasOwn(scheme, 'ApiKey'))) {
      throw new Error(`Missing API key security declaration: ${operation.path}`)
    }
    const sections = [
      `# ${operation[language]}`,
      text.generated,
      `<span class="api-method">${operation.method.toUpperCase()}</span> \`${operation.path}\``,
      `## ${text.auth}\n\n${text.authBody}\n\n\`Authorization: Bearer pck_…\``,
    ]
    if (operation.slug === 'send') sections.push(`::: warning\n${text.sendingNote}\n:::`)
    if (operation.slug === 'send-preset') sections.push(`::: warning\n${text.presetNote}\n:::`)
    const url = `https://notify.portcloud.online${operation.path.replace('{log_id}', '12345')}`
    const request = [
      `curl${operation.method === 'post' ? ' -X POST' : ''} '${url}' \\`,
      '  -H "Authorization: Bearer $PORTCLOUD_NOTIFY_API_KEY"',
    ]
    if (operation.method === 'post') {
      request[1] += ' \\'
      request.push(
        '  -H "Content-Type: application/json" \\',
        `  -d '${operation.body ?? '{"type":"email","to":"you@example.com","title":"Hello","body":"Sent via Portcloud Notify"}'}'`,
      )
    }
    sections.push(`## ${text.request}\n\n\`\`\`bash\n${request.join('\n')}\n\`\`\``)
    const parameters = contract.parameters ?? []
    if (parameters.length) {
      const rows = [
        `| ${text.field} | ${text.location} | ${text.type} | ${text.required} | ${text.detail} |`,
        '| --- | --- | --- | --- | --- |',
      ]
      for (const parameter of parameters) {
        rows.push(
          `| \`${cell(parameter.name)}\` | ${cell(parameter.in)} | ${cell(schemaType(parameter.schema ?? {}))} | ${parameter.required ? text.yes : text.no} | ${cell(detail({ ...parameter.schema, description: parameter.description ?? parameter.schema?.description }, text))} |`,
        )
      }
      sections.push(`## ${text.parameters}\n\n${rows.join('\n')}`)
    }
    const requestBody = contract.requestBody?.content?.['application/json']?.schema
    if (requestBody)
      sections.push(
        `## ${text.body}\n\n\`Content-Type: application/json\`\n\n${fieldTable(requestBody, text)}`,
      )
    const responses = []
    for (const [status, response] of Object.entries(contract.responses)) {
      responses.push(`### ${status}\n\n${response.description ?? ''}`)
      if (response.headers) {
        const rows = [`| ${text.field} | ${text.type} | ${text.detail} |`, '| --- | --- | --- |']
        for (const [name, header] of Object.entries(response.headers)) {
          rows.push(
            `| \`${cell(name)}\` | ${cell(schemaType(header.schema ?? {}))} | ${cell(header.description)} |`,
          )
        }
        responses.push(`**${text.headers}**\n\n${rows.join('\n')}`)
      }
      for (const [mediaType, content] of Object.entries(response.content ?? {})) {
        responses.push(`\`${mediaType}\`\n\n${fieldTable(content.schema ?? {}, text)}`)
      }
    }
    sections.push(`## ${text.responses}\n\n${responses.join('\n\n')}`)
    const referenced = [...referencedModels(contract)].sort()
    if (referenced.length) {
      sections.push(
        `## ${text.models}\n\n${referenced.map((name) => `### ${name}\n\n${fieldTable(models[name], text)}`).join('\n\n')}`,
      )
    }
    sections.push(`[${text.errors}](${base}errors) · [${text.download}](/openapi.json)`)
    writeFileSync(resolve(target, `${operation.slug}.md`), sections.join('\n\n') + '\n')
  }
}
console.log(`Generated ${operations.length * 2} localized API pages from OpenAPI ${spec.openapi}.`)
