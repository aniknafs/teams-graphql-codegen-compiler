import { FileOutput, MultiFileTemplates, Settings } from './types';
import { GeneratorConfig } from 'graphql-codegen-generators';
import { SchemaTemplateContext, Document } from 'graphql-codegen-core';
export declare const ALLOWED_CUSTOM_TEMPLATE_EXT: string[];
export declare function generateMultipleFiles(
  templates: MultiFileTemplates,
  executionSettings: Settings,
  config: GeneratorConfig,
  templateContext: SchemaTemplateContext,
  documents: Document
): FileOutput[];
