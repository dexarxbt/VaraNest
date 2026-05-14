## The **varanest** program

[![Build Status](https://github.com/gear-tech/varanest/workflows/CI/badge.svg)](https://github.com/gear-tech/varanest/actions)

Program **varanest** for [⚙️ Gear Protocol](https://github.com/gear-tech/gear) written in [⛵ Sails](https://github.com/gear-tech/sails) framework.

The program workspace includes the following packages:
- `varanest` is the package allowing to build WASM binary for the program and IDL file for it.
  The package also includes integration tests for the program in the `tests` sub-folder
- `varanest-app` is the package containing business logic for the program represented by the `Varanest` structure.
- `varanest-client` is the package containing the client for the program allowing to interact with it from another program, tests, or off-chain client.

### 🏗️ Building

```bash
cargo build --release
```

### ✅ Testing

```bash
cargo test --release
```

# License

The source code is licensed under the [MIT license](LICENSE).
