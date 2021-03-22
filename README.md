# register

提供 node -r 的执行方式。可以执行普通的 TypeScript 文件，也可以执行使用了 `@rotcare/codegen` 的 rotcare 项目的 TypeScript。

`node -r @rotcare/register` 代替了 `node -r ts-eager/register` 或者 `node -r ts-node/register` 等执行 TypeScript 的 register。
