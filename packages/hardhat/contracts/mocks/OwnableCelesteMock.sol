pragma solidity ^0.5.8;

/**
 * @title GovernERC20 interface
 * @dev see https://github.com/ethereum/EIPs/issues/20
 */
contract GovernERC20 {
    function totalSupply() public view returns (uint256);

    function balanceOf(address _who) public view returns (uint256);

    function allowance(
        address _owner,
        address _spender
    ) public view returns (uint256);

    function transfer(address _to, uint256 _value) public returns (bool);

    function approve(address _spender, uint256 _value) public returns (bool);

    function transferFrom(
        address _from,
        address _to,
        uint256 _value
    ) public returns (bool);

    event Transfer(address indexed from, address indexed to, uint256 value);

    event Approval(
        address indexed owner,
        address indexed spender,
        uint256 value
    );
}

// File: contracts/arbitration/IArbitrator.sol

pragma solidity ^0.5.8;

interface IArbitrator {
    /**
     * @dev Create a dispute over the Arbitrable sender with a number of possible rulings
     * @param _possibleRulings Number of possible rulings allowed for the dispute
     * @param _metadata Optional metadata that can be used to provide additional information on the dispute to be created
     * @return Dispute identification number
     */
    function createDispute(
        uint256 _possibleRulings,
        bytes calldata _metadata
    ) external returns (uint256);

    /**
     * @dev Submit evidence for a dispute
     * @param _disputeId Id of the dispute in the Protocol
     * @param _submitter Address of the account submitting the evidence
     * @param _evidence Data submitted for the evidence related to the dispute
     */
    function submitEvidence(
        uint256 _disputeId,
        address _submitter,
        bytes calldata _evidence
    ) external;

    /**
     * @dev Close the evidence period of a dispute
     * @param _subject Arbitrable instance submitting the dispute
     * @param _disputeId Identification number of the dispute to close its evidence submitting period
     */
    function closeEvidencePeriod(
        IArbitrable _subject,
        uint256 _disputeId
    ) external;

    /**
     * @notice Rule dispute #`_disputeId` if ready
     * @param _disputeId Identification number of the dispute to be ruled
     * @return subject Arbitrable instance associated to the dispute
     * @return ruling Ruling number computed for the given dispute
     */
    function rule(
        uint256 _disputeId
    ) external returns (IArbitrable subject, uint256 ruling);

    /**
     * @dev Tell the dispute fees information to create a dispute
     * @return recipient Address where the corresponding dispute fees must be transferred to
     * @return feeToken GovernERC20 token used for the fees
     * @return feeAmount Total amount of fees that must be allowed to the recipient
     */
    function getDisputeFees()
        external
        view
        returns (address recipient, GovernERC20 feeToken, uint256 feeAmount);
}

// File: contracts/lib/os/SafeGovernERC20.sol

// Brought from https://github.com/aragon/aragonOS/blob/v4.3.0/contracts/common/SafeGovernERC20.sol
// Adapted to use pragma ^0.5.8 and satisfy our linter rules

pragma solidity ^0.5.8;

