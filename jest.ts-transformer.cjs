const crypto = require('crypto');
const path = require('path');
const ts = require('typescript');

const tsconfigPath = path.join(__dirname, 'tsconfig.spec.json');
const tsconfigFile = ts.readConfigFile(tsconfigPath, ts.sys.readFile);

if (tsconfigFile.error) {
  throw new Error(ts.flattenDiagnosticMessageText(tsconfigFile.error.messageText, '\n'));
}

const parsedConfig = ts.parseJsonConfigFileContent(
  tsconfigFile.config,
  ts.sys,
  __dirname,
);

const compilerOptions = {
  ...parsedConfig.options,
  module: ts.ModuleKind.CommonJS,
  moduleResolution: ts.ModuleResolutionKind.Bundler,
  sourceMap: true,
};

function formatDiagnostics(diagnostics) {
  return ts.formatDiagnosticsWithColorAndContext(diagnostics, {
    getCanonicalFileName: (fileName) => fileName,
    getCurrentDirectory: () => __dirname,
    getNewLine: () => '\n',
  });
}

module.exports = {
  process(sourceText, sourcePath) {
    const result = ts.transpileModule(sourceText, {
      compilerOptions,
      fileName: sourcePath,
      reportDiagnostics: true,
    });

    if (result.diagnostics && result.diagnostics.length > 0) {
      throw new Error(formatDiagnostics(result.diagnostics));
    }

    return {
      code: result.outputText,
      map: result.sourceMapText ? JSON.parse(result.sourceMapText) : null,
    };
  },

  getCacheKey(sourceText, sourcePath, options) {
    const configText = ts.sys.readFile(tsconfigPath) || '';

    return crypto
      .createHash('sha256')
      .update(sourceText)
      .update(sourcePath)
      .update(configText)
      .update(options.configString)
      .digest('hex');
  },
};
