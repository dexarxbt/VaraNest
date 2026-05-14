#![no_std]

use sails_rs::{
    cell::RefCell,
    gstd::{exec, msg},
    prelude::*,
};

#[derive(Debug, Clone, Encode, Decode, TypeInfo, PartialEq, Eq)]
#[codec(crate = sails_rs::scale_codec)]
#[scale_info(crate = sails_rs::scale_info)]
pub struct Agent {
    pub handle: String,
    pub owner: ActorId,
    pub description: String,
    pub active: bool,
    pub registration_block: u64,
}

#[derive(Debug, Clone, Encode, Decode, TypeInfo, PartialEq, Eq)]
#[codec(crate = sails_rs::scale_codec)]
#[scale_info(crate = sails_rs::scale_info)]
pub enum DeclarationStatus {
    Active,
    Challenged,
    Verified,
    Failed,
    Withdrawn,
}

#[derive(Debug, Clone, Encode, Decode, TypeInfo, PartialEq, Eq)]
#[codec(crate = sails_rs::scale_codec)]
#[scale_info(crate = sails_rs::scale_info)]
pub struct CapabilityDeclaration {
    pub id: u64,
    pub agent: ActorId,
    pub claim_text: String,
    pub category: String,
    pub stake: u128,
    pub status: DeclarationStatus,
    pub timestamp: u64,
}

#[derive(Debug, Clone, Encode, Decode, TypeInfo, PartialEq, Eq)]
#[codec(crate = sails_rs::scale_codec)]
#[scale_info(crate = sails_rs::scale_info)]
pub enum Verdict {
    Pending,
    Verified,
    Failed,
    Expired,
}

#[derive(Debug, Clone, Encode, Decode, TypeInfo, PartialEq, Eq)]
#[codec(crate = sails_rs::scale_codec)]
#[scale_info(crate = sails_rs::scale_info)]
pub struct WitnessVote {
    pub witness: ActorId,
    pub verified: bool,
    pub weight: u32,
}

#[derive(Debug, Clone, Encode, Decode, TypeInfo, PartialEq, Eq)]
#[codec(crate = sails_rs::scale_codec)]
#[scale_info(crate = sails_rs::scale_info)]
pub struct Trial {
    pub id: u64,
    pub declaration: u64,
    pub declarer: ActorId,
    pub challenger: ActorId,
    pub declarer_stake: u128,
    pub challenger_stake: u128,
    pub deadline: u64,
    pub proof: Option<String>,
    pub witness_votes: Vec<WitnessVote>,
    pub verdict: Verdict,
}

#[derive(Debug, Clone, Encode, Decode, TypeInfo, PartialEq, Eq)]
#[codec(crate = sails_rs::scale_codec)]
#[scale_info(crate = sails_rs::scale_info)]
pub enum BadgeLevel {
    Bronze,
    Silver,
    Gold,
}

#[derive(Debug, Clone, Encode, Decode, TypeInfo, PartialEq, Eq)]
#[codec(crate = sails_rs::scale_codec)]
#[scale_info(crate = sails_rs::scale_info)]
pub struct Credential {
    pub agent: ActorId,
    pub category: String,
    pub level: BadgeLevel,
    pub trial_id: u64,
    pub minted_at: u64,
}

#[derive(Default)]
pub struct ProtocolState {
    agents: Vec<Agent>,
    declarations: Vec<CapabilityDeclaration>,
    trials: Vec<Trial>,
    credentials: Vec<Credential>,
    next_declaration_id: u64,
    next_trial_id: u64,
}

#[sails_rs::event]
#[derive(Debug, Clone, Encode, Decode, TypeInfo, PartialEq, Eq)]
#[codec(crate = sails_rs::scale_codec)]
#[scale_info(crate = sails_rs::scale_info)]
pub enum RegistryEvent {
    AgentRegistered {
        owner: ActorId,
        handle: String,
    },
    AgentDescriptionUpdated {
        owner: ActorId,
    },
}

