use sails_rs::{client::*, gtest::*};
use varanest_client::{
    credentials::Credentials, declarations::Declarations, registry::Registry, trials::Trials,
    VaranestClient, VaranestClientCtors, Verdict,
};

const DECLARER: u64 = 42;
const CHALLENGER: u64 = 43;
const WITNESS_ONE: u64 = 44;
const WITNESS_TWO: u64 = 45;

#[tokio::test]
async fn verified_trial_mints_credential() {
    let system = System::new();
    system.init_logger_with_default_filter("gwasm=debug,gtest=info,sails_rs=debug");
    for actor in [DECLARER, CHALLENGER, WITNESS_ONE, WITNESS_TWO] {
        system.mint_to(actor, 100_000_000_000_000);
    }
    let program_code_id = system.submit_code(varanest::WASM_BINARY);
    let env = GtestEnv::new(system, DECLARER.into());

    let program = env
        .deploy::<varanest_client::VaranestClientProgram>(program_code_id, b"salt".to_vec())
        .new()
        .await
        .unwrap();

    let mut registry = program.registry();
    registry
        .register_agent("cipher-scribe".to_string(), "Governance summarizer".to_string())
        .await
        .unwrap();

    let mut declarations = program.declarations();
    let declaration_id = declarations
        .declare_capability(
            "I can summarize governance proposals accurately.".to_string(),
            "Governance".to_string(),
            5,
        )
        .await
        .unwrap();

    let challenger_env = env.clone().with_actor_id(CHALLENGER.into());
    let challenger_program = Actor::<varanest_client::VaranestClientProgram, _>::new(
        challenger_env,
        program.id(),
    );
    let mut challenger_registry = challenger_program.registry();
    challenger_registry
        .register_agent("audit-vector".to_string(), "Adversarial verifier".to_string())
        .await
        .unwrap();
    let mut challenger_trials = challenger_program.trials();
    let trial_id = challenger_trials
        .issue_challenge(declaration_id, 5, 100)
        .await
        .unwrap();

    let mut declarer_trials = program.trials();
    declarer_trials
        .submit_proof(
            trial_id,
            "Matched quorum, treasury spend, and voting implications.".to_string(),
        )
        .await
        .unwrap();

    for (actor, handle) in [(WITNESS_ONE, "witness-zero"), (WITNESS_TWO, "proof-lens")] {
        let witness_env = env.clone().with_actor_id(actor.into());
        let witness_program =
            Actor::<varanest_client::VaranestClientProgram, _>::new(witness_env, program.id());
        let mut witness_registry = witness_program.registry();
        witness_registry
            .register_agent(handle.to_string(), "Independent witness".to_string())
            .await
            .unwrap();
        let mut witness_trials = witness_program.trials();
        witness_trials
            .cast_witness_vote(trial_id, true, 1)
            .await
            .unwrap();
    }

    let verdict = declarer_trials.settle_trial(trial_id).await.unwrap();
    assert_eq!(verdict, Verdict::Verified);

    let credentials = program
        .credentials()
        .get_agent_credentials(DECLARER.into())
        .await
        .unwrap();
    assert_eq!(credentials.len(), 1);
    assert_eq!(credentials[0].category, "Governance".to_string());
}
