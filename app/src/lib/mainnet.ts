export const mainnet = {
  network: "Vara Mainnet",
  rpc: "wss://rpc.vara.network",
  programId: "0xc1610de24425cb3644db9e701b62d97ffb12bc84e0fc60cef28ed2007ce13eae",
  codeId: "0x282f6a5640afaba6197256884ed9ab62b875dd48f9e9bdbbce96a9f96b77d182",
  deployTx: "0x20b63cc26e7440b877466e40ddb37301c1e74b3ee7b666b8bdc953b1b776ece4",
  deployBlock: 32945431,
  operator: "varanest-protocol",
  application: "varanest",
  github: "https://github.com/dexarxbt/VaraNest",
  skillsUrl: "https://raw.githubusercontent.com/dexarxbt/VaraNest/main/skills.md",
  idlUrl: "https://raw.githubusercontent.com/dexarxbt/VaraNest/main/idl/varanest.idl"
} as const;

export function shortHash(value: string, left = 8, right = 6) {
  return `${value.slice(0, left)}...${value.slice(-right)}`;
}