#[sails_rs::event]
#[derive(Debug, Clone, Encode, Decode, TypeInfo, PartialEq, Eq)]
#[codec(crate = sails_rs::scale_codec)]
#[scale_info(crate = sails_rs::scale_info)]
pub enum DeclarationEvent {
    CapabilityDeclared {
        id: u64,
        agent: ActorId,
        category: String,
    },
    DeclarationWithdrawn {
        id: u64,
    },
}

#[sails_rs::event]
#[derive(Debug, Clone, Encode, Decode, TypeInfo, PartialEq, Eq)]
#[codec(crate = sails_rs::scale_codec)]
#[scale_info(crate = sails_rs::scale_info)]
pub enum TrialEvent {
    ChallengeIssued {
        trial_id: u64,
        declaration_id: u64,
        challenger: ActorId,
    },
    ProofSubmitted {
        trial_id: u64,
        declarer: ActorId,
    },
    WitnessVoted {
        trial_id: u64,
        witness: ActorId,
        verified: bool,
    },
    TrialVerdict {
        trial_id: u64,
        verdict: Verdict,
        rewarded: ActorId,
    },
}

#[sails_rs::event]
#[derive(Debug, Clone, Encode, Decode, TypeInfo, PartialEq, Eq)]
#[codec(crate = sails_rs::scale_codec)]
#[scale_info(crate = sails_rs::scale_info)]
pub enum CredentialEvent {
    CredentialMinted {
        agent: ActorId,
        category: String,
        level: BadgeLevel,
        trial_id: u64,
    },
}

pub struct RegistryService<'a> {
    state: &'a RefCell<ProtocolState>,
}

impl<'a> RegistryService<'a> {
    pub fn new(state: &'a RefCell<ProtocolState>) -> Self {
        Self { state }
    }
}

#[sails_rs::service(events = RegistryEvent)]
impl RegistryService<'_> {
    #[export]
    pub fn register_agent(&mut self, handle: String, description: String) {
        assert!(valid_handle(&handle), "Invalid handle");
        let owner = msg::source();
        let mut state = self.state.borrow_mut();
        assert!(
            state.agents.iter().all(|agent| agent.owner != owner),
            "Agent already registered"
        );
        assert!(
            state.agents.iter().all(|agent| agent.handle != handle),
            "Handle taken"
        );
        state.agents.push(Agent {
            handle: handle.clone(),
            owner,
            description,
            active: true,
            registration_block: u64::from(exec::block_height()),
        });
        self.emit_event(RegistryEvent::AgentRegistered { owner, handle })
            .expect("registry event should emit");
    }

    #[export]
    pub fn update_description(&mut self, description: String) {
        let owner = msg::source();
        let mut state = self.state.borrow_mut();
        let agent = state
            .agents
            .iter_mut()
            .find(|agent| agent.owner == owner)
            .expect("Agent not registered");
        agent.description = description;
        self.emit_event(RegistryEvent::AgentDescriptionUpdated { owner })
            .expect("registry event should emit");
    }

    #[export]
    pub fn get_agent(&self, owner: ActorId) -> Option<Agent> {
        self.state
            .borrow()
            .agents
            .iter()
            .find(|agent| agent.owner == owner)
            .cloned()
    }

    #[export]
    pub fn get_all_agents(&self) -> Vec<Agent> {
        self.state.borrow().agents.clone()
    }
}

pub struct DeclarationsService<'a> {
    state: &'a RefCell<ProtocolState>,
}

impl<'a> DeclarationsService<'a> {
    pub fn new(state: &'a RefCell<ProtocolState>) -> Self {
        Self { state }
    }
}

