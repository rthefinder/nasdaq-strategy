import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { NasdaqStrategyCore } from "../target/types/nasdaq_strategy_core";
import { assert } from "chai";

describe("nasdaq-strategy-core", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.NasdaqStrategyCore as Program<NasdaqStrategyCore>;

  it("Can initialize config", async () => {
    const tx = await program.methods
      .initialize(new anchor.BN(1000000), 400)
      .accounts({
        config: anchor.web3.PublicKey.default,
        mint: anchor.web3.PublicKey.default,
        feeCollector: anchor.web3.PublicKey.default,
        treasury: anchor.web3.PublicKey.default,
        payer: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    console.log("Initialize tx signature", tx);
  });

  it("Can update NAV", async () => {
    const navState = anchor.web3.Keypair.generate();

    const tx = await program.methods
      .updateNav(new anchor.BN(1000000))
      .accounts({
        config: anchor.web3.PublicKey.default,
        navState: navState.publicKey,
        authority: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([navState])
      .rpc();

    console.log("Update NAV tx signature", tx);
  });
});
