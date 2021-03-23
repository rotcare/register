# register

```
yarn add @rotcare/register --dev
```

提供 node -r 执行 .ts 文件的能力。可以执行普通的 TypeScript 文件，也可以执行使用了 `@rotcare/codegen` 的 rotcare 项目的 TypeScript。

例如

```
node -r @rotcare/register hello.ts
```

`node -r @rotcare/register` 代替了 `node -r ts-eager/register` 或者 `node -r ts-node/register` 等执行 TypeScript 的 register。

# 命令行

* `rotcare-show <qualifiedName>` 查看指定 TypeScript 文件构建之后的 JavaScript 代码，需要在 Project 的目录下执行