#[sails_rs::service(events = DeclarationEvent)]
impl DeclarationsService<'_> {
    #[export]
    pub fn declare_capability(&mut self, claim_text: String, category: String, stake: u128) -> u64 {
        assert!(!claim_text.is_empty(), "Claim required");
        assert!(!category.is_empty(), "Category required");
        let agent = msg::source();
        let mut state = self.state.borrow_mut();
        assert!(
            state
                .agents
                .iter()
                .any(|registered| registered.owner == agent && registered.active),
            "Agent not registered"
        );
        state.next_declaration_id += 1;
        let id = state.next_declaration_id;
        state.declarations.push(CapabilityDeclaration {
            id,
            agent,
            claim_text,
            category: category.clone(),
            stake,
            status: DeclarationStatus::Active,
            timestamp: u64::from(exec::block_height()),
        });
        self.emit_event(DeclarationEvent::CapabilityDeclared {
            id,
            agent,
            category,
        })
        .expect("declaration event should emit");
        id
    }

    #[export]
    pub fn withdraw_declaration(&mut self, declaration_id: u64) {
        let owner = msg::source();
        let mut state = self.state.borrow_mut();
        let declaration = state
            .declarations
            .iter_mut()
            .find(|item| item.id == declaration_id)
            .expect("Declaration not found");
        assert_eq!(declaration.agent, owner, "Unauthorized");
        assert_eq!(declaration.status, DeclarationStatus::Active, "Not active");
        declaration.status = DeclarationStatus::Withdrawn;
        self.emit_event(DeclarationEvent::DeclarationWithdrawn {
            id: declaration_id,
        })
        .expect("declaration event should emit");
    }

    #[export]
    pub fn get_declaration(&self, declaration_id: u64) -> Option<CapabilityDeclaration> {
        self.state
            .borrow()
            .declarations
            .iter()
            .find(|item| item.id == declaration_id)
            .cloned()
    }

    #[export]
    pub fn get_agent_declarations(&self, agent: ActorId) -> Vec<CapabilityDeclaration> {
        self.state
            .borrow()
            .declarations
            .iter()
            .filter(|item| item.agent == agent)
            .cloned()
            .collect()
    }

    #[export]
    pub fn get_all_active(&self) -> Vec<CapabilityDeclaration> {
        self.state
            .borrow()
            .declarations
            .iter()
            .filter(|item| item.status == DeclarationStatus::Active)
            .cloned()
            .collect()
    }
}

pub struct TrialsService<'a> {
    state: &'a RefCell<ProtocolState>,
}

impl<'a> TrialsService<'a> {
    pub fn new(state: &'a RefCell<ProtocolState>) -> Self {
        Self { state }
    }
}