library SafeGovernERC20 {
    // Before 0.5, solidity has a mismatch between `address.transfer()` and `token.transfer()`:
    // https://github.com/ethereum/solidity/issues/3544
    bytes4 private constant TRANSFER_SELECTOR = 0xa9059cbb;

    /**
     * @dev Same as a standards-compliant GovernERC20.transfer() that never reverts (returns false).
     *      Note that this makes an external call to the token.
     */
    function safeTransfer(
        GovernERC20 _token,
        address _to,
        uint256 _amount
    ) internal returns (bool) {
        bytes memory transferCallData = abi.encodeWithSelector(
            TRANSFER_SELECTOR,
            _to,
            _amount
        );
        return invokeAndCheckSuccess(address(_token), transferCallData);
    }

    /**
     * @dev Same as a standards-compliant GovernERC20.transferFrom() that never reverts (returns false).
     *      Note that this makes an external call to the token.
     */
    function safeTransferFrom(
        GovernERC20 _token,
        address _from,
        address _to,
        uint256 _amount
    ) internal returns (bool) {
        bytes memory transferFromCallData = abi.encodeWithSelector(
            _token.transferFrom.selector,
            _from,
            _to,
            _amount
        );
        return invokeAndCheckSuccess(address(_token), transferFromCallData);
    }

    /**
     * @dev Same as a standards-compliant GovernERC20.approve() that never reverts (returns false).
     *      Note that this makes an external call to the token.
     */
    function safeApprove(
        GovernERC20 _token,
        address _spender,
        uint256 _amount
    ) internal returns (bool) {
        bytes memory approveCallData = abi.encodeWithSelector(
            _token.approve.selector,
            _spender,
            _amount
        );
        return invokeAndCheckSuccess(address(_token), approveCallData);
    }

    function invokeAndCheckSuccess(
        address _addr,
        bytes memory _calldata
    ) private returns (bool) {
        bool ret;
        assembly {
            let ptr := mload(0x40) // free memory pointer

            let success := call(
                gas, // forward all gas
                _addr, // address
                0, // no value
                add(_calldata, 0x20), // calldata start
                mload(_calldata), // calldata length
                ptr, // write output over free memory
                0x20 // uint256 return
            )

            if gt(success, 0) {
                // Check number of bytes returned from last function call
                switch returndatasize
                // No bytes returned: assume success
                case 0 {
                    ret := 1
                }
                // 32 bytes returned: check if non-zero
                case 0x20 {
                    // Only return success if returned data was true
                    // Already have output in ptr
                    ret := eq(mload(ptr), 1)
                }
                // Not sure what was returned: don't mark as success
                default {

                }
            }
        }
        return ret;
    }
}

contract IArbitrable {
    /**
     * @dev Emitted when an IArbitrable instance's dispute is ruled by an IArbitrator
     * @param arbitrator IArbitrator instance ruling the dispute
     * @param disputeId Identification number of the dispute being ruled by the arbitrator
     * @param ruling Ruling given by the arbitrator
     */
    event Ruled(
        IArbitrator indexed arbitrator,
        uint256 indexed disputeId,
        uint256 ruling
    );
}

// File: contracts/ownable-celeste/OwnableCeleste.sol

pragma solidity ^0.5.8;

