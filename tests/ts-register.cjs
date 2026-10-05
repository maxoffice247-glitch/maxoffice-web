/**
 * Nạp file TypeScript trong src/ khi chạy test bằng `node --test` (không cần cài thêm thư viện test): biên dịch từng
 * file bằng gói `typescript` đã có sẵn (chỉ bỏ kiểu, không kiểm tra kiểu — kiểm tra kiểu là việc của `tsc --noEmit`) và
 * hiểu alias "@/" -> src/ như tsconfig.
 */
const ts = require("typescript");
const fs = require("fs");
const path = require("path");
const Module = require("module");

const SRC = path.join(__dirname, "..", "src") + path.sep;
const compile = (module, filename) => {
  const out = ts.transpileModule(fs.readFileSync(filename, "utf8"), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
      jsx: ts.JsxEmit.ReactJSX,
      esModuleInterop: true,
    },
  });
  module._compile(out.outputText, filename);
};
require.extensions[".ts"] = compile;
require.extensions[".tsx"] = compile;

const originalResolve = Module._resolveFilename;
Module._resolveFilename = function (request, ...rest) {
  if (request.startsWith("@/")) request = SRC + request.slice(2);
  return originalResolve.call(this, request, ...rest);
};

module.exports = { SRC };