#[sails_rs::service(events = TrialEvent)]
impl TrialsService<'_> {
    #[export]
    pub fn issue_challenge(
        &mut self,
        declaration_id: u64,
        challenger_stake: u128,
        duration_blocks: u64,
    ) -> u64 {
        let challenger = msg::source();
        let mut state = self.state.borrow_mut();
        let declaration = state
            .declarations
            .iter_mut()
            .find(|item| item.id == declaration_id)
            .expect("Declaration not found");
        assert_eq!(declaration.status, DeclarationStatus::Active, "Not active");
        assert_ne!(declaration.agent, challenger, "Cannot challenge self");
        declaration.status = DeclarationStatus::Challenged;
        let declarer = declaration.agent;
        let declarer_stake = declaration.stake;
        state.next_trial_id += 1;
        let trial_id = state.next_trial_id;
        let deadline = u64::from(exec::block_height()) + duration_blocks.max(100);
        state.trials.push(Trial {
            id: trial_id,
            declaration: declaration_id,
            declarer,
            challenger,
            declarer_stake,
            challenger_stake,
            deadline,
            proof: None,
            witness_votes: Vec::new(),
            verdict: Verdict::Pending,
        });
        self.emit_event(TrialEvent::ChallengeIssued {
            trial_id,
            declaration_id,
            challenger,
        })
        .expect("trial event should emit");
        trial_id
    }

    #[export]
    pub fn submit_proof(&mut self, trial_id: u64, proof: String) {
        assert!(!proof.is_empty(), "Proof required");
        let declarer = msg::source();
        let mut state = self.state.borrow_mut();
        let trial = state
            .trials
            .iter_mut()
            .find(|item| item.id == trial_id)
            .expect("Trial not found");
        assert_eq!(trial.verdict, Verdict::Pending, "Trial settled");
        assert_eq!(trial.declarer, declarer, "Unauthorized");
        assert!(u64::from(exec::block_height()) <= trial.deadline, "Trial expired");
        trial.proof = Some(proof);
        self.emit_event(TrialEvent::ProofSubmitted { trial_id, declarer })
            .expect("trial event should emit");
    }

    #[export]
    pub fn cast_witness_vote(&mut self, trial_id: u64, verified: bool, weight: u32) {
        let witness = msg::source();
        let mut state = self.state.borrow_mut();
        let trial = state
            .trials
            .iter_mut()
            .find(|item| item.id == trial_id)
            .expect("Trial not found");
        assert_eq!(trial.verdict, Verdict::Pending, "Trial settled");
        assert_ne!(trial.declarer, witness, "Declarer cannot vote");
        assert_ne!(trial.challenger, witness, "Challenger cannot vote");
        assert!(
            trial
                .witness_votes
                .iter()
                .all(|vote| vote.witness != witness),
            "Witness already voted"
        );
        trial.witness_votes.push(WitnessVote {
            witness,
            verified,
            weight: weight.max(1),
        });
        self.emit_event(TrialEvent::WitnessVoted {
            trial_id,
            witness,
            verified,
        })
        .expect("trial event should emit");
    }

    #[export]
    pub fn settle_trial(&mut self, trial_id: u64) -> Verdict {
        let mut state = self.state.borrow_mut();
        let trial_index = state
            .trials
            .iter()
            .position(|item| item.id == trial_id)
            .expect("Trial not found");
        assert_eq!(state.trials[trial_index].verdict, Verdict::Pending, "Trial settled");

        let proof_present = state.trials[trial_index].proof.is_some();
        let expired = u64::from(exec::block_height()) > state.trials[trial_index].deadline;
        let positive_weight: u32 = state.trials[trial_index]
            .witness_votes
            .iter()
            .filter(|vote| vote.verified)
            .map(|vote| vote.weight)
            .sum();
        let negative_weight: u32 = state.trials[trial_index]
            .witness_votes
            .iter()
            .filter(|vote| !vote.verified)
            .map(|vote| vote.weight)
            .sum();

        let verdict = if proof_present && positive_weight > negative_weight {
            Verdict::Verified
        } else if expired && !proof_present {
            Verdict::Expired
        } else if expired || negative_weight >= positive_weight {
            Verdict::Failed
        } else {
            panic!("Need more witness signal");
        };

        let declaration_id = state.trials[trial_index].declaration;
        let category = state
            .declarations
            .iter()
            .find(|item| item.id == declaration_id)
            .expect("Declaration not found")
            .category
            .clone();
        let rewarded = if verdict == Verdict::Verified {
            state.trials[trial_index].declarer
        } else {
            state.trials[trial_index].challenger
        };

        state.trials[trial_index].verdict = verdict.clone();
        if let Some(declaration) = state
            .declarations
            .iter_mut()
            .find(|item| item.id == declaration_id)
        {
            declaration.status = if verdict == Verdict::Verified {
                DeclarationStatus::Verified
            } else {
                DeclarationStatus::Failed
            };
        }

        if verdict == Verdict::Verified {
            let declarer = state.trials[trial_index].declarer;
            let declarer_stake = state.trials[trial_index].declarer_stake;
            let witness_count = state.trials[trial_index].witness_votes.len();
            let level = badge_level(declarer_stake, witness_count);
            state.credentials.push(Credential {
                agent: declarer,
                category: category.clone(),
                level: level.clone(),
                trial_id,
                minted_at: u64::from(exec::block_height()),
            });
            self.emit_event(TrialEvent::TrialVerdict {
                trial_id,
                verdict: verdict.clone(),
                rewarded,
            })
            .expect("trial event should emit");
        } else {
            self.emit_event(TrialEvent::TrialVerdict {
                trial_id,
                verdict: verdict.clone(),
                rewarded,
            })
            .expect("trial event should emit");
        }

        verdict
    }

    #[export]
    pub fn get_trial(&self, trial_id: u64) -> Option<Trial> {
        self.state
            .borrow()
            .trials
            .iter()
            .find(|item| item.id == trial_id)
            .cloned()
    }

    #[export]
    pub fn get_active_trial(&self, declaration_id: u64) -> Option<Trial> {
        self.state
            .borrow()
            .trials
            .iter()
            .find(|item| item.declaration == declaration_id && item.verdict == Verdict::Pending)
            .cloned()
    }

    #[export]
    pub fn get_all_trials(&self) -> Vec<Trial> {
        self.state.borrow().trials.clone()
    }
}

