#!/usr/bin/env node
// Webmatrices SEO Toolkit - stdio MCP server.
// Every workflow is exposed twice from one declaration: as an MCP prompt, so it
// shows up as a command in the client UI, and as a tool, so the model can reach
// for it on its own.

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
    ListPromptsRequestSchema,
    GetPromptRequestSchema,
    ListToolsRequestSchema,
    CallToolRequestSchema
} from '@modelcontextprotocol/sdk/types.js';
import { WORKFLOWS, byName } from './workflows.js';

const server = new Server(
    { name: 'ai-seo-toolkit', version: '1.0.0' },
    { capabilities: { prompts: {}, tools: {} } }
);

/** MCP tools take a JSON Schema; the workflows declare plain argument lists. */
function schemaFor(workflow) {
    const properties = {};
    for (const arg of workflow.args) {
        properties[arg.name] = { type: 'string', description: arg.description };
    }
    return {
        type: 'object',
        properties,
        required: workflow.args.filter((a) => a.required).map((a) => a.name)
    };
}

server.setRequestHandler(ListPromptsRequestSchema, async () => ({
    prompts: WORKFLOWS.map((w) => ({
        name: w.name,
        title: w.title,
        description: w.description,
        arguments: w.args
    }))
}));

server.setRequestHandler(GetPromptRequestSchema, async ({ params }) => {
    const workflow = byName(params.name);
    if (!workflow) throw new Error(`Unknown workflow: ${params.name}`);
    return {
        description: workflow.description,
        messages: [{
            role: 'user',
            content: { type: 'text', text: workflow.build(params.arguments || {}) }
        }]
    };
});

server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: WORKFLOWS.map((w) => ({
        name: w.name,
        description: `${w.description} Returns the full instructions to follow; carry them out rather than summarising them.`,
        inputSchema: schemaFor(w)
    }))
}));

server.setRequestHandler(CallToolRequestSchema, async ({ params }) => {
    const workflow = byName(params.name);
    if (!workflow) {
        return { isError: true, content: [{ type: 'text', text: `Unknown workflow: ${params.name}` }] };
    }
    const args = params.arguments || {};
    const missing = workflow.args.filter((a) => a.required && !args[a.name]).map((a) => a.name);
    if (missing.length) {
        return {
            isError: true,
            content: [{ type: 'text', text: `Missing required argument: ${missing.join(', ')}` }]
        };
    }
    return { content: [{ type: 'text', text: workflow.build(args) }] };
});

const transport = new StdioServerTransport();
await server.connect(transport);
