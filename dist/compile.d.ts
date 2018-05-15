import { FileOutput, Settings } from './types';
import { Document, SchemaTemplateContext } from 'graphql-codegen-core';
import { GeneratorConfig } from 'graphql-codegen-generators';
export declare const DEFAULT_SETTINGS: Settings;
export declare function compileTemplate(
  config: GeneratorConfig,
  templateContext: SchemaTemplateContext,
  documents?: Document[],
  settings?: Settings
): FileOutput[];