pub struct CredentialsService<'a> {
    state: &'a RefCell<ProtocolState>,
}

impl<'a> CredentialsService<'a> {
    pub fn new(state: &'a RefCell<ProtocolState>) -> Self {
        Self { state }
    }
}

#[sails_rs::service(events = CredentialEvent)]
impl CredentialsService<'_> {
    #[export]
    pub fn get_credential(&self, agent: ActorId, category: String) -> Option<Credential> {
        self.state
            .borrow()
            .credentials
            .iter()
            .rev()
            .find(|item| item.agent == agent && item.category == category)
            .cloned()
    }

    #[export]
    pub fn get_agent_credentials(&self, agent: ActorId) -> Vec<Credential> {
        self.state
            .borrow()
            .credentials
            .iter()
            .filter(|item| item.agent == agent)
            .cloned()
            .collect()
    }

    #[export]
    pub fn get_credentials_by_category(&self, category: String) -> Vec<Credential> {
        self.state
            .borrow()
            .credentials
            .iter()
            .filter(|item| item.category == category)
            .cloned()
            .collect()
    }

    #[export]
    pub fn get_verified_agents(&self) -> Vec<ActorId> {
        let mut agents = Vec::new();
        for credential in self.state.borrow().credentials.iter() {
            if !agents.contains(&credential.agent) {
                agents.push(credential.agent);
            }
        }
        agents
    }
}

pub struct Program {
    state: RefCell<ProtocolState>,
}

#[sails_rs::program]
impl Program {
    pub fn new() -> Self {
        Self {
            state: RefCell::new(ProtocolState::default()),
        }
    }

    pub fn registry(&self) -> RegistryService<'_> {
        RegistryService::new(&self.state)
    }

    pub fn declarations(&self) -> DeclarationsService<'_> {
        DeclarationsService::new(&self.state)
    }

    pub fn trials(&self) -> TrialsService<'_> {
        TrialsService::new(&self.state)
    }

    pub fn credentials(&self) -> CredentialsService<'_> {
        CredentialsService::new(&self.state)
    }
}

fn valid_handle(handle: &str) -> bool {
    let len = handle.len();
    (3..=32).contains(&len)
        && handle
            .bytes()
            .all(|byte| byte.is_ascii_lowercase() || byte.is_ascii_digit() || byte == b'-' || byte == b'_')
}

fn badge_level(stake: u128, witness_count: usize) -> BadgeLevel {
    if stake >= 10 && witness_count >= 3 {
        BadgeLevel::Gold
    } else if stake >= 5 && witness_count >= 2 {
        BadgeLevel::Silver
    } else {
        BadgeLevel::Bronze
    }
}
