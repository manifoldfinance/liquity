import { BigNumber } from "@ethersproject/bignumber";
import { Event } from "@ethersproject/contracts";

import { Decimal } from "@liquity/decimal";
import {
  ObservableLiquity,
  StabilityDeposit,
  Trove,
  TroveWithPendingRewards
} from "@liquity/lib-base";

import { LiquityContracts } from "./contracts";
import { EthersLiquityBase } from "./EthersLiquityBase";
import { ReadableEthersLiquity } from "./ReadableEthersLiquity";

const debouncingDelayMs = 50;

const debounce = (listener: (latestBlock: number) => void) => {
  let timeoutId: any = undefined;
  let latestBlock: number = 0;

  return (...args: any[]) => {
    const event = args[args.length - 1] as Event;

    if (event.blockNumber !== undefined && event.blockNumber > latestBlock) {
      latestBlock = event.blockNumber;
    }

    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      listener(latestBlock);
      timeoutId = undefined;
    }, debouncingDelayMs);
  };
};

export class ObservableEthersLiquity extends EthersLiquityBase implements ObservableLiquity {
  private readableLiquity: ReadableEthersLiquity;

  constructor(
    contracts: LiquityContracts,
    readableLiquity: ReadableEthersLiquity,
    userAddress?: string
  ) {
    super(contracts, userAddress);

    this.readableLiquity = readableLiquity;
  }

  watchTotalRedistributed(onTotalRedistributedChanged: (totalRedistributed: Trove) => void) {
    const etherSent = this.contracts.activePool.filters.EtherSent();

    const redistributionListener = debounce((blockTag: number) => {
      this.readableLiquity.getTotalRedistributed({ blockTag }).then(onTotalRedistributedChanged);
    });

    const etherSentListener = (toAddress: string, _amount: BigNumber, event: Event) => {
      if (toAddress === this.contracts.defaultPool.address) {
        redistributionListener(event);
      }
    };

    this.contracts.activePool.on(etherSent, etherSentListener);

    return () => {
      this.contracts.activePool.removeListener(etherSent, etherSentListener);
    };
  }

  watchTroveWithoutRewards(
    onTroveChanged: (trove: TroveWithPendingRewards) => void,
    address = this.requireAddress()
  ) {
    const { TroveCreated, TroveUpdated } = this.contracts.troveManager.filters;
    const troveEventFilters = [TroveCreated(address), TroveUpdated(address)];

    const troveListener = debounce((blockTag: number) => {
      this.readableLiquity.getTroveWithoutRewards(address, { blockTag }).then(onTroveChanged);
    });

    troveEventFilters.forEach(filter => this.contracts.troveManager.on(filter, troveListener));

    return () => {
      troveEventFilters.forEach(filter =>
        this.contracts.troveManager.removeListener(filter, troveListener)
      );
    };
  }

  watchNumberOfTroves(onNumberOfTrovesChanged: (numberOfTroves: number) => void) {
    const { TroveUpdated } = this.contracts.troveManager.filters;
    const troveUpdated = TroveUpdated();

    const troveUpdatedListener = debounce((blockTag: number) => {
      this.readableLiquity.getNumberOfTroves({ blockTag }).then(onNumberOfTrovesChanged);
    });

    this.contracts.troveManager.on(troveUpdated, troveUpdatedListener);

    return () => {
      this.contracts.troveManager.removeListener(troveUpdated, troveUpdatedListener);
    };
  }

  watchPrice(_onPriceChanged: (price: Decimal) => void): () => void {
    // TODO revisit
    // We no longer have our own PriceUpdated events. If we want to implement this in an event-based
    // manner, we'll need to listen to aggregator events directly. Or we could do polling.
    throw new Error("Method not implemented.");
  }

  watchTotal(onTotalChanged: (total: Trove) => void) {
    const { TroveUpdated } = this.contracts.troveManager.filters;
    const troveUpdated = TroveUpdated();

    const totalListener = debounce((blockTag: number) => {
      this.readableLiquity.getTotal({ blockTag }).then(onTotalChanged);
    });

    this.contracts.troveManager.on(troveUpdated, totalListener);

    return () => {
      this.contracts.troveManager.removeListener(troveUpdated, totalListener);
    };
  }

  watchStabilityDeposit(
    onStabilityDepositChanged: (deposit: StabilityDeposit) => void,
    address = this.requireAddress()
  ) {
    const { UserDepositChanged } = this.contracts.stabilityPool.filters;
    const { EtherSent } = this.contracts.activePool.filters;

    const userDepositChanged = UserDepositChanged(address);
    const etherSent = EtherSent();

    const depositListener = debounce((blockTag: number) => {
      this.readableLiquity
        .getStabilityDeposit(address, { blockTag })
        .then(onStabilityDepositChanged);
    });

    const etherSentListener = (toAddress: string, _amount: BigNumber, event: Event) => {
      if (toAddress === this.contracts.stabilityPool.address) {
        // Liquidation while Stability Pool has some deposits
        // There may be new gains
        depositListener(event);
      }
    };

    this.contracts.stabilityPool.on(userDepositChanged, depositListener);
    this.contracts.activePool.on(etherSent, etherSentListener);

    return () => {
      this.contracts.stabilityPool.removeListener(userDepositChanged, depositListener);
      this.contracts.activePool.removeListener(etherSent, etherSentListener);
    };
  }

  watchLUSDInStabilityPool(onLUSDInStabilityPoolChanged: (lusdInStabilityPool: Decimal) => void) {
    const { Transfer } = this.contracts.lusdToken.filters;

    const transferLUSDFromStabilityPool = Transfer(this.contracts.stabilityPool.address);
    const transferLUSDToStabilityPool = Transfer(null, this.contracts.stabilityPool.address);

    const stabilityPoolLUSDFilters = [transferLUSDFromStabilityPool, transferLUSDToStabilityPool];

    const stabilityPoolLUSDListener = debounce((blockTag: number) => {
      this.readableLiquity.getLUSDInStabilityPool({ blockTag }).then(onLUSDInStabilityPoolChanged);
    });

    stabilityPoolLUSDFilters.forEach(filter =>
      this.contracts.lusdToken.on(filter, stabilityPoolLUSDListener)
    );

    return () =>
      stabilityPoolLUSDFilters.forEach(filter =>
        this.contracts.lusdToken.removeListener(filter, stabilityPoolLUSDListener)
      );
  }

  watchLUSDBalance(
    onLUSDBalanceChanged: (balance: Decimal) => void,
    address = this.requireAddress()
  ) {
    const { Transfer } = this.contracts.lusdToken.filters;
    const transferLUSDFromUser = Transfer(address);
    const transferLUSDToUser = Transfer(null, address);

    const lusdTransferFilters = [transferLUSDFromUser, transferLUSDToUser];

    const lusdTransferListener = debounce((blockTag: number) => {
      this.readableLiquity.getLUSDBalance(address, { blockTag }).then(onLUSDBalanceChanged);
    });

    lusdTransferFilters.forEach(filter => this.contracts.lusdToken.on(filter, lusdTransferListener));

    return () =>
      lusdTransferFilters.forEach(filter =>
        this.contracts.lusdToken.removeListener(filter, lusdTransferListener)
      );
  }
}