contract OwnableCeleste is IArbitrator {
    using SafeGovernERC20 for GovernERC20;

    // Note that Aragon Court treats the possible outcomes as arbitrary numbers, leaving the Arbitrable (us) to define how to understand them.
    // Some outcomes [0, 1, and 2] are reserved by Aragon Court: "missing", "leaked", and "refused", respectively.
    // This Arbitrable introduces the concept of the challenger/submitter (a binary outcome) as 3/4.
    // Note that Aragon Court emits the lowest outcome in the event of a tie, and so for us, we prefer the challenger.
    uint256 private constant DISPUTES_NOT_RULED = 0;
    uint256 private constant DISPUTES_RULING_CHALLENGER = 3;
    uint256 private constant DISPUTES_RULING_SUBMITTER = 4;

    enum State {
        NOT_DISPUTED,
        DISPUTED,
        DISPUTES_NOT_RULED,
        DISPUTES_RULING_CHALLENGER,
        DISPUTES_RULING_SUBMITTER
    }

    struct Dispute {
        IArbitrable subject;
        State state;
    }

    enum DisputeState {
        PreDraft,
        Adjudicating,
        Ruled
    }

    enum AdjudicationState {
        Invalid,
        Committing,
        Revealing,
        Appealing,
        ConfirmingAppeal,
        Ended
    }

    /**
     * @dev Ensure a dispute exists
     * @param _disputeId Identification number of the dispute to be ensured
     */
    modifier disputeExists(uint256 _disputeId) {
        require(_disputeId <= currentId, "DM_DISPUTE_DOES_NOT_EXIST");
        _;
    }

    GovernERC20 public feeToken;
    uint256 public feeAmount;
    uint256 public currentId;
    address public owner;
    // Last ensured term id
    uint64 private termId;
    mapping(uint256 => Dispute) public disputes;
    address feesUpdater;

    modifier onlyOwner() {
        require(msg.sender == owner, "ERR:NOT_OWNER");
        _;
    }

    // Events
    event Heartbeat(uint64 previousTermId, uint64 currentTermId);
    event StartTimeDelayed(uint64 previousStartTime, uint64 currentStartTime);

    event DisputeStateChanged(
        uint256 indexed disputeId,
        DisputeState indexed state
    );
    event EvidenceSubmitted(
        uint256 indexed disputeId,
        address indexed submitter,
        bytes evidence
    );
    event EvidencePeriodClosed(
        uint256 indexed disputeId,
        uint64 indexed termId
    );
    event NewDispute(
        uint256 indexed disputeId,
        IArbitrable indexed subject,
        uint64 indexed draftTermId,
        uint64 jurorsNumber,
        bytes metadata
    );
    event JurorDrafted(
        uint256 indexed disputeId,
        uint256 indexed roundId,
        address indexed juror
    );
    event RulingAppealed(
        uint256 indexed disputeId,
        uint256 indexed roundId,
        uint8 ruling
    );
    event RulingAppealConfirmed(
        uint256 indexed disputeId,
        uint256 indexed roundId,
        uint64 indexed draftTermId,
        uint256 jurorsNumber
    );
    event RulingComputed(uint256 indexed disputeId, uint8 indexed ruling);
    event PenaltiesSettled(
        uint256 indexed disputeId,
        uint256 indexed roundId,
        uint256 collectedTokens
    );
    event RewardSettled(
        uint256 indexed disputeId,
        uint256 indexed roundId,
        address juror,
        uint256 tokens,
        uint256 fees
    );
    event AppealDepositSettled(
        uint256 indexed disputeId,
        uint256 indexed roundId
    );
    event MaxJurorsPerDraftBatchChanged(
        uint64 previousMaxJurorsPerDraftBatch,
        uint64 currentMaxJurorsPerDraftBatch
    );

    constructor(GovernERC20 _feeToken, uint256 _feeAmount) public {
        owner = msg.sender;
        feeToken = _feeToken;
        feeAmount = _feeAmount;
    }

    /**
     * @dev Draft jurors for the next round of a dispute
     * @param _disputeId Identification number of the dispute to be drafted
     */
    function draft(uint256 _disputeId) external disputeExists(_disputeId) {
        emit JurorDrafted(_disputeId, 0, address(this));
        emit DisputeStateChanged(_disputeId, DisputeState.Adjudicating);
    }

    /**
     * @notice Transition up to `_maxRequestedTransitions` terms
     * @param _maxRequestedTransitions Max number of term transitions allowed by the sender
     * @return Identification number of the term ID after executing the heartbeat transitions
     */
    function heartbeat(
        uint64 _maxRequestedTransitions
    ) external returns (uint64) {
        uint64 previousTermId = termId;
        uint64 currentTermId = previousTermId + _maxRequestedTransitions;
        termId = currentTermId;
        emit Heartbeat(previousTermId, currentTermId);
        return termId;
    }

    /**
     * @notice Delay the Court start time to `_newFirstTermStartTime`
     * @param _newFirstTermStartTime New timestamp in seconds when the court will open
     */
    function delayStartTime(uint64 _newFirstTermStartTime) public {
        emit StartTimeDelayed(0, _newFirstTermStartTime);
    }

    /**
     * @notice Close the evidence period of dispute #`_disputeId`
     * @param _subject IArbitrable instance requesting to close the evidence submission period
     * @param _disputeId Identification number of the dispute to close its evidence submitting period
     */
    function closeEvidencePeriod(
        IArbitrable _subject,
        uint256 _disputeId
    ) external {
        Dispute storage dispute = disputes[_disputeId];
        require(dispute.subject == _subject, "DM_SUBJECT_NOT_DISPUTE_SUBJECT");
        emit EvidencePeriodClosed(_disputeId, 0);
    }

    /**
     * @notice Submit evidence for a dispute #`_disputeId`
     * @param _disputeId Identification number of the dispute receiving new evidence
     * @param _submitter Address of the account submitting the evidence
     * @param _evidence Data submitted for the evidence of the dispute
     */
    function submitEvidence(
        uint256 _disputeId,
        address _submitter,
        bytes calldata _evidence
    ) external disputeExists(_disputeId) {
        Dispute storage dispute = disputes[_disputeId];
        require(
            dispute.subject == IArbitrable(msg.sender),
            "DM_SUBJECT_NOT_DISPUTE_SUBJECT"
        );
        emit EvidenceSubmitted(_disputeId, _submitter, _evidence);
    }

    /**
     * @dev Create a dispute over the Arbitrable sender with a number of possible rulings
     * @param _possibleRulings Number of possible rulings allowed for the dispute
     * @param _metadata Optional metadata that can be used to provide additional information on the dispute to be created
     * @return Dispute identification number
     */
    function createDispute(
        uint256 _possibleRulings,
        bytes calldata _metadata
    ) external returns (uint256) {
        uint256 disputeId = currentId;
        disputes[disputeId] = Dispute(IArbitrable(msg.sender), State.DISPUTED);
        currentId++;

        require(
            feeToken.safeTransferFrom(msg.sender, address(this), feeAmount),
            "ERR:DEPOSIT_FAILED"
        );

        emit NewDispute(disputeId, IArbitrable(msg.sender), 0, 3, _metadata);

        return disputeId;
    }

    function setOwner(address _owner) public onlyOwner {
        owner = _owner;
    }

    function decideDispute(
        uint256 _disputeId,
        State _state
    ) external onlyOwner {
        require(
            _state != State.NOT_DISPUTED && _state != State.DISPUTED,
            "ERR:OUTCOME_NOT_ASSIGNABLE"
        );

        Dispute storage dispute = disputes[_disputeId];
        require(dispute.state == State.DISPUTED, "ERR:NOT_DISPUTED");

        dispute.state = _state;
    }

    /**
     * @notice Rule dispute #`_disputeId` if ready
     * @param _disputeId Identification number of the dispute to be ruled
     * @return subject Arbitrable instance associated to the dispute
     * @return ruling Ruling number computed for the given dispute
     */
    function rule(
        uint256 _disputeId
    ) external returns (IArbitrable subject, uint256 ruling) {
        Dispute storage dispute = disputes[_disputeId];

        if (dispute.state == State.DISPUTES_RULING_CHALLENGER) {
            return (dispute.subject, DISPUTES_RULING_CHALLENGER);
        } else if (dispute.state == State.DISPUTES_RULING_SUBMITTER) {
            return (dispute.subject, DISPUTES_RULING_SUBMITTER);
        } else if (dispute.state == State.DISPUTES_NOT_RULED) {
            return (dispute.subject, DISPUTES_NOT_RULED);
        } else {
            revert("UNEXPECTED_STATE");
        }
    }

    /**
     * @dev Tell the dispute fees information to create a dispute
     * @return recipient Address where the corresponding dispute fees must be transferred to
     * @return feeToken GovernERC20 token used for the fees
     * @return feeAmount Total amount of fees that must be allowed to the recipient
     */
    function getDisputeFees()
        external
        view
        returns (address, GovernERC20, uint256)
    {
        return (address(this), feeToken, feeAmount);
    }

    function getDisputeManager() external view returns (address) {
        return address(this);
    }

    function computeRuling(
        uint256 _disputeId
    ) external returns (IArbitrable subject, State finalRuling) {
        Dispute storage dispute = disputes[_disputeId];
        subject = dispute.subject;
        finalRuling = dispute.state;
    }
}
